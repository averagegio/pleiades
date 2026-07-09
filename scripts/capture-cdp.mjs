import { copyFile, mkdir } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer-core";

const SITE = process.env.SITE_URL || "https://pleiades-livid-pi.vercel.app";
const OUT = "/opt/cursor/artifacts/pitch-screenshots";
const PUBLIC = path.join(process.cwd(), "public/pitch");

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

const shots = [
  {
    name: "01-intro",
    url: `${SITE}/`,
    action: async (page) => {
      await page.waitForSelector("body", { timeout: 15000 });
      await sleep(5000);
    },
  },
  {
    name: "02-watch",
    url: `${SITE}/`,
    action: async (page) => {
      await page.setViewport({ width: 1440, height: 1000 });
      await sleep(2000);
      await page.evaluate(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "instant",
        });
      });
      await sleep(1500);
      const watch = await page.$("#watch");
      if (watch) await watch.scrollIntoView();
      await sleep(1000);
    },
  },
  {
    name: "03-journal",
    url: `${SITE}/journal`,
    action: async (page) => {
      await page.setViewport({ width: 1440, height: 1000 });
      await page.waitForSelector("h1", { timeout: 15000 });
      await sleep(1500);
    },
  },
  {
    name: "04-login",
    url: `${SITE}/login`,
    action: async (page) => {
      await page.setViewport({ width: 1440, height: 1000 });
      await page.waitForSelector("form", { timeout: 15000 });
      await sleep(800);
    },
  },
  {
    name: "05-pin",
    url: `${SITE}/pin`,
    action: async (page) => {
      await page.setViewport({ width: 1440, height: 1200 });
      await page.waitForSelector("#preorder", { timeout: 15000 });
      await sleep(1000);
    },
  },
  {
    name: "06-checkout",
    url: `${SITE}/pin`,
    action: async (page) => {
      await page.setViewport({ width: 1440, height: 900 });
      await page.waitForSelector("#preorder", { timeout: 15000 });
      await page.$eval("#preorder", (el) =>
        el.scrollIntoView({ block: "center" }),
      );
      await sleep(800);
    },
  },
  {
    name: "07-account",
    url: `${SITE}/account`,
    action: async (page) => {
      await page.setViewport({ width: 1440, height: 1000 });
      await page.waitForSelector("h1", { timeout: 15000 });
      await sleep(2000);
    },
  },
  {
    name: "08-about",
    url: `${SITE}/about`,
    action: async (page) => {
      await page.waitForSelector("h1", { timeout: 15000 });
      await sleep(600);
    },
  },
  {
    name: "09-drawer",
    url: `${SITE}/login`,
    action: async (page) => {
      await page.waitForSelector("button", { timeout: 15000 });
      const btn =
        (await page.$('button[aria-label*="menu" i]')) ||
        (await page.$("button"));
      if (btn) await btn.click();
      await sleep(800);
    },
  },
];

await mkdir(OUT, { recursive: true });
await mkdir(PUBLIC, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
  ],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

for (const shot of shots) {
  const page = await browser.newPage();
  console.log("Capturing", shot.name);
  try {
    await page.goto(shot.url, { waitUntil: "networkidle2", timeout: 45000 });
    await shot.action(page);
    const dest = path.join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: dest, fullPage: false });
    await copyFile(dest, path.join(PUBLIC, `${shot.name}.png`));
    console.log("  ok", shot.name);
  } catch (e) {
    console.error("  fail", shot.name, e.message);
  } finally {
    await page.close().catch(() => {});
  }
}

await browser.close();
console.log("done");
