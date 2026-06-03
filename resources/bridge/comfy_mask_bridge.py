import argparse
import importlib.util
import json
import os
import sys
import types
from pathlib import Path

import torch
from PIL import Image


DEFAULT_PLUGIN_PATH = Path(__file__).resolve().with_name("inpaint_cropandstitch.py")
PLUGIN_PATH = Path(os.environ.get("COMFY_PLUGIN_PATH", str(DEFAULT_PLUGIN_PATH)))
DEFAULT_MASK_EXPAND_PIXELS = 80
DEFAULT_MASK_BLEND_PIXELS = 64
DEFAULT_OUTPUT_PADDING = "8"
ALPHA_THRESHOLD = 16


def install_comfy_shims():
    """
    Provide minimal ComfyUI modules expected by ComfyUI-Inpaint-CropAndStitch.
    This keeps the runtime portable without bundling a full ComfyUI tree.
    """
    comfy_module = types.ModuleType("comfy")
    comfy_utils_module = types.ModuleType("comfy.utils")
    comfy_model_management_module = types.ModuleType("comfy.model_management")

    def get_torch_device():
        return torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")

    comfy_model_management_module.get_torch_device = get_torch_device
    comfy_module.utils = comfy_utils_module
    comfy_module.model_management = comfy_model_management_module

    nodes_module = types.ModuleType("nodes")
    nodes_module.MAX_RESOLUTION = 65536

    sys.modules["comfy"] = comfy_module
    sys.modules["comfy.utils"] = comfy_utils_module
    sys.modules["comfy.model_management"] = comfy_model_management_module
    sys.modules["nodes"] = nodes_module


