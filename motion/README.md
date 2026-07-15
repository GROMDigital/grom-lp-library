# Motion layer - hook contract

`motion.js` + `motion.css` are the ONE shared motion system for every block/starter in `reference/lp-library/`. An archetype author does not write animation code; they write markup that uses the hooks below, and the motion layer does the rest.

## How to include it

In the document `<head>`, after the theme `<style>` block:

```html
<link rel="stylesheet" href="motion/motion.css">
```

Right before `</body>` (after all block markup is on the page):

```html
<script src="motion/motion.js"></script>
```

Inline both when assembling a client LP, same as the theme CSS is inlined per `BUILD-GUIDE.md`.

## Progressive enhancement - read this first

Content is visible by default. `motion.js` adds a `js-motion` class to `<html>` as its first act; `motion.css` scopes every hidden-initial rule under `html.js-motion`. No JS (blocked, broken, 404) means that class never appears, so nothing in `motion.css` ever hides anything: every section renders exactly as authored, fully visible, static. JS running is what turns the page from "static" into "choreographed," never the other way round.

`prefers-reduced-motion: reduce` is honored twice: `motion.js` skips animated code paths outright, and `motion.css`'s own `@media (prefers-reduced-motion: reduce)` block force-overrides visibility with `!important`, independent of JS state. A ~2600ms failsafe force-reveals every `.reveal`/`.reveal-stagger` element no matter what, so nothing can get stuck invisible.

## The hooks

| Hook | Where it goes | What it does |
|---|---|---|
| `.reveal` | any element | Fades + lifts in once ~14% of it is in view (`IntersectionObserver`, `threshold:.14`). Adds `.is-visible` on trigger. |
| `.reveal-stagger` | a parent wrapping several direct-child elements | Same trigger as `.reveal`, but staggers each **direct child** in with an incremental delay (`.08s` step, up to the 10th child) instead of animating the parent itself. |
| `[data-count-to="N"]` | any element, N = target number | Counts up from a computed starting point to `N` once ~60% visible. Ease-out cubic, ~1s. |
| `data-count-prefix="..."` | same element | Prepended to every rendered value, eg `data-count-prefix="£"`. |
| `data-count-suffix="..."` | same element | Appended to every rendered value, eg `data-count-suffix="+"`. |
| `data-count-decimals="N"` | same element | Fixed decimal places (default `0`). Thousands grouping is always applied via `toLocaleString`. |
| *(trailing element child)* | inside a `[data-count-to]` element, after the number | Any existing element node inside the counter (eg `<span class="unit">+</span>`) is preserved exactly, never wiped. Only the numeric text is replaced. |
| `.marquee` | outer wrapper | Clipping frame for an auto-scrolling row. |
| `.marquee-track` | one child of `.marquee`, containing the items | Write it **once**; `motion.js` clones it and marks the clone `aria-hidden="true"` so the CSS keyframe loop (`translateX(0)` → `translateX(-100%)`) is seamless. Pauses on `:hover`/`:focus-within`, in CSS, no JS needed. Without JS (or under reduced motion) the track wraps onto multiple lines instead of clipping, so content is never lost. |
| `[data-parallax]` | any element | Translates on the Y axis while scrolled through view. Strength via the attribute value, eg `data-parallax="0.15"` (default `0.12`). Skipped entirely under reduced motion; the element just stays static. |
| `[data-cta]` | a button/link | Magnetic pointer-follow on hover, **only** when `(hover:hover) and (pointer:fine)` matches (skipped on touch, and under reduced motion). |
| `<details class="faq-item">` | a native `<details>`/`<summary>`/content element | Native open/close already works with zero CSS or JS. `motion.js` only smooths the height transition via the Web Animations API when supported; if unsupported, or reduced motion is on, native (instant) toggling is left completely alone. |
| `#sticky` | one fixed-position element, id must be exactly `sticky` | Hidden (`translateY(115%)`) until the user scrolls past `#hero`, then slides in (`.is-visible`). Falls back to a "scrolled past one viewport" heuristic if there is no `#hero` on the page. Without JS it keeps whatever static visibility the archetype's own CSS gives it. |
| `#hero` | the hero `<section>`/`<header>` | Only needed to drive `#sticky`'s show/hide trigger. Optional otherwise. |
| `#lp-booking-widget` | booking widget mount, id must be exactly this | `motion.js` delegates click handling on this container for any `.time-chip` inside it (including ones injected later by the real booking embed), toggling `.sel`. This is the same mount id the tracking loader and the booking embed both key off - never rename it (see `BUILD-GUIDE.md` §6). |
| `.time-chip` | a clickable time-slot element inside `#lp-booking-widget` | Click toggles `.sel` on itself and clears `.sel` from its sibling chips (its immediate parent is the selection group, so multiple day-groups do not fight each other). `.muted` chips are inert (unavailable slots). |

## Auto behaviors (no markup required)

- **Scroll progress bar**: `motion.js` injects `#lp-progress` (`.lp-progress-bar`) as the first child of `<body>` itself and keeps its width in sync with scroll position. Opt out per page with `<body data-no-progress>`.

## Things that are NOT hooks (don't rename these)

`#sticky` and `#lp-booking-widget`/`.time-chip` are exact-id/exact-class contracts shared with other systems (the tracking loader, the booking-worker embed). Do not wrap them, duplicate the id, or rename them per-archetype.

## Testing

`motion/selftest.html` is a minimal page wired to every hook above; open it directly or drive it with Playwright to sanity-check the motion layer in isolation.

To test a real block/theme combination WITH motion, use the harness:

```
qa/host.html?theme=themes/<theme>.css&block=blocks/<block>.html&motion=1
```

Add `&motion=1` to `render-check.mjs`'s composed-page requests to have it inline `motion/motion.css` and `motion/motion.js` automatically. Omit `motion=1` to render the block statically (no motion layer), which is also how you confirm the progressive-enhancement fallback: the block must look fully correct and fully visible either way.
