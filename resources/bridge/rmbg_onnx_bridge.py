import argparse
import json
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image


try:
    _RESAMPLING = Image.Resampling
except AttributeError:
    _RESAMPLING = Image


def _resolve_input_size(session: ort.InferenceSession) -> tuple[int, int]:
    shape = session.get_inputs()[0].shape
    width = 1024
    height = 1024
    if len(shape) >= 4:
        maybe_h = shape[2]
        maybe_w = shape[3]
        if isinstance(maybe_h, int) and maybe_h > 0:
            height = maybe_h
        if isinstance(maybe_w, int) and maybe_w > 0:
            width = maybe_w
    return width, height


def _normalize_to_uint8(mask: np.ndarray) -> np.ndarray:
    safe = np.asarray(mask, dtype=np.float32)
    if safe.size == 0:
        return np.zeros((1, 1), dtype=np.uint8)
    min_v = float(np.min(safe))
    max_v = float(np.max(safe))
    if min_v < 0.0 or max_v > 1.0:
        safe = 1.0 / (1.0 + np.exp(-safe))
        min_v = float(np.min(safe))
        max_v = float(np.max(safe))
    if max_v - min_v < 1e-6:
        return np.zeros_like(safe, dtype=np.uint8)
    normalized = (safe - min_v) / (max_v - min_v)
    return np.clip(normalized * 255.0, 0.0, 255.0).astype(np.uint8)


def _extract_mask(output: np.ndarray) -> np.ndarray:
    value = np.asarray(output)
    if value.ndim == 4:
        if value.shape[1] <= 4:
            value = value[0, 0, :, :]
        elif value.shape[-1] <= 4:
            value = value[0, :, :, 0]
        else:
            value = value[0, 0, :, :]
    elif value.ndim == 3:
        if value.shape[0] <= 4:
            value = value[0, :, :]
        elif value.shape[-1] <= 4:
            value = value[:, :, 0]
    elif value.ndim == 2:
        return value
    else:
        return np.zeros((1, 1), dtype=np.float32)
    return value


def _preprocess(image: Image.Image, target_width: int, target_height: int) -> np.ndarray:
    rgb = image.convert("RGB").resize((target_width, target_height), _RESAMPLING.BILINEAR)
    array = np.asarray(rgb, dtype=np.float32) / 255.0
    tensor = np.transpose(array, (2, 0, 1))[None, ...]
    tensor = tensor - 0.5
    return tensor.astype(np.float32)


def _create_session(model_path: str) -> ort.InferenceSession:
    options = ort.SessionOptions()
    options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_DISABLE_ALL
    options.enable_mem_pattern = False
    options.enable_cpu_mem_arena = True
    options.log_severity_level = 3
    providers = ["CPUExecutionProvider"]
    return ort.InferenceSession(
        model_path,
        providers=providers,
        sess_options=options,
    )


def remove_background(image_path: str, output_path: str, model_path: str):
    image_file = Path(image_path)
    if not image_file.exists():
        raise FileNotFoundError(f"Source image not found: {image_path}")
    model_file = Path(model_path)
    if not model_file.exists():
        raise FileNotFoundError(f"RMBG model not found: {model_path}")

    source = Image.open(image_file).convert("RGBA")
    session = _create_session(str(model_file))
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    target_width, target_height = _resolve_input_size(session)
    model_input = _preprocess(source, target_width, target_height)
    output = session.run([output_name], {input_name: model_input})[0]
    mask = _extract_mask(output)
    alpha_uint8 = _normalize_to_uint8(mask)
    alpha_image = Image.fromarray(alpha_uint8, mode="L").resize(source.size, _RESAMPLING.BILINEAR)

    original_alpha = source.getchannel("A")
    original_alpha_np = np.asarray(original_alpha, dtype=np.float32)
    mask_alpha_np = np.asarray(alpha_image, dtype=np.float32)
    mixed_alpha = np.clip((original_alpha_np / 255.0) * (mask_alpha_np / 255.0) * 255.0, 0.0, 255.0).astype(np.uint8)
    source.putalpha(Image.fromarray(mixed_alpha, mode="L"))

    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    source.save(output_file, format="PNG")
    print(json.dumps({"output_path": str(output_file)}))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--model", required=True)
    args = parser.parse_args()
    remove_background(args.image, args.output, args.model)


if __name__ == "__main__":
    main()