def ensure_imports():
    if not PLUGIN_PATH.exists():
        raise RuntimeError(f"Inpaint plugin not found: {PLUGIN_PATH}")
    install_comfy_shims()
    sys.path.insert(0, str(PLUGIN_PATH.parent))
    spec = importlib.util.spec_from_file_location("inpaint_cropandstitch", PLUGIN_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def pil_to_bhwc(image: Image.Image) -> torch.Tensor:
    rgba = image.convert("RGBA")
    rgb = rgba.convert("RGB")
    tensor = torch.from_numpy(__import__("numpy").array(rgb)).float() / 255.0
    return tensor.unsqueeze(0)


def alpha_to_bhw(mask_image: Image.Image) -> torch.Tensor:
    rgba = mask_image.convert("RGBA")
    alpha = torch.from_numpy(__import__("numpy").array(rgba.getchannel("A"))).float() / 255.0
    return alpha.unsqueeze(0)


def tensor_image_to_pil(image: torch.Tensor) -> Image.Image:
    image = image.detach().cpu().clamp(0.0, 1.0)
    if image.dim() == 4:
        image = image[0]
    array = (image.numpy() * 255.0).round().astype("uint8")
    return Image.fromarray(array)


def apply_poisson_blend(stitched_pil: Image.Image, original_path: str, mask_path: str) -> Image.Image:
    try:
        import cv2
        import numpy as np
    except Exception:
        return stitched_pil

    if not original_path or not mask_path:
        return stitched_pil
    if not Path(original_path).exists() or not Path(mask_path).exists():
        return stitched_pil

    original_rgb = Image.open(original_path).convert("RGB")
    stitched_rgb = stitched_pil.convert("RGB")
    if stitched_rgb.size != original_rgb.size:
        resampling = getattr(getattr(Image, "Resampling", Image), "LANCZOS", Image.LANCZOS)
        stitched_rgb = stitched_rgb.resize(original_rgb.size, resampling)

    mask_alpha = Image.open(mask_path).convert("RGBA").getchannel("A")
    if mask_alpha.size != original_rgb.size:
        resampling = getattr(getattr(Image, "Resampling", Image), "NEAREST", Image.NEAREST)
        mask_alpha = mask_alpha.resize(original_rgb.size, resampling)

    mask_np = np.array(mask_alpha, dtype=np.uint8)
    binary_mask = (mask_np >= ALPHA_THRESHOLD).astype(np.uint8) * 255
    if binary_mask.max() == 0:
        return stitched_rgb

    ys, xs = np.where(binary_mask > 0)
    center = (int(round((xs.min() + xs.max()) / 2)), int(round((ys.min() + ys.max()) / 2)))

    original_bgr = cv2.cvtColor(np.array(original_rgb, dtype=np.uint8), cv2.COLOR_RGB2BGR)
    stitched_bgr = cv2.cvtColor(np.array(stitched_rgb, dtype=np.uint8), cv2.COLOR_RGB2BGR)
    try:
        mixed_bgr = cv2.seamlessClone(stitched_bgr, original_bgr, binary_mask, center, cv2.MIXED_CLONE)
    except Exception:
        return stitched_rgb
    mixed_rgb = cv2.cvtColor(mixed_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(mixed_rgb)


def do_crop(args):
    module = ensure_imports()
    cropper = module.InpaintCropImproved()
    image = pil_to_bhwc(Image.open(args.image))
    mask = alpha_to_bhw(Image.open(args.mask))

    stitcher, cropped_image, _cropped_mask = cropper.inpaint_crop(
        image=image,
        downscale_algorithm="lanczos",
        upscale_algorithm="lanczos",
        preresize=False,
        preresize_mode="ensure minimum resolution",
        preresize_min_width=1024,
        preresize_min_height=1024,
        preresize_max_width=16384,
        preresize_max_height=16384,
        extend_for_outpainting=False,
        extend_up_factor=1,
        extend_down_factor=1,
        extend_left_factor=1,
        extend_right_factor=1,
        mask_hipass_filter=0.1,
        mask_fill_holes=True,
        mask_expand_pixels=args.mask_expand_pixels,
        mask_invert=False,
        mask_blend_pixels=args.mask_blend_pixels,
        context_from_mask_extend_factor=1,
        output_resize_to_target_size=True,
        output_target_width=args.target_width,
        output_target_height=args.target_height,
        output_padding=args.output_padding,
        device_mode="gpu (much faster)",
        mask=mask,
        optional_context_mask=None,
    )

    crop_path = Path(args.crop_out)
    crop_path.parent.mkdir(parents=True, exist_ok=True)
    tensor_image_to_pil(cropped_image).save(crop_path)

    stitcher_path = Path(args.stitcher_out)
    stitcher_path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(stitcher, stitcher_path)

    print(json.dumps({"crop_path": str(crop_path), "stitcher_path": str(stitcher_path)}))


def do_stitch(args):
    module = ensure_imports()
    stitcher_node = module.InpaintStitchImproved()
    stitcher = torch.load(args.stitcher, map_location="cpu", weights_only=False)
    inpainted_image = pil_to_bhwc(Image.open(args.image))
    (output_image,) = stitcher_node.inpaint_stitch(stitcher, inpainted_image)
    output_pil = tensor_image_to_pil(output_image)

    if args.original and args.mask:
        output_pil = apply_poisson_blend(output_pil, args.original, args.mask)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_pil.save(output_path)
    print(json.dumps({"output_path": str(output_path)}))


def main():
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    crop = subparsers.add_parser("crop")
    crop.add_argument("--image", required=True)
    crop.add_argument("--mask", required=True)
    crop.add_argument("--target-width", type=int, required=True)
    crop.add_argument("--target-height", type=int, required=True)
    crop.add_argument("--crop-out", required=True)
    crop.add_argument("--stitcher-out", required=True)
    crop.add_argument("--mask-expand-pixels", type=int, default=DEFAULT_MASK_EXPAND_PIXELS)
    crop.add_argument("--mask-blend-pixels", type=int, default=DEFAULT_MASK_BLEND_PIXELS)
    crop.add_argument("--output-padding", default=DEFAULT_OUTPUT_PADDING)

    stitch = subparsers.add_parser("stitch")
    stitch.add_argument("--stitcher", required=True)
    stitch.add_argument("--image", required=True)
    stitch.add_argument("--output", required=True)
    stitch.add_argument("--original")
    stitch.add_argument("--mask")

    args = parser.parse_args()
    if args.command == "crop":
      do_crop(args)
    else:
      do_stitch(args)


if __name__ == "__main__":
    main()
