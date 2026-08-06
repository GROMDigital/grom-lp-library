# LP Library - Agent Guide

Operating layer for this repo: what is canonical, where the copies are, and what you must do when you change something. For how to actually build a page, read `README.md` then `BUILD-GUIDE.md`.

## This repo is the source of truth

`https://github.com/GROMDigital/grom-lp-library` is the library. Push as the **`GROMDigital`** GitHub account (`gh auth switch -u GROMDigital`), not a personal one.

Two other copies of these files exist. **Neither is canonical, and both drift.** If they disagree with this repo, this repo wins.

| Copy | Path | What it is |
|---|---|---|
| **Canonical** | this repo | The library. All changes land here first. |
| Working copy | `Grom Digital Sub-Account/projects/lp-library/` | Where day-to-day agent work happens inside the Grom monorepo. That monorepo tracks only 7 of these files (`BUILD-GUIDE.md`, `CATALOG.md`, and the 5 `starters/*/index.html`); everything else there is untracked. It has **no git remote**, so its history is not the library's history. |
| Deployed mirror | `Grom Digital Sub-Account/projects/grom-medspa-showcase/library/starters/*/index.html` | The internal visual browse at `https://grom-medspa-showcase.vercel.app/library`. Byte-identical copies of the 5 starters, in their own repo (`GROMDigital/grom-medspa-showcase`), auto-deployed from its `main`. |

## When you change a starter template

Do all three, in order. Stopping after the first leaves the browse page contradicting the library.

1. Change it **here**, run the QA scripts below, commit, push.
2. Copy the changed `starters/<name>/index.html` over the showcase mirror, commit and push that repo. It deploys itself from `main`.
3. Copy it into the monorepo working copy if you are working there, so the two do not drift further.

Verify the deploy actually picked the change up before calling it done. Vercel usually lands within a minute; confirm against the live URL, not the commit.

## Canonical section order

Every starter follows this. Keep it when you reorder, and follow it when you compose a new page.

```
nav -> hero -> reviews -> clinic photo (media) -> benefits -> process -> offer -> practitioner -> marquee-trust -> stats band -> faq -> cta -> footer -> sticky mobile CTA
```

`benefits -> process -> offer` is a fixed relative sub-order using whichever of the three a page has; a page missing one just skips it. Optional throughout: media, benefits, process, practitioner, marquee-trust, stats band. `booking--selector` only appears on content-hero pages, directly before the FAQ, never on a calendar-at-top page (all five starters are calendar-at-top, so none of them have it).

## Verification

Four scripts, from `qa/` (`npm install` there first). The first three take a file; the fourth takes nothing.

```bash
node render-check.mjs <file>          # layout overflow + console errors, 4 viewports
node guardrails.mjs <file>            # em dashes, named platforms, leftover {{ }}
node token-lint.mjs "$PWD/<file>"     # contract tokens only. MUST be an absolute path
node guides-lint.mjs                  # every block documented in CATALOG.md
```

`token-lint.mjs` silently passes without checking anything if you give it a relative path. Always pass `"$PWD/..."`.

Run `guides-lint.mjs` whenever you touch `blocks/`, `CATALOG.md`, or `BUILD-GUIDE.md`. It is the only script that checks the guides, and it is how an archetype every starter uses (`nav--bar.html`) sat undocumented without anything going red.

## Rules that bite

- **Never break a section apart.** Each `<section>` is one self-contained unit: its marker comment, its scoped `<style>`, and its markup. Move all of it or none of it.
- **Keep the marker comments.** Every section is preceded by `<!-- ===== NAME (archetype) ===== -->`. Reassembly has silently dropped these before.
- **Watch the closing `</script>` on the inlined motion block.** Losing it makes the browser swallow the rest of the file, so *all* page JS dies with no console error. It shows up only as a `render-check` overflow failure, because the marquee is never clipped.
- **Zero `{{ }}` may remain** in anything under `starters/` or in a finished client page.
- **Exactly one `#lp-booking-widget` and one `id="hero"`** per page.
- **Reused archetypes get pasted verbatim.** Fill the slots; do not restyle the block.
- Media sections sit on `var(--surface-2)`, not `var(--bg)`, so they read as a distinct band.

## Not in this repo

The monorepo working copy carries leftovers that were deliberately never pushed here: `index.bespoke-*.html` / `index.rebuild-wip-*.html` drafts, a `.build/` folder, and four stale per-starter `README.md` files removed in `d3fe3f7` for describing clinics and block names that no longer exist. Do not copy any of it up. If you find a per-starter `README.md`, it is stale by definition; the maintained per-template reference is the table in `BUILD-GUIDE.md`.

Tracking is not a design concern and is not configured here. Wiring it onto a finished page is the `grom-client-factory:reconcile-lp-tracking` skill's job.
