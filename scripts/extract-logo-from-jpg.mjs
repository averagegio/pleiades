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
        left: Math.round(width * 0.21),
        top: Math.round(height * 0.05),
        width: Math.round(width * 0.4),
        height: Math.round(height * 0.54),
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
    if (luminance(i) >= 52) opaque[idx(x, y)] = 1;
  }
}

const keep = new Uint8Array(cropWidth * cropHeight);
const visited = new Uint8Array(cropWidth * cropHeight);
const cx = cropWidth / 2;
const cy = cropHeight * 0.43;
let best = [];

for (let y = 0; y < cropHeight; y++) {
  for (let x = 0; x < cropWidth; x++) {
    const start = idx(x, y);
    if (!opaque[start] || visited[start]) continue;

    const component = [];
    const queue = [[x, y]];
    visited[start] = 1;
    let touchesCenter = false;

    while (queue.length) {
      const [px, py] = queue.shift();
      component.push([px, py]);
      if (Math.hypot(px - cx, py - cy) < Math.min(cropWidth, cropHeight) * 0.22) {
        touchesCenter = true;
      }

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
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 0 || ny < 0 || nx >= cropWidth || ny >= cropHeight) continue;
        const n = idx(nx, ny);
        if (!opaque[n] || visited[n]) continue;
        visited[n] = 1;
        queue.push([nx, ny]);
      }
    }

    if (touchesCenter && component.length > best.length) best = component;
  }
}

for (const [x, y] of best) keep[idx(x, y)] = 1;

for (let y = 0; y < cropHeight; y++) {
  for (let x = 0; x < cropWidth; x++) {
    const n = idx(x, y);
    const i = n * 4;
    const lum = luminance(i);

    if (!keep[n]) {
      data[i + 3] = 0;
      continue;
    }

    data[i + 3] = Math.min(255, Math.round((lum - 34) * 3.1));
  }
}

const trimmed = await sharp(data, {
  raw: { width: cropWidth, height: cropHeight, channels: 4 },
})
  .trim({ threshold: 2 })
  .png()
  .toBuffer();

const trimmedMeta = await sharp(trimmed).metadata();
const pad = Math.round(
  Math.max(trimmedMeta.width ?? 0, trimmedMeta.height ?? 0) * 0.1,
);

const png = await sharp(trimmed)
  .extend({
    top: pad,
    bottom: pad,
    left: pad,
    right: pad,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .resize(1024, 1024, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await writeFile(output, png);
console.log(`Wrote ${output} (${mode})`);
