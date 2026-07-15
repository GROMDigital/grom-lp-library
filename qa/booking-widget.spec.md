# Booking widget: recon + theming decision

## Step 1 recon: does the embed render into host DOM, shadow root, or iframe?

Source read: `SK Skin and Body Health/booking-worker/src/index.ts`, `src/embed.ts`, `widget/embed.src.js` (the live `/embed.js` payload).

- `src/index.ts` routes `GET /embed.js` to `handleEmbed(env)`.
- `src/embed.ts` returns `EMBED_JS` (the contents of `widget/embed.src.js`) verbatim as `application/javascript`. No server-side templating or per-request variation.
- `widget/embed.src.js` is a plain IIFE. It reads config off `document.currentScript` data-attributes (`data-worker`, `data-product`, `data-turnstile-site-key`), then does:
  ```js
  var mount = document.getElementById("sk-booking-widget");
  if (!mount) return;
  ```
  and builds the widget markup with `mount.innerHTML = ...` (template string with the entry chip, date/time picker, concern chips, form).
- **No `attachShadow(...)`, no `<iframe>`, no shadow-root anywhere in the file** (`grep -c attachShadow|iframe|shadow` → `attachShadow: 0`, `iframe: 0`, `shadow: 23`; all 23 shadow hits are CSS `box-shadow`/`--shadow` custom properties, not Shadow DOM).

**Finding: the widget renders directly into the host page DOM.** Host-page CSS can reach every node the widget creates, including the class the brief standardizes on.

## Class the embed emits for time slots

Confirmed by reading the widget's own generation code:
```js
var chip = document.createElement('button');
chip.className = 'time-chip';
...
wrap.querySelectorAll('.time-chip').forEach(...)
```
Slot buttons get `class="time-chip"`, plus state modifier classes `.muted` (unavailable) and `.sel` (selected) applied via `classList`. This is exactly the `.time-chip` selector the brief requires the block to standardize on: the real embed already emits it, so no invented convention was needed.

Other classes the SK embed emits for reference (not part of the required contract, listed for completeness): `.entry-chip`, `.chip-helper`, `.chip-wrap`, `.concern-chips`, `.concern`.

## Theming approach chosen

**Host DOM path (per the brief's branch for this case):** theme via host-page CSS targeting the widget's mount id and its `.time-chip` class, both written with theme tokens (`var(--…)`) only, per Global Constraints.

One caveat worth recording: the SK instance of `embed.src.js` injects its own `<style>` block scoped to its own mount id (`#sk-booking-widget { --ivory: #FAF7F2; ... }`), i.e. it ships hardcoded brand colors rather than reading host CSS custom properties. Because there is no shadow boundary, host-page rules targeting `#lp-booking-widget .time-chip` are valid CSS and will apply, but if a future generic embed (mounted at the standardized `#lp-booking-widget` id) ships its own ID-scoped stylesheet the way SK's does, whichever rule set has higher specificity / loads later wins. `booking-widget.html`'s rules use the standardized `#lp-booking-widget` selector so they are ready to take effect the moment a generic (non-brand-hardcoded) embed is deployed; full override is not guaranteed against a self-styling embed without that embed's cooperation, but that is an embed-side concern, not a block-authoring gap. The block itself is written correctly per the "host DOM" branch of the brief.

Confirms the mount-id contract already used on the tracking side: Task 6's `lp.js` (`client-lp-tracking/worker/src/lp-js.ts`) uses `WIDGET_SELECTOR = "#lp-booking-widget, #sk-booking-widget"`, i.e. `#lp-booking-widget` is already the standardized, forward-looking mount id for the tracking loader, and `#sk-booking-widget` is kept only for SK back-compat. `booking-widget.html` uses `#lp-booking-widget` exclusively, matching that contract.

## `/embed.js` 404-in-isolation allowance

`booking-widget.html` ships `<script src="{{booking_worker_url}}/embed.js" async></script>` with an unfilled `{{booking_worker_url}}` template slot. When rendered in isolation by `render-check.mjs` (no real worker behind the literal placeholder host), that script tag will fail to load and log a console error / failed resource load. This is already covered by `render-check.mjs`'s `IGNORE` filter:
```js
const IGNORE = /\/embed\.js|ERR_FAILED|Failed to load resource/; // placeholder booking embed 404 is expected
```
So the booking block's render-check runs are expected to pass cleanly with this one whitelisted failure and no others (no overflow, no other console errors).
