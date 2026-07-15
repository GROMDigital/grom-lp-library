# LP Library Build Guide

This is the operating manual for assembling a client landing page from `reference/lp-library/`. Read it end to end before touching any block. It assumes you have already read `CATALOG.md` (what each archetype is, its layout personality, its exact slot list, and its per-section copy formula). The library gives you the DESIGN; you write the copy.

## 0. Prerequisite: confirm tracking is wired up before you build

Every client landing page ships with the hosted tracking loader (`partials/head-tracking.html`). That loader only works if the client is already registered server-side. **Before you hand off a finished LP, confirm (or flag as outstanding) that:**

1. The client has an entry in the tracking worker's `src/tenants.ts` (a static map keyed by `clientKey`, each entry holding `clientKey`, `ghlLocationId`, and an `allowedOrigins` array containing the real LP origin the page will be served from).
2. That worker has been deployed after the `tenants.ts` change.

If either step is missing, the client's `window.GROM_LP` events are silently dropped. No error appears anywhere; the events simply never arrive. This is not something the LP build itself can fix; it is a prerequisite owned by whoever maintains `client-lp-tracking/worker`. State clearly in your handoff notes whether this has been confirmed done.

## 1. Compose the page: pick one hero, then deliberately vary everything downstream

Check `starters/` first (`starters/direct-response/`, `starters/clinical-trust/`, `starters/premium-editorial/`, `starters/clinical-botanical/`). These are finished demo pages, useful for tone and density reference, but they predate the archetype system and do not reference `blocks/`. For an actual client build, assemble from `blocks/*.html` archetypes directly.

**The composition flow:**

1. Pick exactly **one hero archetype** (`hero--centered`, `hero--fullbleed`, or `hero--split`) based on `CATALOG.md`'s when-to-use guidance for the client's offer shape and positioning.
2. For every section after the hero, **deliberately choose a different archetype than you chose on the last page you built for a different client**, where the section has more than one option. This is the entire point of having 22 archetypes instead of 11 fixed blocks: if you default to the same archetype set every time, every client page ends up structurally identical with different words on it, which defeats the reason this library has variants at all. Treat `CATALOG.md`'s layout-personality notes as your decision input, not a formality: a page built for a deposit-led, three-image-heavy clinic should look and flow differently from a page built for a rating-led, no-deposit clinic, in structure, not just in color.
3. A typical section order:

   `hero -> marquee-trust (optional) -> stats band (optional) -> offer -> practitioner (optional) -> process -> reviews -> cta (optional) -> booking -> faq -> footer`

   `booking--selector` should always sit directly before whichever FAQ archetype you chose, and the footer archetype always comes last. There is exactly one archetype each for booking, marquee-trust, and footer; every other section type has 2-3 archetypes to choose between.

4. Add the mobile sticky CTA bar. This is not a `blocks/*.html` file; hand-author a small fixed-position bar with `id="sticky"` directly in the page (a short label + one CTA link to `#book`), styled with theme tokens only, hidden above your chosen desktop breakpoint. It wires into the motion layer automatically via the `#sticky` hook (`motion/README.md`). See any starter's `.sticky-cta`/`#sticky` markup for a working reference. It must not be wrapped inside another section's markup.
5. Every hero archetype carries `id="hero"`; keep that id, since the motion layer's sticky mobile CTA uses it as a scroll trigger (see `motion/README.md`).

## 2. Apply exactly one theme

Pick one of `themes/clinical-trust.css`, `themes/direct-response.css`, `themes/premium-editorial.css`, or `themes/clinical-botanical.css` per `CATALOG.md`'s "intended use" guidance. Inline the theme into the document `<head>` as a single `<style>` block containing, in this order: `themes/_contract.css` first, then the chosen theme file second (the theme's `:root` block redeclares the same variables, so loading it second lets it override the contract's defaults). Do not mix variables from two themes and do not add a second theme's `<style>` block.

