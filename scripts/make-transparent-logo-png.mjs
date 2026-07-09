import sharp from "sharp";
import toIco from "to-ico";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const root = process.cwd();
const iconSvg = await readFile(path.join(root, "public/pleiades-icon.svg"));
const logoSvg = await readFile(path.join(root, "public/pleiades-logo.svg"));

async function pngFromSvg(svg, width) {
  return sharp(svg).resize(width).png().toBuffer();
}

const iconPngs = await Promise.all(
  [16, 32, 48].map((s) => pngFromSvg(iconSvg, s)),
);
const icon512 = await pngFromSvg(iconSvg, 512);
const logo1600 = await pngFromSvg(logoSvg, 1600);
const logo800 = await pngFromSvg(logoSvg, 800);
const logo2400 = await pngFromSvg(logoSvg, 2400);
const apple180 = await pngFromSvg(iconSvg, 180);

await writeFile(path.join(root, "public/pleiades-logo.png"), logo1600);
await writeFile(path.join(root, "public/pleiades-logo-sm.png"), logo800);
await writeFile(
  path.join(root, "public/pleiades-logo-transparent.png"),
  logo2400,
);
await writeFile(path.join(root, "public/pleiades-icon.png"), icon512);
await writeFile(path.join(root, "src/app/icon.png"), icon512);
await writeFile(path.join(root, "src/app/apple-icon.png"), apple180);
await writeFile(path.join(root, "src/app/favicon.ico"), await toIco(iconPngs));

console.log("Transparent brand PNGs generated");
