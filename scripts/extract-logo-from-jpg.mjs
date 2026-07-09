import sharp from "sharp";
import { writeFile } from "fs/promises";
import path from "path";

const root = process.cwd();
const input = process.argv[2] ?? path.join(root, "public/pleiadesstar.jpg");
const output =
  process.argv[3] ?? path.join(root, "public/pleiades-logo-transparent.png");

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const lum = new Float32Array(width * height);
const keep = new Uint8Array(width * height);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x;
    const i = idx * 4;
    lum[idx] =
      0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
}

function idx(x, y) {
  return y * width + x;
}

function inIconBand(x, y) {
  const cx = width / 2;
  return (
    Math.abs(x - cx) < width * 0.2 &&
    y > height * 0.18 &&
    y < height * 0.62
  );
}

function inTextBand(x, y) {
  const cx = width / 2;
  return (
    y > height * 0.64 &&
    y < height * 0.93 &&
    Math.abs(x - cx) < width * 0.4
  );
}

function inLogoBand(x, y) {
  return inIconBand(x, y) || inTextBand(x, y);
}

const seeds = [];
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const l = lum[idx(x, y)];
    if (!inLogoBand(x, y)) continue;
    if (l > 200 || (l > 85 && inIconBand(x, y))) seeds.push([x, y]);
  }
}

const queue = [...seeds];
for (const [x, y] of queue) keep[idx(x, y)] = 1;

const neighbors = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

while (queue.length) {
  const [x, y] = queue.shift();
  if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) continue;

  for (const [dx, dy] of neighbors) {
    const nx = x + dx;
    const ny = y + dy;
    const n = idx(nx, ny);
    if (keep[n]) continue;
    if (!inLogoBand(nx, ny)) continue;
    if (lum[n] < 36) continue;

    keep[n] = 1;
    queue.push([nx, ny]);
  }
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const n = idx(x, y);
    const i = n * 4;
    if (!keep[n]) {
      data[i + 3] = 0;
      continue;
    }

    const l = lum[n];
    data[i + 3] = l < 40 ? 0 : Math.min(255, Math.round((l - 34) * 3.1));
  }
}

const trimmed = await sharp(data, {
  raw: { width, height, channels: 4 },
})
  .trim({ threshold: 2 })
  .png()
  .toBuffer();

const meta = await sharp(trimmed).metadata();
const targetWidth = 1600;
const scale = targetWidth / (meta.width ?? targetWidth);

const png = await sharp(trimmed)
  .resize(Math.round((meta.width ?? targetWidth) * scale))
  .png()
  .toBuffer();

await writeFile(output, png);
console.log(`Wrote ${output}`);
