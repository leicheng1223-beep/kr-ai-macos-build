#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const asarPath = path.join(repoRoot, "resources", "app.asar");
const extractDir = path.join(repoRoot, ".asar-extract");
const requiredDirs = ["dist", "dist-electron"];

const hasRecoveredApp = requiredDirs.every((name) => fs.existsSync(path.join(repoRoot, name)));
if (hasRecoveredApp && process.env.FORCE_ASAR_RECOVER !== "1") {
  console.log("dist/ and dist-electron/ already exist; skipping app.asar extraction.");
  process.exit(0);
}

if (!fs.existsSync(asarPath)) {
  console.error(`Cannot recover Electron app: missing ${asarPath}`);
  process.exit(1);
}

fs.rmSync(extractDir, { recursive: true, force: true });
fs.mkdirSync(extractDir, { recursive: true });

const npxCommand = process.platform === "win32" ? "cmd.exe" : "npx";
const npxArgs = process.platform === "win32"
  ? ["/d", "/s", "/c", "npx.cmd", "--yes", "@electron/asar", "extract", asarPath, extractDir]
  : ["--yes", "@electron/asar", "extract", asarPath, extractDir];
const result = spawnSync(npxCommand, npxArgs, {
  cwd: repoRoot,
  stdio: "inherit",
  shell: false,
});
if (result.error) {
  console.error(`Failed to run @electron/asar: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

for (const name of requiredDirs) {
  const source = path.join(extractDir, name);
  const target = path.join(repoRoot, name);
  if (!fs.existsSync(source)) {
    console.error(`Recovered asar is missing ${name}/`);
    process.exit(1);
  }
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

fs.rmSync(extractDir, { recursive: true, force: true });
console.log("Recovered dist/ and dist-electron/ from resources/app.asar");
