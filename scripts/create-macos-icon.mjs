#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const source = process.argv[2] || path.join(repoRoot, "resources", "assets", "beibei-icon.png");
const iconset = path.join(repoRoot, "build", "icons", "icon.iconset");
const output = path.join(repoRoot, "build", "icons", "icon.icns");

if (process.platform !== "darwin") {
  console.error("macOS icon generation requires sips and iconutil, so this script must run on macOS.");
  process.exit(2);
}

if (!fs.existsSync(source)) {
  console.error(`Icon source not found: ${source}`);
  process.exit(1);
}

fs.rmSync(iconset, { recursive: true, force: true });
fs.mkdirSync(iconset, { recursive: true });

const sizes = [
  [16, "icon_16x16.png"],
  [32, "icon_16x16@2x.png"],
  [32, "icon_32x32.png"],
  [64, "icon_32x32@2x.png"],
  [128, "icon_128x128.png"],
  [256, "icon_128x128@2x.png"],
  [256, "icon_256x256.png"],
  [512, "icon_256x256@2x.png"],
  [512, "icon_512x512.png"],
  [1024, "icon_512x512@2x.png"],
];

for (const [size, name] of sizes) {
  const result = spawnSync("sips", ["-z", String(size), String(size), source, "--out", path.join(iconset, name)], {
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const result = spawnSync("iconutil", ["-c", "icns", iconset, "-o", output], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(`Created ${output}`);
