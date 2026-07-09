import sharp from "sharp";
import toIco from "to-ico";
import { readFile, writeFile, access } from "fs/promises";
import path from "path";
import { spawn } from "node:child_process";

const root = process.cwd();
const sourceJpg = path.join(root, "public/pleiadesstar.jpg");

async function runExtract(output, mode) {
  await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(root, "scripts/extract-logo-from-jpg.mjs"),
        sourceJpg,
        output,
        mode,
      ],
      { stdio: "inherit" },
    );
    child.on("exit", (code) =>
      code === 0 ? resolve(undefined) : reject(new Error(`extract exited ${code}`)),
    );
  });
}

async function pngFromSvg(svg, width) {
  return sharp(svg).resize(width).png().toBuffer();
}

const iconSvg = await readFile(path.join(root, "public/pleiades-icon.svg"));

try {
  await access(sourceJpg);
  await runExtract(
    path.join(root, "public/pleiades-icon-transparent.png"),
    "mark",
  );

  const iconTransparent = await readFile(
    path.join(root, "public/pleiades-icon-transparent.png"),
  );
  await writeFile(
    path.join(root, "public/pleiades-icon.png"),
    await sharp(iconTransparent).resize(640).png().toBuffer(),
  );
} catch {
  await writeFile(
    path.join(root, "public/pleiades-icon-transparent.png"),
    await sharp(iconSvg).resize(1200).png().toBuffer(),
  );
  await writeFile(
    path.join(root, "public/pleiades-icon.png"),
    await sharp(iconSvg).resize(640).png().toBuffer(),
  );
}

const iconTransparent = await readFile(
  path.join(root, "public/pleiades-icon-transparent.png"),
);

await writeFile(
  path.join(root, "public/pleiades-icon.png"),
  await sharp(iconTransparent).resize(640).png().toBuffer(),
);

const iconPngs = await Promise.all(
  [16, 32, 48].map((s) => pngFromSvg(iconSvg, s)),
);
const apple180 = await pngFromSvg(iconSvg, 180);

await writeFile(path.join(root, "src/app/icon.png"), await pngFromSvg(iconSvg, 512));
await writeFile(path.join(root, "src/app/apple-icon.png"), apple180);
await writeFile(path.join(root, "src/app/favicon.ico"), await toIco(iconPngs));

console.log("Constellation mark PNG assets generated");