**`clinical-botanical` is the only theme that loads web fonts.** Its theme file opens with a Google Fonts `@import url(...)` line pulling in Fraunces (display serif) and Hanken Grotesk (body sans); the other three themes use system/web-safe fonts only and have no `@import`. A CSS `@import` is only honored when it precedes every other rule in the stylesheet it lives in, so when you inline `_contract.css` + `clinical-botanical.css` into one combined `<style>` block, the `@import` line must stay the very first line of that combined block, ahead of both the contract's `:root` rule and the theme's own `:root` rule. If the `@import` ends up after any other CSS in the block, browsers silently drop it and the page falls back to system fonts with no error.

Every theme now gives its own distinct values to all 8 decorative tokens (`--cta-grad-a`/`-b`, `--shadow-cta`, `--glow-1`/`-2`, `--ghost-color`, `--deposit-accent`, `--r-pill`), so most archetypes (CTA buttons across nearly the whole library, both stats bands, both hero glows on `hero--centered`/`hero--split`, `process--ghost`, `offer--deposit`, `cta--split`) automatically pick up a theme-appropriate gradient/glow/shadow treatment without you doing anything extra. You do not need to hand-pick archetypes to "unlock" a theme's decorative look the way earlier library versions required; every archetype works under every theme.

## 3. Inline the shared motion layer

Every archetype ships motion hooks (`.reveal`, `.reveal-stagger`, `[data-count-to]`, `.marquee`/`.marquee-track`, `[data-parallax]`, `[data-cta]`, `#sticky`, `#lp-booking-widget`/`.time-chip`) but writes no animation code itself. `motion/motion.js` + `motion/motion.css` are the one shared system that makes those hooks move. Read `motion/README.md` for the full hook contract before wiring this up; the short version:

1. Append `motion/motion.css`'s contents into the same `<style>` block as the theme, after the theme (contract, then theme, then motion CSS, all inlined together).
2. Inline `motion/motion.js`'s contents into a `<script>` tag right before `</body>`, after all block markup is on the page.

**Content must be visible without JavaScript.** `motion.js` adds a `js-motion` class to `<html>` as its first act; every hidden-initial rule in `motion.css` is scoped under that class. No JS (blocked, broken, not yet loaded) means nothing on the page is ever hidden; it just renders statically. Verify this by checking your assembled page with the `<script>` block removed: every section must still look complete and fully visible.

## 4. Fill every slot

Every archetype ships `{{slot_name}}` placeholders. The slot name tells you what belongs there; you write excellent, specific, client-true copy for it, guided by `CATALOG.md`'s per-archetype copy formula (the headline framing, the objection to answer, etc). Do NOT work from a fixed value manifest, and do not settle for generic filler: the design is only as good as the copy poured into it. Keep every claim AHPRA-safe (or the equivalent regulatory standard for the client's market): describe the offer, the process, and the care model; never promise a specific outcome or guaranteed result. The marketing/copywriter agent panel is available to pressure-test or polish high-stakes lines (hero headline, primary offer, deposit line), but the copy is yours to craft, not a form to fill.

**Zero `{{ }}` braces may remain anywhere in the output file.** This is enforced mechanically: `qa/guardrails.mjs` fails any file under `starters/` (and, by the same standard, any client LP output) that still contains `{{`. If a real value is not yet known, do not leave the brace placeholder in place; flag it clearly in your handoff notes as an outstanding item instead.

## 5. Set the head/tracking block

Use `partials/head-tracking.html` verbatim as the paste-ready head block. It contains, in a fixed order that must not change:

```html
<script>window.GROM_LP={clientKey:"{{CLIENT_KEY}}"};</script>
<script async src="https://grom-lp-events.gromdigital001.workers.dev/lp.js"></script>
```

followed by the Meta Pixel snippet. Fill `{{CLIENT_KEY}}` with the client's tenant key, exactly matching the `clientKey` you confirmed (in step 0) is registered in `tenants.ts`, and fill the pixel snippet's `{{META_PIXEL_ID}}` with the client's real Meta Pixel ID. If the pixel ID is not yet known at build time, do not ship the file with `{{META_PIXEL_ID}}` still in place; flag it in your handoff notes as an outstanding item to fill before the page goes live.

