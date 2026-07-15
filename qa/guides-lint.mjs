import { readFileSync, readdirSync } from "node:fs";
const root = new URL("../", import.meta.url);
const rd = (p) => readFileSync(new URL(p, root), "utf8");
const catalog = rd("CATALOG.md"), build = rd("BUILD-GUIDE.md");
let failed = false;
const blocks = readdirSync(new URL("blocks/", root)).filter(f => f.endsWith(".html"));
// Design-first: CATALOG must document every block. Copy is the agent's job, so
// there is deliberately NO fixed fill manifest to check slots against.
for (const b of blocks) if (!catalog.includes(b)) { console.error(`FAIL CATALOG missing ${b}`); failed = true; }
for (const needle of ["#lp-booking-widget", ".time-chip", "grom-lp-events.gromdigital001.workers.dev/lp.js", "window.GROM_LP", "tenants.ts"])
  if (!build.includes(needle)) { console.error(`FAIL BUILD-GUIDE missing ${needle}`); failed = true; }
if (failed) process.exit(1);
console.log("guides-lint PASS");
