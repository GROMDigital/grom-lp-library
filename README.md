# Grom LP Component Library

Grom Digital's reusable landing-page component library for aesthetic / skin clinics. It is a **design system**, not finished pages: a set of premium, motion-rich section archetypes you compose into a client's landing page, then write the copy for.

## Start here

Read **`BUILD-GUIDE.md`** first. It is the operating manual: how to compose a page, apply a theme, wire the motion layer, and write the copy. Then use **`CATALOG.md`** as the menu of every archetype (what each is, when to use it, its slots, and a copy formula).

The fastest way to use it: open this repo in an AI coding tool (or with Claude), and say *"build a landing page for [client] using this library, following BUILD-GUIDE.md."* It reads the guide and composes the page.

## What's inside

- **`blocks/`** — 22 section archetypes named `<section>--<archetype>.html` (multiple distinct LAYOUTS per section: 3 heroes, 3 offers, 2 process, 2 stat bands, marquee, 3 reviews, 2 practitioner, booking, 2 FAQ, 2 CTA, footer). Each is a self-contained `<section>` styled only with theme tokens, with `{{slot}}` placeholders and motion hooks. Pick and **vary** them per client so pages come out genuinely different, not recolored.
- **`themes/`** — 4 themes (`clinical-botanical`, `direct-response`, `clinical-trust`, `premium-editorial`) plus `_contract.css`, the token contract every archetype reads. One theme re-skins whatever archetypes you chose.
- **`motion/`** — the one shared motion layer (`motion.js` + `motion.css` + `README.md` hook contract): scroll reveals, count-ups, marquees, parallax, sticky CTA, booking selector. Progressive enhancement (fully visible with no JS). Inline it into the assembled page.
- **`starters/`** — 4 finished demo pages (one per theme) + 2 demos built from non-default archetype mixes, to look at for tone and to prove the variety. Browse them rendered.
- **`partials/`** — the tracking head-block loader.
- **`qa/`** — a Playwright render + guardrail/lint harness (`cd qa && npm install` to run).

## Copy is yours to write

There is deliberately no fixed fill manifest. `CATALOG.md` gives a copy *formula* per section (the framing), and you write strong, specific, client-true copy against it. Keep every claim regulator-safe (AHPRA or the client's market equivalent): describe the offer, process, and care model, never promise a guaranteed outcome.

## Tracking

Tracking (drop-off analytics + Meta Pixel) is a *separate* concern from the design. Once a page is built, wiring tracking onto it is handled by the `grom-client-factory:reconcile-lp-tracking` skill (or your Grom tracking runbook). This repo is the design system only.
