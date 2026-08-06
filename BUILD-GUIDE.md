# LP Library Build Guide

This is the operating manual for building a client landing page from `reference/lp-library/`. **Build template-first:** start from the finished template in `starters/` that is closest to the client, copy it, and customize it (theme, copy, and section mix). Only compose a page from scratch out of `blocks/` when no template is close enough. Read this end to end before you start. `CATALOG.md` is your reference for the individual block archetypes (layout personality, slot list, per-section copy formula) when you customize or swap a section.

## 0. Prerequisite: confirm tracking is wired up before you build

Every client landing page ships with the hosted tracking loader (`partials/head-tracking.html`). That loader only works if the client is already registered server-side. **Before you hand off a finished LP, confirm (or flag as outstanding) that:**

1. The client has an entry in the tracking worker's `src/tenants.ts` (a static map keyed by `clientKey`, each entry holding `clientKey`, `ghlLocationId`, and an `allowedOrigins` array containing the real LP origin the page will be served from).
2. That worker has been deployed after the `tenants.ts` change.

If either step is missing, the client's `window.GROM_LP` events are silently dropped. No error appears anywhere; the events simply never arrive. This is not something the LP build itself can fix; it is a prerequisite owned by whoever maintains `client-lp-tracking/worker`. State clearly in your handoff notes whether this has been confirmed done.

## 1. Start from the closest template, then customize

`starters/` holds five finished, calibrated landing pages, one per theme, all built on the calendar-at-top hero (`hero--booking`). These are the quality bar and your starting point:

| Template | Theme / character | Demo clinic |
|---|---|---|
| `starters/clinical-steel/` | cool ice + steel-blue, session-led | Verano Body Clinic, Harrogate |
| `starters/direct-response/` | warm amber, bold, price-led | Sunna Skin Studio, Manly |
| `starters/premium-editorial/` | ivory + charcoal, editorial, higher-ticket | Marchetti Aesthetics, South Yarra |
| `starters/clinical-trust/` | cool sage, credibility-led, complimentary consult (no deposit) | Northcott Skin & Laser, Chatswood |
| `starters/clinical-botanical/` | porcelain + deep-green, deposit-led | Sol&egrave;ne Skin Atelier, Marylebone |

**The build flow:**

1. **Pick the closest template** to the client's positioning and offer shape (price-led vs consult-led vs higher-ticket; deposit vs no-deposit; the palette that fits the brand). Copy its `index.html` to your new page. Each template is a single self-contained file (theme, motion, and all sections inlined) so it renders the moment you copy it, no assembly required.
2. **Re-theme only if the brand needs it.** The five templates already differ by theme, so the closest template is usually already the right palette. If the client's brand wants a different look, swap the inlined theme `:root` block for a different `themes/*.css` (keep `_contract.css` first, then the theme second). Only `clinical-botanical` loads web fonts (see §2).
3. **Rewrite every line of copy** for the real client (see §4). This is the bulk of the work: eyebrow, headline, subhead, offer/deposit line, process, reviews, FAQ, footer, nav wordmark and CTA, all of it client-true. The design is only as good as the copy poured into it; do not ship a template with demo copy still in it.
4. **Vary the section mix so two clients never get the same page.** The templates deliberately use different section archetypes from each other (one uses a numbered six-card benefits grid + boxed process; another uses a centered-price offer + timeline + featured reviews; another leans on media panels). To customize, swap a section for a different archetype from `blocks/` (see `CATALOG.md` for the options per section type), add one, or drop one, so the page fits the client rather than mirroring the template you started from.
5. **Keep the load-bearing pieces intact** while you customize: exactly one `#lp-booking-widget`, `id="hero"` on the hero, the `#sticky` mobile CTA, the `nav--bar` (wordmark + right-side CTA + its full-width accent separator), and the inlined motion layer. These already work in every template; do not rename or duplicate them (see §7).

**One `#lp-booking-widget` per page, always.** Every template is calendar-at-top: the booking card lives in the hero fold, which shows live availability immediately as the strongest CTA. If you need a booking prompt lower down the page, use a plain CTA that scrolls to `#hero`, never a second widget. If a client genuinely needs a calendar-at-bottom, consideration-led page instead (higher-ticket, trust-first, or unfamiliar offers that must sell before revealing availability), replace the `hero--booking` hero with a content hero (`hero--centered`/`--fullbleed`/`--split`) and move the booking mount into a `booking--selector` section placed directly before the FAQ, still exactly one widget on the page.

### Building fresh from blocks (only when no template fits)

If no template is close, compose from `blocks/*.html` directly: pick exactly one hero, then deliberately choose a different archetype for each downstream section per `CATALOG.md`'s layout-personality notes, apply one theme (§2), inline the motion layer (§3), and fill every slot (§4). A typical order is `hero -> reviews -> media (optional) -> benefits (optional) -> process (optional) -> offer -> practitioner (optional) -> marquee-trust (optional) -> stats band (optional) -> faq -> cta -> footer`, with `booking--selector` directly before the FAQ if you used a content hero. The 22 block archetypes exist so pages vary structurally, not just by color; if you default to the same set every time, every page ends up identical with different words on it. This from-scratch path is the exception now, not the default: prefer starting from a template.

