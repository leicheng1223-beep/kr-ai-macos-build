import path from "node:path";

export function getBridgeRuntimeKey(platform = process.platform, arch = process.arch) {
  if (platform === "win32") return "win32";
  if (platform === "darwin" && arch === "arm64") return "darwin-arm64";
  if (platform === "darwin" && arch === "x64") return "darwin-x64";
  return `${platform}-${arch}`;
}

export function getBridgePythonRelativePath(platform = process.platform, arch = process.arch) {
  const key = getBridgeRuntimeKey(platform, arch);
  if (key === "win32") {
    return path.join("bridge-runtime", "python", "python.exe");
  }
  if (key === "darwin-arm64" || key === "darwin-x64") {
    return path.join("bridge-runtime", key, "python", "bin", "python3");
  }
  return path.join("bridge-runtime", key, "python", "bin", "python3");
}

export function getPackagedBridgePythonCandidates({
  resourcesPath,
  platform = process.platform,
  arch = process.arch,
}) {
  if (!resourcesPath) return [];
  return [path.join(resourcesPath, getBridgePythonRelativePath(platform, arch))];
}

export function getDevBridgePythonCandidates({
  appPath,
  platform = process.platform,
  arch = process.arch,
}) {
  if (!appPath) return [];
  const relative = getBridgePythonRelativePath(platform, arch);
  return [
    path.join(appPath, "resources", relative),
    path.join(appPath, relative),
  ];
}

export function resolveBridgePythonPath({
  isPackaged = false,
  resourcesPath = "",
  appPath = "",
  platform = process.platform,
  arch = process.arch,
  env = process.env,
  existsSync,
  allowSystemFallback = !isPackaged,
} = {}) {
  const candidates = [];
  const packagedCandidates = getPackagedBridgePythonCandidates({ resourcesPath, platform, arch });
  const devCandidates = getDevBridgePythonCandidates({ appPath, platform, arch });
  const envPython = env?.BEIBEI_BRIDGE_PYTHON ? String(env.BEIBEI_BRIDGE_PYTHON).trim() : "";

  if (isPackaged) {
    candidates.push(...packagedCandidates);
    if (envPython) candidates.push(envPython);
  } else {
    if (envPython) candidates.push(envPython);
    candidates.push(...devCandidates);
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (!existsSync || existsSync(candidate)) {
      return {
        path: candidate,
        source: candidate === envPython ? "env" : "runtime",
        candidates,
      };
    }
  }

  if (allowSystemFallback) {
    const systemCandidate = platform === "win32" ? "python" : "python3";
    return {
      path: systemCandidate,
      source: "system",
      candidates: [...candidates, systemCandidate],
    };
  }

  return {
    path: null,
    source: "missing",
    candidates,
  };
}

export function formatBridgePythonError(result, {
  platform = process.platform,
  arch = process.arch,
  isPackaged = false,
} = {}) {
  const expected = getBridgePythonRelativePath(platform, arch);
  const tried = result?.candidates?.length ? result.candidates.join(", ") : "(none)";
  return [
    `Bridge Python runtime not found for ${platform}/${arch}.`,
    `Expected packaged runtime: resources/${expected}.`,
    `Mode: ${isPackaged ? "packaged" : "development"}.`,
    `Tried: ${tried}.`,
    "Prepare the runtime with scripts/prepare-macos-python-runtime.mjs or set BEIBEI_BRIDGE_PYTHON in development.",
  ].join(" ");
}

export function getBridgeResourcePath({
  isPackaged = false,
  resourcesPath = "",
  appPath = "",
}, ...segments) {
  if (isPackaged) return path.join(resourcesPath, ...segments);
  return path.join(appPath, "resources", ...segments);
}