**The inline `window.GROM_LP` config script MUST precede the `async` `.../lp.js` loader script tag.** Do not reorder these two lines and do not rely on `document.currentScript` to infer config; the loader reads `window.GROM_LP` at load time, so if the config script runs after the loader, or the loader fires before the config is set, tracking silently breaks.

This whole block pastes into the page's Head / Tracking Code settings for that page. Nothing else about the head block changes per client.

## 6. Point the booking widget at the client's booking-worker

`blocks/booking--selector.html` ends with:

```html
<script src="{{booking_worker_url}}/embed.js" async></script>
```

Fill `{{booking_worker_url}}` with the client's real, deployed `grom-booking-worker` origin (no trailing slash; the archetype appends `/embed.js` itself). Use the intentionally unregistrable placeholder `https://your-booking-worker.invalid` (the IANA-reserved `.invalid` TLD, guaranteed never to resolve) while a page is still in progress, so an unfilled draft can never be mistaken for a live page. Never ship a client LP with `your-booking-worker.invalid` still in place.

## 7. Standardized selectors: never rename these

Two selectors are load-bearing contracts shared with the motion layer, the tracking loader, and the booking embed itself:

- `#lp-booking-widget`: the mount id the booking embed script renders into, the id the motion layer delegates `.time-chip` click handling from, and the id the tracking loader (`lp.js`) looks for to attach its scroll/interaction listeners.
- `.time-chip`: the class the booking embed applies to every rendered time-slot button, with `.sel` (selected) and `.muted` (unavailable) as state modifiers. Theme the widget's slot chips using theme tokens only, exactly as `blocks/booking--selector.html` already does.

Do not rename, wrap, or duplicate either one, regardless of which archetypes surround the booking section.

## 8. Output only the paste-ready page

Hand off exactly two things: the filled head block (from step 5) and the filled body markup (all assembled/filled archetypes between `<body>` and `</body>`, with the motion script inlined before `</body>` per step 3). **Never paste the guides (`CATALOG.md`, `BUILD-GUIDE.md`), anything under `qa/`, `showcase.html`, or the motion source files as file paths into a client landing page.** Motion gets inlined as raw CSS/JS content per step 3; it never ships as a linked path to `motion/motion.css` or `motion/motion.js`. The guides, the QA harness, and the showcase are internal-only working documents; none of them belong in a client-facing deliverable.

## 9. Verify before handoff

From `reference/lp-library/qa/`, run against your finished file(s):

```bash
node render-check.mjs <path-to-your-file>
node guardrails.mjs <path-to-your-file>
node token-lint.mjs <path-to-your-file>
```

`guardrails.mjs` fails on any em dash, any named CRM/automation platform, and (for anything under `starters/`) any remaining `{{` placeholder; the same bar applies to a finished client LP even though it will not live under `starters/`. `render-check.mjs` checks for layout overflow and console errors across four viewport widths (a single `/embed.js` 404 is expected and allow-listed when the real booking-worker URL is not yet reachable from your test environment; see `qa/booking-widget.spec.md`). `token-lint.mjs` confirms only contract tokens are used, never hardcoded colors or fonts. To sanity-check a single archetype against a theme, with or without motion, before it goes into a full page, use the harness directly: `qa/host.html?theme=themes/<theme>.css&block=blocks/<archetype>.html&motion=1` (see `motion/README.md`).

---

## Quick reference

| Item | Value |
|---|---|
| Tracking loader script src | `https://grom-lp-events.gromdigital001.workers.dev/lp.js` |
| Config global (must precede the loader) | `window.GROM_LP={clientKey:"..."}` |
| Booking widget mount selector | `#lp-booking-widget` |
| Booking time-slot selector | `.time-chip` |
| Client registration file (prerequisite) | `tenants.ts` (in `client-lp-tracking/worker/src/`) |
| Booking-worker placeholder while in progress | `https://your-booking-worker.invalid` |
| Motion CSS/JS | inline `motion/motion.css` into the `<style>` block, inline `motion/motion.js` before `</body>` |
| Hero id (motion sticky-CTA trigger) | `id="hero"` on every hero archetype |
