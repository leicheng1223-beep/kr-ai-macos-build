#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  formatBridgePythonError,
  getBridgePythonRelativePath,
  getBridgeResourcePath,
  resolveBridgePythonPath,
} from "./runtime-paths.mjs";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const skipBridgeExec = process.argv.includes("--skip-bridge-exec") || process.env.SMOKE_SKIP_BRIDGE_EXEC === "1";

function fakeExists(paths) {
  const normalized = new Set(paths.map((item) => path.normalize(item)));
  return (candidate) => normalized.has(path.normalize(candidate));
}

function testPythonRuntimeResolution() {
  const winResources = path.win32.join("C:", "Apps", "Kr ai", "resources");
  const winPython = path.join(winResources, "bridge-runtime", "python", "python.exe");
  assert.equal(
    resolveBridgePythonPath({
      isPackaged: true,
      resourcesPath: winResources,
      platform: "win32",
      arch: "x64",
      env: {},
      existsSync: fakeExists([winPython]),
    }).path,
    winPython,
  );

  const macResources = "/Applications/Kr ai.app/Contents/Resources";
  const armPython = path.join(macResources, "bridge-runtime", "darwin-arm64", "python", "bin", "python3");
  assert.equal(
    resolveBridgePythonPath({
      isPackaged: true,
      resourcesPath: macResources,
      platform: "darwin",
      arch: "arm64",
      env: {},
      existsSync: fakeExists([armPython]),
    }).path,
    armPython,
  );

  const x64Python = path.join(macResources, "bridge-runtime", "darwin-x64", "python", "bin", "python3");
  assert.equal(
    resolveBridgePythonPath({
      isPackaged: true,
      resourcesPath: macResources,
      platform: "darwin",
      arch: "x64",
      env: {},
      existsSync: fakeExists([x64Python]),
    }).path,
    x64Python,
  );

  const devFallback = resolveBridgePythonPath({
    isPackaged: false,
    appPath: "/repo",
    platform: "darwin",
    arch: "arm64",
    env: {},
    existsSync: () => false,
  });
  assert.equal(devFallback.path, "python3");
  assert.equal(devFallback.source, "system");

  const missingPackaged = resolveBridgePythonPath({
    isPackaged: true,
    resourcesPath: macResources,
    platform: "darwin",
    arch: "arm64",
    env: {},
    existsSync: () => false,
  });
  assert.equal(missingPackaged.path, null);
  assert.match(formatBridgePythonError(missingPackaged, {
    platform: "darwin",
    arch: "arm64",
    isPackaged: true,
  }), /darwin\/arm64/);
}

function testMacPathParsing() {
  const macPath = "/Users/example/Kr ai/素材/参考 图.png";
  const url = "file:///Users/example/Kr%20ai/%E7%B4%A0%E6%9D%90/%E5%8F%82%E8%80%83%20%E5%9B%BE.png";
  try {
    assert.equal(fileURLToPath(url, { windows: false }), macPath);
  } catch (error) {
    if (error instanceof TypeError) {
      assert.equal(fileURLToPath(url).replaceAll("\\", "/"), macPath);
      return;
    }
    throw error;
  }
  assert.equal(pathToFileURL(macPath, { windows: false }).toString(), url);
}

function testResourcePaths() {
  assert.equal(
    getBridgePythonRelativePath("darwin", "arm64"),
    path.join("bridge-runtime", "darwin-arm64", "python", "bin", "python3"),
  );
  assert.equal(
    getBridgeResourcePath({
      isPackaged: true,
      resourcesPath: "/Applications/Kr ai.app/Contents/Resources",
      appPath: "/ignored",
    }, "bridge", "rmbg_onnx_bridge.py"),
    path.join("/Applications/Kr ai.app/Contents/Resources", "bridge", "rmbg_onnx_bridge.py"),
  );
}

function testBridgeHelp() {
  if (skipBridgeExec) {
    console.log("Skipping bridge --help execution.");
    return;
  }
  const python = path.join(repoRoot, "resources", "bridge-runtime", "python", "python.exe");
  const bridge = path.join(repoRoot, "resources", "bridge", "rmbg_onnx_bridge.py");
  if (!fs.existsSync(python) || !fs.existsSync(bridge)) {
    throw new Error(`Windows bridge runtime or script missing. Tried ${python} and ${bridge}`);
  }
  const output = execFileSync(python, [bridge, "--help"], { encoding: "utf8" });
  assert.match(output, /--image/);
  assert.match(output, /--output/);
  assert.match(output, /--model/);
}

function testAsarResources() {
  const asarPath = path.join(repoRoot, "resources", "app.asar");
  const unpackedNode = path.join(
    repoRoot,
    "resources",
    "app.asar.unpacked",
    "node_modules",
    "better-sqlite3",
    "build",
    "Release",
    "better_sqlite3.node",
  );
  assert.equal(fs.existsSync(asarPath), true, `Missing ${asarPath}`);
  assert.equal(fs.existsSync(unpackedNode), true, `Missing ${unpackedNode}`);
}

testPythonRuntimeResolution();
testMacPathParsing();
testResourcePaths();
testBridgeHelp();
testAsarResources();

console.log("cross-platform smoke test passed");
