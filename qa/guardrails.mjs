import { readFileSync } from "node:fs";
const files = process.argv.slice(2);
const platform = /\b(GoHighLevel|HighLevel|GHL)\b/;
let failed = false;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  if (text.includes("—")) { console.error(`FAIL em-dash ${f}`); failed = true; }
  if (platform.test(text)) { console.error(`FAIL platform-name ${f}`); failed = true; }
  const isStarter = /[\\/]starters[\\/]/.test(f);
  if (isStarter && /\{\{/.test(text)) { console.error(`FAIL unfilled-slot ${f}`); failed = true; }
}
if (failed) process.exit(1);
console.log("guardrails PASS");