## 2. Theme (only if you re-theme)

Every template already has exactly one theme inlined. If you swap it, pick one of `themes/clinical-steel.css`, `themes/direct-response.css`, `themes/premium-editorial.css`, `themes/clinical-trust.css`, or `themes/clinical-botanical.css` per `CATALOG.md`'s "intended use" guidance. Inline it into the document `<head>` as a single `<style>` block containing, in this order: `themes/_contract.css` first, then the chosen theme file second (the theme's `:root` block redeclares the same variables, so loading it second lets it override the contract's defaults). Do not mix variables from two themes and do not add a second theme's `<style>` block.

**`clinical-botanical` is the only theme that loads web fonts.** Its theme file opens with a Google Fonts `@import url(...)` line pulling in Onest (a soft-luxury sans used for both display and body); the other four themes load their web fonts via a `<link>` in the head instead. A CSS `@import` is only honored when it precedes every other rule in the stylesheet it lives in, so when you inline `_contract.css` + `clinical-botanical.css` into one combined `<style>` block, the `@import` line must stay the very first line of that combined block, ahead of both the contract's `:root` rule and the theme's own `:root` rule. If the `@import` ends up after any other CSS in the block, browsers silently drop it and the page falls back to system fonts with no error. (In the shipped starter the fonts are loaded via a head `<link>` as well, which is the more robust pattern; keep whichever the template you started from already uses.)

Every theme gives its own distinct values to all decorative tokens (`--cta-grad-a`/`-b`, `--shadow-cta`, `--glow-1`/`-2`, `--ghost-color`, `--deposit-accent`, `--accent-soft`/`-deep`, `--warm`/`-2`, etc.), so every archetype automatically picks up a theme-appropriate gradient/glow/shadow treatment. You do not need to hand-pick archetypes to "unlock" a theme's look; every archetype works under every theme.

## 3. The shared motion layer (already inlined in every template)

Every template ships with the motion layer already inlined; you only touch this when building fresh from blocks or adding a block that needs it. Every archetype ships motion hooks (`.reveal`, `.reveal-stagger`, `[data-count-to]`, `.marquee`/`.marquee-track`, `[data-parallax]`, `[data-cta]`, `#sticky`, `#lp-booking-widget`/`.time-chip`) but writes no animation code itself. `motion/motion.js` + `motion/motion.css` are the one shared system that makes those hooks move. Read `motion/README.md` for the full hook contract; the short version:

1. Append `motion/motion.css`'s contents into the same `<style>` block as the theme, after the theme (contract, then theme, then motion CSS, all inlined together).
2. Inline `motion/motion.js`'s contents into a `<script>` tag right before `</body>`, after all block markup is on the page.

**Content must be visible without JavaScript.** `motion.js` adds a `js-motion` class to `<html>` as its first act; every hidden-initial rule in `motion.css` is scoped under that class. No JS (blocked, broken, not yet loaded) means nothing on the page is ever hidden; it just renders statically. Verify this by checking your page with the `<script>` block removed: every section must still look complete and fully visible.

## 4. Fill every slot / rewrite every line

When you start from a template, replace all of its demo copy with client-true copy. When building fresh from blocks, every archetype ships `{{slot_name}}` placeholders; the slot name tells you what belongs there. Either way: write excellent, specific copy, guided by `CATALOG.md`'s per-archetype copy formula (the headline framing, the objection to answer, etc). Do NOT work from a fixed value manifest, and do not settle for generic filler. Keep every claim AHPRA-safe (or the equivalent regulatory standard for the client's market): describe the offer, the process, and the care model; never promise a specific outcome or guaranteed result. The marketing/copywriter agent panel is available to pressure-test or polish high-stakes lines (hero headline, primary offer, deposit line), but the copy is yours to craft, not a form to fill.

**Zero `{{ }}` braces may remain anywhere in the output file.** This is enforced mechanically: `qa/guardrails.mjs` fails any file under `starters/` (and, by the same standard, any client LP output) that still contains `{{`. If a real value is not yet known, do not leave the brace placeholder in place; flag it clearly in your handoff notes as an outstanding item instead.

## 5. Set the head/tracking block

Use `partials/head-tracking.html` verbatim as the paste-ready head block. It contains, in a fixed order that must not change:

```html
<script>window.GROM_LP={clientKey:"{{CLIENT_KEY}}"};</script>
<script async src="https://grom-lp-events.gromdigital001.workers.dev/lp.js"></script>
```

