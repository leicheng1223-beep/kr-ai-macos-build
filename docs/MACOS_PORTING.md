# macOS Porting Notes

## Current Stack

- Desktop runtime: Electron.
- Renderer: React static assets under `dist`.
- Main process: ESM JavaScript under `dist-electron`.
- Native Node module: `better-sqlite3`.
- Local bridge: Python scripts under `resources/bridge`.
- Model asset: `resources/models/model_fp16.onnx`.
- Current workspace shape: this directory is a Windows `win-unpacked` release package, not the original source checkout.

## Important Quality Note

This workspace is not the original source repository. There is no `.git`, no React source tree, and no Electron main-process source file such as `electron/main.ts`.

The macOS build workflow therefore uses a recovery strategy:

1. Extract `resources/app.asar`.
2. Copy only `dist/` and `dist-electron/` into the build workspace.
3. Patch the recovered Electron main process so packaged macOS apps resolve the correct Python runtime path.
4. Build with macOS Electron runtime on a GitHub Actions macOS runner.

This can produce a testable macOS package, but quality is not equivalent to rebuilding from the true source repository.

## Completed Cross-Platform Changes

- Python bridge resolution is platform and architecture aware.
- Packaged apps prefer Python runtimes under Electron `process.resourcesPath`.
- Development mode can fall back to `BEIBEI_BRIDGE_PYTHON` or system `python3`.
- macOS packaged apps use `userData` for writable temp/session/material data instead of writing beside `process.execPath`.
- Local file URL creation uses `pathToFileURL`.
- Local file URL parsing uses `fileURLToPath`.
- Windows-only fallback paths are guarded by `process.platform === "win32"`.
- `%LOCALAPPDATA%` cleanup only runs on Windows.
- `better-sqlite3` is configured for `asarUnpack`.
- macOS electron-builder config, entitlements, icon generation, runtime preparation, smoke test, and GitHub Actions workflow were added.
- `scripts/recover-from-asar.mjs` restores `dist/` and `dist-electron/` from the packaged asar.
- `scripts/patch-recovered-main-for-macos.mjs` applies the minimum macOS runtime/path patch to the recovered main process during CI.

## Runtime Layout

Packaged runtime paths are:

```text
Windows:
resources/bridge-runtime/python/python.exe

macOS Apple Silicon:
resources/bridge-runtime/darwin-arm64/python/bin/python3

macOS Intel:
resources/bridge-runtime/darwin-x64/python/bin/python3
```

The app resolves these with `process.platform` and `process.arch`.

## macOS Development Setup

Install Node dependencies:

```bash
npm install
```

Generate the macOS icon:

```bash
npm run prepare:macos-icon
```

The macOS builder config points at `build/icons/icon.icns`. The GitHub Actions workflow generates this file before packaging.

Prepare Python runtimes:

```bash
npm run prepare:macos-python:arm64
npm run prepare:macos-python:x64
```

The runtime preparation script installs:

- `numpy`
- `Pillow`
- `onnxruntime`
- `torch`
- `torchvision`
- `scipy`
- `opencv-python`

`opencv-python` is used for optional Poisson blending support in the bridge. If it is missing, the bridge can still return the unblended image in that code path.

## Manual Python Runtime Preparation

If the script cannot be used, create venv-style runtimes manually:

```bash
python3 -m venv resources/bridge-runtime/darwin-arm64/python
resources/bridge-runtime/darwin-arm64/python/bin/python3 -m pip install --upgrade pip setuptools wheel
resources/bridge-runtime/darwin-arm64/python/bin/python3 -m pip install numpy Pillow onnxruntime torch torchvision scipy opencv-python

python3 -m venv resources/bridge-runtime/darwin-x64/python
resources/bridge-runtime/darwin-x64/python/bin/python3 -m pip install --upgrade pip setuptools wheel
resources/bridge-runtime/darwin-x64/python/bin/python3 -m pip install numpy Pillow onnxruntime torch torchvision scipy opencv-python
```

On Apple Silicon, prepare the Intel runtime with an x64 Python interpreter or Rosetta:

```bash
arch -x86_64 python3 -m venv resources/bridge-runtime/darwin-x64/python
```

## Native Module Rebuild

`better-sqlite3` must be rebuilt for Electron and for the target architecture:

