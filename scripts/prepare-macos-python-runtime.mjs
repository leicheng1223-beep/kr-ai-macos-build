#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getBridgePythonRelativePath } from "./runtime-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const runtimeKey = process.argv[2];
const force = process.argv.includes("--force");
const pythonArgIndex = process.argv.indexOf("--python");
const explicitPython = pythonArgIndex >= 0 ? process.argv[pythonArgIndex + 1] : "";

const supported = new Set(["darwin-arm64", "darwin-x64"]);
if (!supported.has(runtimeKey)) {
  console.error("Usage: node scripts/prepare-macos-python-runtime.mjs <darwin-arm64|darwin-x64> [--python /path/to/python3] [--force]");
  process.exit(2);
}

if (process.platform !== "darwin") {
  console.error("This script must run on macOS. Use docs/MACOS_PORTING.md for manual preparation details.");
  process.exit(2);
}

const arch = runtimeKey === "darwin-arm64" ? "arm64" : "x64";
const runtimeRoot = path.join(repoRoot, "resources", "bridge-runtime", runtimeKey, "python");
const runtimePython = path.join(repoRoot, "resources", getBridgePythonRelativePath("darwin", arch));
const requirements = [
  "numpy",
  "Pillow",
  "onnxruntime",
  "torch",
  "torchvision",
  "scipy",
  "opencv-python",
];

function run(command, args, options = {}) {
  console.log(`$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runForArch(command, args) {
  if (runtimeKey === "darwin-x64" && process.arch === "arm64" && !explicitPython) {
    run("arch", ["-x86_64", command, ...args]);
    return;
  }
  run(command, args);
}

if (fs.existsSync(runtimeRoot)) {
  if (!force) {
    console.error(`Runtime already exists: ${runtimeRoot}`);
    console.error("Pass --force to recreate it.");
    process.exit(1);
  }
  fs.rmSync(runtimeRoot, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(runtimeRoot), { recursive: true });

const python = explicitPython || "python3";
runForArch(python, ["-m", "venv", runtimeRoot]);
run(runtimePython, ["-m", "pip", "install", "--upgrade", "pip", "setuptools", "wheel"]);
run(runtimePython, ["-m", "pip", "install", ...requirements]);
run(runtimePython, [
  "-c",
  "import numpy, PIL, onnxruntime, torch, torchvision, scipy; print('macOS bridge runtime OK')",
]);

console.log(`Prepared ${runtimeKey} Python runtime at ${runtimePython}`);