followed by the Meta Pixel snippet. Fill `{{CLIENT_KEY}}` with the client's tenant key, exactly matching the `clientKey` you confirmed (in step 0) is registered in `tenants.ts`, and fill the pixel snippet's `{{META_PIXEL_ID}}` with the client's real Meta Pixel ID. If the pixel ID is not yet known at build time, do not ship the file with `{{META_PIXEL_ID}}` still in place; flag it in your handoff notes as an outstanding item to fill before the page goes live.

**The inline `window.GROM_LP` config script MUST precede the `async` `.../lp.js` loader script tag.** Do not reorder these two lines and do not rely on `document.currentScript` to infer config; the loader reads `window.GROM_LP` at load time, so if the config script runs after the loader, or the loader fires before the config is set, tracking silently breaks.

This whole block pastes into the page's Head / Tracking Code settings for that page. Nothing else about the head block changes per client. (To wire tracking onto a finished LP end to end, use the `grom-client-factory:reconcile-lp-tracking` skill.)

## 6. Point the booking widget at the client's booking-worker

The template's hero (and `blocks/booking--selector.html`) ends with:

```html
<script src="{{booking_worker_url}}/embed.js" async></script>
```

Fill `{{booking_worker_url}}` with the client's real, deployed `grom-booking-worker` origin (no trailing slash; the page appends `/embed.js` itself). The templates ship with the intentionally unregistrable placeholder `https://your-booking-worker.invalid` (the IANA-reserved `.invalid` TLD, guaranteed never to resolve) so an unfilled draft can never be mistaken for a live page. Never ship a client LP with `your-booking-worker.invalid` still in place.

## 7. Standardized selectors: never rename these

Two selectors are load-bearing contracts shared with the motion layer, the tracking loader, and the booking embed itself:

- `#lp-booking-widget`: the mount id the booking embed script renders into, the id the motion layer delegates `.time-chip` click handling from, and the id the tracking loader (`lp.js`) looks for to attach its scroll/interaction listeners.
- `.time-chip`: the class the booking embed applies to every rendered time-slot button, with `.sel` (selected) and `.muted` (unavailable) as state modifiers. Theme the widget's slot chips using theme tokens only, exactly as the templates already do.

Do not rename, wrap, or duplicate either one, regardless of which archetypes surround the booking section.

## 8. Output only the paste-ready page

Hand off exactly two things: the filled head block (from step 5) and the filled body markup (everything between `<body>` and `</body>`, with the motion script inlined before `</body>`). **Never paste the guides (`CATALOG.md`, `BUILD-GUIDE.md`), anything under `qa/`, `showcase.html`, or the motion source files as file paths into a client landing page.** Motion gets inlined as raw CSS/JS content; it never ships as a linked path to `motion/motion.css` or `motion/motion.js`. The guides, the QA harness, and the showcase are internal-only working documents; none of them belong in a client-facing deliverable.

## 9. Verify before handoff

From `reference/lp-library/qa/`, run against your finished file(s):

```bash
node render-check.mjs <path-to-your-file>
node guardrails.mjs <path-to-your-file>
node token-lint.mjs "$PWD/<path-to-your-file>"
```

`guardrails.mjs` fails on any em dash, any named CRM/automation platform, and (for anything under `starters/`) any remaining `{{` placeholder; the same bar applies to a finished client LP even though it will not live under `starters/`. `render-check.mjs` checks for layout overflow and console errors across four viewport widths (a single `/embed.js` 404 is expected and allow-listed when the real booking-worker URL is not yet reachable from your test environment; see `qa/booking-widget.spec.md`). `token-lint.mjs` confirms only contract tokens are used, never hardcoded colors or fonts. **Pass token-lint an absolute path** (e.g. `"$PWD/themes/x.css"`): a bare `themes/x.css` with no leading slash is silently skipped by its path guard and prints PASS without checking anything. To sanity-check a single archetype against a theme before it goes into a full page, use the harness directly: `qa/host.html?theme=themes/<theme>.css&block=blocks/<archetype>.html&motion=1` (see `motion/README.md`).

---

## Quick reference

| Item | Value |
|---|---|
| Default build path | **Start from the closest `starters/` template, then customize** |
| From-scratch path | compose from `blocks/` only when no template fits |
| Tracking loader script src | `https://grom-lp-events.gromdigital001.workers.dev/lp.js` |
| Config global (must precede the loader) | `window.GROM_LP={clientKey:"..."}` |
| Booking widget mount selector | `#lp-booking-widget` |
| Booking time-slot selector | `.time-chip` |
| Client registration file (prerequisite) | `tenants.ts` (in `client-lp-tracking/worker/src/`) |
| Booking-worker placeholder while in progress | `https://your-booking-worker.invalid` |
| Motion CSS/JS | already inlined in every template; when building fresh, inline `motion/motion.css` into the `<style>` block and `motion/motion.js` before `</body>` |
| Hero id (motion sticky-CTA trigger) | `id="hero"` on every hero archetype |