```bash
npm run install-app-deps:mac:arm64
npm run rebuild:better-sqlite3:mac:arm64

npm run install-app-deps:mac:x64
npm run rebuild:better-sqlite3:mac:x64
```

The macOS builder config unpacks the native module:

```yaml
asarUnpack:
  - node_modules/better-sqlite3/build/Release/*.node
```

Do not reuse the Windows `better_sqlite3.node` for macOS.

## Unsigned Local macOS Build

For local builds without an Apple Developer ID:

```bash
CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist:mac:arm64
CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist:mac:x64
```

Or build both:

```bash
CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist:mac
```

Outputs are written to `release/` and include `.app`, `.dmg`, and `.zip` targets through `packaging/electron-builder.macos.yml`.

## Signed And Notarized Release

Do not hard-code signing credentials. Provide them through CI or shell environment variables:

```bash
export APPLE_ID="developer@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="TEAMID1234"
export CSC_LINK="/secure/path/DeveloperIDApplication.p12"
export CSC_KEY_PASSWORD="certificate-password"
```

Then run:

```bash
npm run dist:mac
```

The config enables hardened runtime and uses:

- `packaging/entitlements.mac.plist`
- `packaging/entitlements.mac.inherit.plist`

Notarization still needs to be wired to the release process used by the source repository, for example with electron-builder-compatible notarization hooks or CI post-processing.

## GitHub Actions

The macOS workflow is `.github/workflows/build-macos.yml`.

It runs on `macos-latest`, uses a matrix for:

- `arm64`
- `x64`

It performs:

- `npm install`
- `npm run recover:asar`
- `npm run patch:recovered-main:macos`
- icon generation
- macOS Python runtime preparation
- `electron-builder install-app-deps`
- `electron-rebuild` for `better-sqlite3`
- `npm run smoke:cross-platform`
- unsigned macOS build
- artifact upload

The artifacts are named:

- `kr-ai-macos-arm64-unsigned`
- `kr-ai-macos-x64-unsigned`

Open the workflow run, scroll to **Artifacts**, download the artifact matching your Mac, unzip it, then copy `Kr ai.app` to `/Applications` or run it from the extracted folder.

If macOS shows "Apple cannot check it for malicious software" or "unidentified developer", this is expected for the unsigned test build. For personal testing:

```bash
xattr -dr com.apple.quarantine "/Applications/Kr ai.app"
open "/Applications/Kr ai.app"
```

You can also right-click the app in Finder, choose **Open**, then confirm.

For formal release builds, provide signing/notarization credentials through environment variables:

```bash
APPLE_ID
APPLE_APP_SPECIFIC_PASSWORD
APPLE_TEAM_ID
CSC_LINK
CSC_KEY_PASSWORD
```

Do not hard-code these values in the repository.

If the workflow fails, send the log sections for:

- **Prepare macOS Python runtime**
- **Rebuild better-sqlite3 for Electron**
- **Build unsigned macOS app**

## Smoke Tests

Run:

```bash
npm run smoke:cross-platform
```

This validates:

- Windows Python runtime path resolution
- macOS Apple Silicon Python runtime path resolution
- macOS Intel Python runtime path resolution
- development-mode system `python3` fallback
- packaged missing-runtime error messages
- macOS file URL parsing
- packaged resource path logic
- bridge `--help` execution on the current Windows runtime
- `app.asar` and `better-sqlite3` unpacked native module presence

On macOS CI, use:

```bash
SMOKE_SKIP_BRIDGE_EXEC=1 npm run smoke:cross-platform
```

because the workflow validates the macOS runtime separately before packaging.

## Windows Regression Verification

From the Windows package directory:

```powershell
npm run smoke:cross-platform
resources\bridge-runtime\python\python.exe resources\bridge\rmbg_onnx_bridge.py --help
Start-Process ".\Kr ai.exe"
```

Then check `%APPDATA%\kr-ai\debug.log` for:

- `app:ready`
- `renderer:did-finish-load`
- `ipc:bootstrap:done`

## Remaining Manual Work

- Restore or work from the original source repository for a normal build pipeline.
- Replace this reverse-recovered build with a source build when the real repository is available.
- Configure Apple Developer signing and notarization.
- Verify on real Apple Silicon and Intel macOS machines or CI runners.
