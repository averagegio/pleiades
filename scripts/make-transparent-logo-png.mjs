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
    await sharp(iconTransparent).resize(512).png().toBuffer(),
  );
} catch {
  const iconSvg = await readFile(path.join(root, "public/pleiades-icon.svg"));
  await writeFile(
    path.join(root, "public/pleiades-icon-transparent.png"),
    await sharp(iconSvg).resize(1024).png().toBuffer(),
  );
  await writeFile(
    path.join(root, "public/pleiades-icon.png"),
    await sharp(iconSvg).resize(512).png().toBuffer(),
  );
}

const iconTransparent = await readFile(
  path.join(root, "public/pleiades-icon-transparent.png"),
);

async function pngFromBuffer(buffer, width) {
  return sharp(buffer).resize(width).png().toBuffer();
}

const iconPngs = await Promise.all(
  [16, 32, 48].map((s) => pngFromBuffer(iconTransparent, s)),
);
const icon512 = await pngFromBuffer(iconTransparent, 512);
const apple180 = await pngFromBuffer(iconTransparent, 180);

await writeFile(path.join(root, "public/pleiades-icon.png"), icon512);
await writeFile(path.join(root, "src/app/icon.png"), icon512);
await writeFile(path.join(root, "src/app/apple-icon.png"), apple180);
await writeFile(path.join(root, "src/app/favicon.ico"), await toIco(iconPngs));

console.log("P mark PNG assets generated");
