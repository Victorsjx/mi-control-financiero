import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "www");
const assets = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "sw.js",
  "icon-192.png",
  "icon-512.png"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of assets) {
  await cp(resolve(root, file), resolve(output, file));
}
console.log(`Mi Finanzas: ${assets.length} recursos preparados en www/.`);
