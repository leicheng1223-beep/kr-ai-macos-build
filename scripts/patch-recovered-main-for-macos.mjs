#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const mainPath = path.join(repoRoot, "dist-electron", "main.js");

if (!fs.existsSync(mainPath)) {
  console.error(`Cannot patch recovered Electron main process: missing ${mainPath}`);
  process.exit(1);
}

let source = fs.readFileSync(mainPath, "utf8");

function replaceOnce(before, after, label) {
  if (source.includes(after)) {
    console.log(`Already patched: ${label}`);
    return;
  }
  if (!source.includes(before)) {
    console.error(`Patch target not found: ${label}`);
    process.exit(1);
  }
  source = source.replace(before, after);
  console.log(`Patched: ${label}`);
}

replaceOnce(
  'import { pathToFileURL as p } from "node:url";',
  'import { fileURLToPath, pathToFileURL as p } from "node:url";',
  "node:url import",
);

replaceOnce(
  'function zo(e) {\n\tlet t = String(e || "").trim();\n\treturn t.startsWith("file:///") ? decodeURIComponent(t.replace("file:///", "")) : t;\n}',
  'function zo(e) {\n\tlet t = String(e || "").trim();\n\treturn t.startsWith("file:") ? fileURLToPath(t) : t;\n}',
  "file URL decoding helper",
);

replaceOnce(
  'function Is() {\n\treturn o.isPackaged ? n.join(process.resourcesPath, "bridge-runtime", "python", "python.exe") : n.join(o.getAppPath(), "bridge-runtime", "python", "python.exe");\n}',
  'function Is() {\n\tlet e = process.platform === "win32" ? n.join("bridge-runtime", "python", "python.exe") : process.platform === "darwin" && process.arch === "arm64" ? n.join("bridge-runtime", "darwin-arm64", "python", "bin", "python3") : process.platform === "darwin" && process.arch === "x64" ? n.join("bridge-runtime", "darwin-x64", "python", "bin", "python3") : n.join("bridge-runtime", `${process.platform}-${process.arch}`, "python", "bin", "python3");\n\treturn o.isPackaged ? n.join(process.resourcesPath, e) : n.join(o.getAppPath(), "resources", e);\n}',
  "platform Python runtime path",
);

replaceOnce(
  'function Rs() {\n\tlet e = [\n\t\tprocess.env.BEIBEI_BRIDGE_PYTHON,\n\t\tIs(),\n\t\to.isPackaged ? null : us\n\t];\n\tfor (let n of e) if (n && t.existsSync(n)) return n;\n\tthrow Error(`Bridge Python not found. Tried: ${e.filter(Boolean).join(", ")}`);\n}',
  'function Rs() {\n\tlet e = [\n\t\tIs(),\n\t\to.isPackaged ? null : process.env.BEIBEI_BRIDGE_PYTHON,\n\t\to.isPackaged ? null : process.platform === "win32" ? us : "python3"\n\t].filter(Boolean);\n\tfor (let n of e) if (n === "python3" || t.existsSync(n)) return n;\n\tthrow Error(`Bridge Python runtime not found for ${process.platform}/${process.arch}. Expected packaged runtime under resources/${process.platform === "darwin" && process.arch === "arm64" ? "bridge-runtime/darwin-arm64/python/bin/python3" : process.platform === "darwin" && process.arch === "x64" ? "bridge-runtime/darwin-x64/python/bin/python3" : "bridge-runtime/python/python.exe"}. Tried: ${e.join(", ")}`);\n}',
  "bridge Python resolver",
);

const replacements = [
  ['let r = n.startsWith("file:///") ? decodeURIComponent(n.replace("file:///", "")) : n;', 'let r = n.startsWith("file:") ? fileURLToPath(n) : n;'],
  ['let e = r.startsWith("file:///") ? decodeURIComponent(r.replace("file:///", "")) : r;', 'let e = r.startsWith("file:") ? fileURLToPath(r) : r;'],
  ['url: `file:///${e.replaceAll("\\\\", "/")}`', 'url: p(e).toString()'],
  ['url: `file:///${d.replaceAll("\\\\", "/")}`', 'url: p(d).toString()'],
  ['url: `file:///${s.replaceAll("\\\\", "/")}`', 'url: p(s).toString()'],
  ['url: `file:///${l.replaceAll("\\\\", "/")}`', 'url: p(l).toString()'],
  ['url: `file:///${o.replaceAll("\\\\", "/")}`', 'url: p(o).toString()'],
  ['url: `file:///${a.replaceAll("\\\\", "/")}`', 'url: p(a).toString()'],
];

for (const [before, after] of replacements) {
  source = source.split(before).join(after);
}

fs.writeFileSync(mainPath, source);
console.log(`Updated ${mainPath}`);
