import sharp from "sharp";
import toIco from "to-ico";
import { readFile, writeFile, access } from "fs/promises";
import path from "path";
import { spawn } from "node:child_process";

const root = process.cwd();
const sourceJpg = path.join(root, "public/pleiadesstar.jpg");

try {
  await access(sourceJpg);
  await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(root, "scripts/extract-logo-from-jpg.mjs"),
        sourceJpg,
        path.join(root, "public/pleiades-logo-transparent.png"),
      ],
      { stdio: "inherit" },
    );
    child.on("exit", (code) =>
      code === 0 ? resolve(undefined) : reject(new Error(`extract exited ${code}`)),
    );
  });

  const transparent = await readFile(
    path.join(root, "public/pleiades-logo-transparent.png"),
  );
  await writeFile(path.join(root, "public/pleiades-logo.png"), await sharp(transparent).resize(1600).png().toBuffer());
  await writeFile(path.join(root, "public/pleiades-logo-sm.png"), await sharp(transparent).resize(800).png().toBuffer());
} catch {
  const logoSvg = await readFile(path.join(root, "public/pleiades-logo.svg"));
  await writeFile(path.join(root, "public/pleiades-logo.png"), await sharp(logoSvg).resize(1600).png().toBuffer());
  await writeFile(path.join(root, "public/pleiades-logo-sm.png"), await sharp(logoSvg).resize(800).png().toBuffer());
  await writeFile(path.join(root, "public/pleiades-logo-transparent.png"), await sharp(logoSvg).resize(2400).png().toBuffer());
}

const iconSvg = await readFile(path.join(root, "public/pleiades-icon.svg"));

async function pngFromSvg(svg, width) {
  return sharp(svg).resize(width).png().toBuffer();
}

const iconPngs = await Promise.all(
  [16, 32, 48].map((s) => pngFromSvg(iconSvg, s)),
);
const icon512 = await sharp(iconSvg).resize(512).png().toBuffer();
const apple180 = await pngFromSvg(iconSvg, 180);
await writeFile(path.join(root, "public/pleiades-icon.png"), icon512);
await writeFile(path.join(root, "src/app/icon.png"), icon512);
await writeFile(path.join(root, "src/app/apple-icon.png"), apple180);
await writeFile(path.join(root, "src/app/favicon.ico"), await toIco(iconPngs));

console.log("Transparent brand PNGs generated");
