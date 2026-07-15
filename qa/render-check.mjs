import { chromium } from "playwright";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const WIDTHS = [390, 768, 1024, 1440];
const IGNORE = /\/embed\.js|ERR_FAILED|Failed to load resource|fonts\.googleapis|fonts\.gstatic/; // placeholder booking embed 404 + Google Fonts network calls are expected in headless
const LIB = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (!args.length) { console.error("usage: render-check.mjs <file.html | host.html?theme=X.css&block=blocks/Y.html> ..."); process.exit(2); }

// Compose a themed page in Node (no in-browser file:// fetch), else load the file directly.
function targetUrl(arg) {
  const [, qs] = arg.split("?");
  const q = qs ? Object.fromEntries(new URLSearchParams(qs)) : {};
  if (q.theme || q.block) {
    const contract = readFileSync(join(LIB, "themes/_contract.css"), "utf8");
    const theme = q.theme ? readFileSync(join(LIB, "themes", q.theme), "utf8") : "";
    const block = q.block ? readFileSync(join(LIB, q.block), "utf8") : "";
    const motionCss = q.motion ? readFileSync(join(LIB, "motion/motion.css"), "utf8") : "";
    const motionScript = q.motion ? `<script>${readFileSync(join(LIB, "motion/motion.js"), "utf8")}</script>` : "";
    const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${contract}${theme}${motionCss}</style><body data-ready="1" style="margin:0;font-family:var(--font-body);color:var(--ink);background:var(--bg)">${block}${motionScript}</body>`;
    const f = join(mkdtempSync(join(tmpdir(), "lpqa-")), "c.html");
    writeFileSync(f, html);
    return pathToFileURL(f).href;
  }
  return pathToFileURL(resolve(arg)).href;
}

const browser = await chromium.launch();
let failed = false;
for (const arg of args) {
  const url = targetUrl(arg);
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => { if (!IGNORE.test(String(e))) errors.push(String(e)); });
    page.on("console", (m) => { if (m.type() === "error" && !IGNORE.test(m.text())) errors.push(m.text()); });
    await page.goto(url, { waitUntil: "networkidle" }).catch(() => {});
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) { console.error(`FAIL overflow ${overflow}px @${w} ${arg}`); failed = true; }
    if (errors.length) { console.error(`FAIL console @${w} ${arg}: ${errors.join(" | ")}`); failed = true; }
    await page.close();
  }
}
await browser.close();
if (failed) process.exit(1);
console.log("render-check PASS");
