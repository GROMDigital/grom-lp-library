import { readFileSync } from "node:fs";
const files = process.argv.slice(2);
const contract = readFileSync(new URL("../themes/_contract.css", import.meta.url), "utf8");
const vars = [...contract.matchAll(/--[a-z0-9-]+/g)].map(m => m[0]);
const uniqueVars = [...new Set(vars)];
let failed = false;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  if (/[\\/]themes[\\/]/.test(f) && !/_contract/.test(f)) {
    for (const v of uniqueVars)
      if (!new RegExp(v.replace(/[-]/g, "\\-") + "\\s*:").test(text)) {
        console.error(`FAIL theme ${f} missing ${v}`); failed = true;
      }
  }
  if (/[\\/]blocks[\\/]/.test(f)) {
    const styleOnly = (text.match(/<style[^>]*>[\s\S]*?<\/style>|style="[^"]*"/gi) || []).join("\n");
    if (/#[0-9a-fA-F]{3,8}\b/.test(styleOnly)) { console.error(`FAIL block ${f} hardcoded color`); failed = true; }
    if (/font-family\s*:\s*(?!var\()/i.test(styleOnly)) { console.error(`FAIL block ${f} hardcoded font`); failed = true; }
  }
}
if (failed) process.exit(1);
console.log("token-lint PASS");
