# Grom LP Library

Grom Digital's reusable landing-page library for aesthetic / skin clinics. **Build template-first:** start from the finished template closest to the client, then customize the theme, rewrite the copy, and vary the section mix. The `blocks/` archetypes are there for customizing (swapping or adding a section) or for building a page from scratch when no template fits.

## Start here

Read **`BUILD-GUIDE.md`** first. It is the operating manual: pick the closest of the five `starters/` templates, copy it, re-theme if the brand needs it, rewrite the copy, and vary the sections. Use **`CATALOG.md`** as the menu of every section archetype (what each is, when to use it, its slots, and a copy formula) when you customize.

The fastest way to use it: open this repo in an AI coding tool (or with Claude) and say *"build a landing page for [client] using this library, following BUILD-GUIDE.md."* It reads the guide, picks the closest template, and customizes it.

## What's inside

- **`starters/`** — **five finished templates, one per theme, all calendar-at-top** (the live booking card sits in the hero fold). These are the quality bar and your starting point:
  - `clinical-steel` — cool ice + steel-blue, session-led
  - `direct-response` — warm amber, bold, price-led
  - `premium-editorial` — ivory + charcoal, editorial, higher-ticket
  - `clinical-trust` — cool sage, credibility-led, complimentary consult (no deposit)
  - `clinical-botanical` — porcelain + deep-green, deposit-led
  Each is a single self-contained file (theme, motion, and every section inlined) so it renders the moment you copy it.
- **`blocks/`** — 28 section archetypes named `<section>--<archetype>.html` (multiple distinct LAYOUTS per section: heroes, offers, process, stat bands, marquee, reviews, practitioner, booking, FAQ, CTA, footer). Each is a self-contained `<section>` styled only with theme tokens, with `{{slot}}` placeholders and motion hooks. Use them to swap a section for a different layout, or to build a fresh page when no template fits.
- **`themes/`** — five themes (`clinical-steel`, `direct-response`, `premium-editorial`, `clinical-trust`, `clinical-botanical`) plus `_contract.css`, the token contract every archetype reads. One theme re-skins the whole page.
- **`motion/`** — the one shared motion layer (`motion.js` + `motion.css` + `README.md` hook contract): scroll reveals, count-ups, marquees, parallax, sticky CTA, booking selector. Progressive enhancement (fully visible with no JS). Already inlined in every template.
- **`partials/`** — the tracking head-block loader.
- **`qa/`** — a Playwright render + guardrail/lint harness (`cd qa && npm install` to run).

## Copy is yours to write

There is deliberately no fixed fill manifest. `CATALOG.md` gives a copy *formula* per section (the framing), and you write strong, specific, client-true copy against it. Keep every claim regulator-safe (AHPRA or the client's market equivalent): describe the offer, process, and care model, never promise a guaranteed outcome.

## Tracking

Tracking (drop-off analytics + Meta Pixel) is a *separate* concern from the design. Once a page is built, wiring tracking onto it is handled by the `grom-client-factory:reconcile-lp-tracking` skill (or your Grom tracking runbook). This repo is the design system only.
