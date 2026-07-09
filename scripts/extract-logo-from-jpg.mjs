import sharp from "sharp";
import { writeFile } from "fs/promises";
import path from "path";

const root = process.cwd();
const input = process.argv[2] ?? path.join(root, "public/pleiadesstar.jpg");
const output =
  process.argv[3] ?? path.join(root, "public/pleiades-icon-transparent.png");
const mode = process.argv[4] ?? "mark";

const source = sharp(input);
const meta = await source.metadata();
const width = meta.width ?? 652;
const height = meta.height ?? 423;

const crop =
  mode === "mark"
    ? {
        left: Math.round(width * 0.16),
        top: Math.round(height * 0.02),
        width: Math.round(width * 0.52),
        height: Math.round(height * 0.58),
      }
    : {
        left: Math.round(width * 0.18),
        top: Math.round(height * 0.08),
        width: Math.round(width * 0.64),
        height: Math.round(height * 0.86),
      };

const { data, info } = await source
  .extract(crop)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const cropWidth = info.width;
const cropHeight = info.height;
const opaque = new Uint8Array(cropWidth * cropHeight);

function idx(x, y) {
  return y * cropWidth + x;
}

function luminance(i) {
  return (
    0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
  );
}

for (let y = 0; y < cropHeight; y++) {
  for (let x = 0; x < cropWidth; x++) {
    const i = (y * cropWidth + x) * 4;
    if (luminance(i) >= 40) opaque[idx(x, y)] = 1;
  }
}

const pCenterX = cropWidth * 0.36;
const pCenterY = cropHeight * 0.44;

function inPRegion(x, y) {
  return Math.hypot(x - pCenterX, y - pCenterY) < cropWidth * 0.28;
}

function inNearConstellationRegion(x, y) {
  return (
    x > cropWidth * 0.44 &&
    x < cropWidth * 0.8 &&
    y < cropHeight * 0.4
  );
}

function inKeepRegion(x, y) {
  if (y > cropHeight * 0.96) return false;
  if (x > cropWidth * 0.82) return false;
  if (x > cropWidth * 0.66 && y > cropHeight * 0.34 && !inPRegion(x, y)) {
    return false;
  }
  return true;
}

const seeds = [];
for (let y = 0; y < cropHeight; y++) {
  for (let x = 0; x < cropWidth; x++) {
    if (!opaque[idx(x, y)] || !inKeepRegion(x, y)) continue;
    const i = (y * cropWidth + x) * 4;
    const lum = luminance(i);
    if (inPRegion(x, y) && lum >= 80) seeds.push([x, y]);
    if (inNearConstellationRegion(x, y) && lum >= 120) seeds.push([x, y]);
  }
}

const keep = new Uint8Array(cropWidth * cropHeight);
const queue = [...seeds];
for (const [x, y] of queue) keep[idx(x, y)] = 1;

while (queue.length) {
  const [x, y] = queue.shift();
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= cropWidth || ny >= cropHeight) continue;
    const n = idx(nx, ny);
    if (!opaque[n] || keep[n] || !inKeepRegion(nx, ny)) continue;
    keep[n] = 1;
    queue.push([nx, ny]);
  }
}

for (let y = 0; y < cropHeight; y++) {
  for (let x = 0; x < cropWidth; x++) {
    const n = idx(x, y);
    const i = n * 4;
    const lum = luminance(i);

    if (!keep[n]) {
      data[i + 3] = 0;
      continue;
    }

    const alpha =
      lum >= 180
        ? 255
        : lum >= 90
          ? Math.min(255, Math.round(80 + (lum - 90) * 2.2))
          : Math.min(220, Math.round((lum - 34) * 2.8));

    data[i + 3] = alpha;
  }
}

const trimmed = await sharp(data, {
  raw: { width: cropWidth, height: cropHeight, channels: 4 },
})
  .trim({ threshold: 1 })
  .png()
  .toBuffer();

const trimmedMeta = await sharp(trimmed).metadata();
const pad = Math.round(
  Math.max(trimmedMeta.width ?? 0, trimmedMeta.height ?? 0) * 0.08,
);

const png = await sharp(trimmed)
  .extend({
    top: pad,
    bottom: pad,
    left: pad,
    right: pad,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .resize(1100, 960, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await writeFile(output, png);
console.log(`Wrote ${output} (${mode})`);
