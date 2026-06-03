# macOS Icon

`electron-builder` uses `build/icons/icon.icns` for macOS packages. The GitHub Actions workflow generates this file before packaging.

Generate it on macOS from the existing PNG asset:

```bash
npm run prepare:macos-icon
```

The script uses Apple `sips` and `iconutil`, which are available on macOS.
