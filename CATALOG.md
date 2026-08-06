# LP Library Catalog

Reference catalog of every block archetype and theme in `projects/lp-library/`. Use this to decide which archetypes to compose (or which starter to clone) for a new client landing page, and to know exactly which `{{slot}}` values you must fill.

This is a **design-first** library. It ships structure, not copy. Each `blocks/*.html` file is a self-contained `<section>` (or `<footer>`) archetype with its own scoped `<style>`, styling exclusively with the CSS custom properties defined in `themes/_contract.css` (`--bg`, `--ink`, `--accent`, `--font-display`, etc). Paste archetypes in order, wrap them in one HTML document, add one theme's tokens to the `<head>`, inline the shared motion layer, and write your own copy into the slots. See `BUILD-GUIDE.md` for the full assembly procedure.

There is deliberately no fixed fill manifest. Copy guidance below is a formula (the framing each section's copy should follow, e.g. "outcome + specific offer" for a hero headline), not finished prose or fixed values. You write strong, specific, client-true copy against that formula. Route high-stakes lines (hero headline, primary offer) through the marketing/copywriter agent panel to pressure-test or polish, but the copy is yours to craft, not a form to fill. The five shipped starters (`starters/*/index.html`) are finished design demos to look at for tone and density, not copy templates to lift text from.

## How archetypes, themes, and motion combine

- **28 block archetypes** across 14 section types live in `blocks/`, named `<section>--<archetype>.html` (e.g. `hero--split.html`, `offer--deposit.html`). Multiple archetypes per section exist so a page can be built from genuinely different structural choices, not one layout recolored four ways. Deliberately vary which archetype you pick per section across different client pages; do not default to the same set every time, or every page ends up structurally identical with different words on it.
- **5 themes** in `themes/` (plus the `_contract.css` token contract every theme satisfies) re-skin whatever archetypes you chose: palette, type, radii, spacing, and 8 decorative tokens. A block never hardcodes a color or font; it only reads contract variables, so any archetype works under any theme.
- **One shared motion layer** (`motion/motion.js` + `motion/motion.css`, contract in `motion/README.md`) drives every reveal, stagger, count-up, marquee, parallax, sticky-CTA, and booking-chip interaction across every archetype. Archetypes ship the markup hooks (`.reveal`, `.reveal-stagger`, `[data-count-to]`, `.marquee-track`, `[data-parallax]`, `[data-cta]`, `#sticky`, `#lp-booking-widget`/`.time-chip`); they never write their own animation code. Content is fully visible with motion.js absent, blocked, or erroring; see `motion/README.md` for the progressive-enhancement contract in full.

A typical page order (see `BUILD-GUIDE.md` §1 for the full composition flow):

`hero -> reviews -> media (optional) -> benefits (optional) -> process (optional) -> offer -> practitioner (optional) -> marquee-trust (optional) -> stats band (optional) -> booking (content-hero pages only) -> faq -> cta (optional) -> footer`

`booking--selector` should always sit before the FAQ archetype, and the footer archetype always comes last. The exception is a calendar-at-top page built on `hero--booking`: that hero already carries the one booking mount in the fold, so such a page does not place `booking--selector` at all (see the one-booking-mount rule under Booking below).

---

## Block archetypes

### Nav bar (1 archetype)

#### `blocks/nav--bar.html`

**Layout personality:** A slim page-opener strip carrying a two-line wordmark (name over a spaced-out sub-label) on the left and an optional pill CTA on the right that scrolls to the hero booking. Renders as a `<header>`, not a `<section>`, and is the only archetype that sits above the hero.

**When to use:** Any page that wants a branded top strip before the hero. Place it immediately before the hero archetype. It is page chrome rather than a numbered section type, so it does not count toward the page's section rhythm and is never optional-in-the-middle: it either opens the page or is absent. The nav CTA is hidden below 768px on purpose, since on mobile the hero's booking sits one scroll away.

**Slots:** `{{wordmark_name}}`, `{{wordmark_sub}}`, `{{nav_cta}}`

**Copy formula:** `wordmark_name` = the clinic name exactly as it should read as a logotype, no tagline. `wordmark_sub` = a short locator or descriptor in 2-4 words (service category, suburb, or both), rendered uppercase and letter-spaced, e.g. "Skin Atelier &middot; Marylebone". `nav_cta` = a two or three word action label ("Book a consult"), not a sentence.

---

### Hero (4 archetypes)

Every hero archetype carries `id="hero"`, which the motion layer's `#sticky` mobile bar uses as its show/hide trigger; do not remove that id regardless of which hero you pick.

#### `blocks/hero--centered.html`

**Layout personality:** Single centered column, no media panel, two soft ambient glows behind the copy. A trust row (star rating + credential) sits under the CTA instead of a price chip.

**When to use:** Complimentary-consultation or no-stated-price positioning where credibility (rating, credential) is the trust lever instead of a number, or any page that wants a tight, distraction-free opening screen.

**Slots:** `{{hero_eyebrow}}`, `{{hero_headline}}`, `{{hero_headline_emphasis}}`, `{{hero_subhead}}`, `{{primary_cta_label}}`, `{{cta_micro}}`, `{{trust_rating}}`, `{{trust_credential}}`

**Copy formula:** eyebrow = service category + suburb/area, short. Headline = outcome + specific offer framing, split across two slots: `{{hero_headline}}` carries the main line, `{{hero_headline_emphasis}}` is a short trailing word or phrase rendered in italic accent color (e.g. headline "Calm, Considered" + emphasis "Skin Renewal"). Subhead = one sentence removing the biggest friction point. CTA label = action verb + what they get. `cta_micro` = a short reassurance line under the button (e.g. "Secure booking, confirmed by text"). `trust_rating` = "4.9 from 210 reviews" format; `trust_credential` = a one-line credential badge (who delivers it, or an accreditation).

---

#### `blocks/hero--fullbleed.html`

**Layout personality:** Full-width dark gradient band with a scrim, copy pinned bottom-left, a floating now/was price chip top-right. High-contrast, image-forward, the most editorial of the three heroes.

**When to use:** Price-led or package offers where a bold, magazine-style opening screen suits the brand, and the now/was price pairing needs to be visible immediately.

**Slots:** `{{price_label}}`, `{{offer_price}}`, `{{offer_was_price}}`, `{{hero_eyebrow}}`, `{{hero_headline}}`, `{{hero_headline_emphasis}}`, `{{hero_subhead}}`, `{{primary_cta_label}}`, `{{cta_micro}}`

**Copy formula:** same eyebrow/headline/emphasis/subhead/CTA/micro formula as `hero--centered`. `price_label` = a short kicker over the price ("First Visit", "Starting From"). `offer_price` / `offer_was_price` = the current price and the pre-discount price it is struck through against; if there is no discount mechanic, drop `offer_was_price` to an empty string rather than inventing a was-price.

---

#### `blocks/hero--split.html`

**Layout personality:** Asymmetric two-column split: copy on the left, a taller media panel with a parallax scene and a floating now/was price card on the right. Stacks with media above copy on mobile.

**When to use:** Consultative or higher-ticket positioning where a practitioner or clinic image builds trust from the first screen, and you still want the price framed as a floating card rather than a chip in a dark band.

**Slots:** `{{hero_eyebrow}}`, `{{hero_headline}}`, `{{hero_headline_emphasis}}`, `{{hero_subhead}}`, `{{primary_cta_label}}`, `{{cta_micro}}`, `{{price_label}}`, `{{offer_price}}`, `{{offer_was_price}}`

**Copy formula:** identical to `hero--fullbleed` above (same slot set, different layout: light background, side-by-side grid instead of a dark full-bleed band).

---

#### `blocks/hero--booking.html`

**Layout personality:** Calendar-at-top split hero. A full value-prop stack on the left (eyebrow pill with a pulsing dot, headline with an italic `.em` accent word carrying an animated underline, subhead, one deposit chip, a primary CTA button + secure-payment microcopy, a trust row of rating + two credentials, and a treatment photo with a floating now/was price card) beside a live booking card on the right (a "Pick your time" heading, a reassurance line, and the booking widget), both in the first fold. The `#lp-booking-widget` skeleton is a complete, premium-looking scheduler: a calendar header row ("Live availability" + a pulsing dot on the left, the month in the display font on the right, over a hairline divider), the day-row (rounded day cards each with a small availability dot), the time-grid, and a widget footer (a selected-summary line + a full-width gradient confirm button styled like the hero CTA, carrying `data-cta`). Everything lives INSIDE the mount so the live embed replaces the whole thing. The left CTA scrolls back to `#hero`; the widget itself is the booking. The price photo is desktop-only (it balances the tall widget) and hides on mobile so the calendar leads. Two-column at >=1024px (`1fr minmax(420px,.85fr)`); stacks to one column below that. This archetype is a 1:1 tokenized port of the live Francesca BioRePeel hero.

**When to use:** High-intent, direct-response, or deposit-secures-booking offers where the visitor arrived ready to book and showing live availability in the fold is the strongest possible CTA. This is the patient-growth pattern (value prop + photo left, calendar right, above the fold). Because it embeds the one booking mount, a page that opens with `hero--booking` does not also place `booking--selector` (see the one-booking-mount rule below); any lower booking prompt is just a CTA that scrolls back to `#hero`. For consideration-led pages that must sell before revealing availability, use a content hero plus `booking--selector` near the FAQ instead.

**Slots:** `{{hero_eyebrow}}`, `{{hero_title}}`, `{{hero_title_em}}`, `{{hero_subhead}}`, `{{deposit_chip_strong}}`, `{{deposit_chip_rest}}`, `{{hero_cta}}`, `{{hero_cta_micro}}`, `{{trust_rating}}`, `{{trust_item_2}}`, `{{trust_item_3}}`, `{{hero_photo}}`, `{{hero_photo_alt}}`, `{{price_label}}`, `{{price_now}}`, `{{price_was}}`; then the booking card: `{{booking_title}}`, `{{booking_sub}}`, `{{booking_live_label}}` (e.g. "Live availability"), `{{booking_month}}` (e.g. "July 2026"), `{{booking_day_label}}`, `{{day_N_dow}}`/`{{day_N_dom}}` (4 days), `{{booking_time_label}}`, `{{slot_1..6}}`, `{{booking_selected_label}}` (e.g. "Selected") + `{{booking_selected}}` (e.g. "Tuesday 12 &middot; 9:30 am"), `{{booking_confirm}}` (confirm button label, e.g. "Reserve with £40 deposit"), `{{booking_worker_url}}`

**Copy formula:** eyebrow = service category + suburb/area, short. `hero_title` carries the main line, `hero_title_em` is a short trailing word or phrase rendered in italic accent color with the animated underline (same split as the other heroes). Subhead = one sentence removing the biggest friction to booking now. Deposit chip = `deposit_chip_strong` (the deposit amount, bolded) + `deposit_chip_rest` (e.g. "comes off the price"). `hero_cta` = action verb + what they get; `hero_cta_micro` = a short secure-payment reassurance line. Trust row = `trust_rating` ("4.9 rating"), then two short credentials (accreditation, location). `hero_photo` = the treatment image URL, `hero_photo_alt` a factual scene description; `price_label`/`price_now`/`price_was` = the floating price lockup (kicker, current price, struck was-price). `booking_title` = "Pick your time"; `booking_sub` = one reassurance line about the deposit/reschedule terms. The day/time labels and the day/slot chip content are illustrative skeleton values that the live embed replaces at runtime, so keep them plausible rather than inventing a real schedule. `booking_worker_url` = the client's booking-worker origin, not a full URL with `/embed.js` appended (the archetype appends `/embed.js` itself); use `https://your-booking-worker.invalid` while in progress. See `BUILD-GUIDE.md` §6.

**Structural notes (do not deviate):** the widget mounts into `<div id="lp-booking-widget">` and every time-slot element carries the `.time-chip` class (`.sel`/`.muted` state modifiers), exactly as `booking--selector`. Both selectors are shared contracts with the motion layer and the live booking embed; never rename, wrap, or duplicate them. There is exactly one `#lp-booking-widget` per page: if you use `hero--booking`, do not also place `booking--selector`.

---

### Trust marquee (1 archetype)

#### `blocks/marquee--trust.html`

**Layout personality:** A thin auto-scrolling strip of short trust badges between hairline borders, sitting directly under the hero.

**When to use:** Immediately after the hero, when you have 4-6 short credibility signals (accreditations, guarantees, association memberships, press mentions) worth a persistent strip rather than a full section.

**Slots:** `{{trust_1}}` through `{{trust_6}}`

**Copy formula:** short badge phrases only (2-5 words each), not sentences: certifications, membership bodies, guarantees, or press names. Never a claim that needs qualifying context to be true.

**Variant (opt-in):** add `lp-marquee-trust--mint` to the section class for a mint band (the `--glow-1` tint) with the tick badges hidden and the item text in the deep accent, leaving just the dot separators. The default surface band with tick badges is unchanged when the modifier is absent.

---

### Benefits (1 archetype)

#### `blocks/benefits--cards.html`

**Layout personality:** A kicker/title/sub head above a 3-up grid of icon cards (rounded icon tile, title, one-line body), each with a pointer-follow spotlight. The "what to expect" beat that names the outcomes a treatment supports. 3 columns >=640px, 1 below.

**When to use:** After the hero (or after the offer), when you want to name three concrete outcomes/benefits as equal-weight cards rather than as steps or stats. Ported from the live Francesca "Designed to support three things" section.

**Slots:** `{{benefits_kicker}}`, `{{benefits_headline}}`, `{{benefits_sub}}`, and for each of 3 cards: `{{benefit_N_title}}`, `{{benefit_N_body}}`

**Optional variants (opt-in, off by default):** add `lp-benefits-cards--numbered` for a mono index in each card's top-right corner, and/or `lp-benefits-cards--six` to turn the 3-up grid into a two-row six-card "what's included" grid (cards 4-6 are hidden unless the variant is present, so any page using the plain block still renders exactly three cards). The sixth card may take the `card--offer` treatment (a tinted panel with a price line and an inline `card-cta` link in place of the icon) for a trailing pricing/booking card. Extra slots when `--six` is used: `{{benefit_4_title}}`/`{{benefit_4_body}}`, `{{benefit_5_title}}`/`{{benefit_5_body}}`, and `{{offer_card_title}}`/`{{offer_card_body}}`/`{{offer_card_cta}}`. Reproduces the live Alevere-style "consultation includes" six-card grid.

**Copy formula:** kicker = short label ("What to expect"). headline = names the promise. sub = one framing sentence. Each card = a short outcome title (2-3 words) + one sentence of support, phrased as "designed to support / help" rather than an outcome guarantee.

---

### Media (2 archetypes)

Pure image beats between content sections (clinic shot, treatment room, process, result). Each panel carries a floating glass caption chip. The translucent-white chip glass has no token equivalent, so it stays `rgba` white by design.

#### `blocks/media--panel.html`

**Layout personality:** A single full-width 16:10 photo panel with a floating caption chip. A visual breather.

**When to use:** A single environment/result shot deserves its own full-width beat between sections.

**Slots:** `{{media_image}}`, `{{media_alt}}`, `{{media_caption}}`

**Copy formula:** alt = factual scene description. caption = a short factual label of what the image shows ("Our clinic, Charlton").

#### `blocks/media--duo.html`

**Layout personality:** A two-up gallery of portrait (4:5) photo panels, each with a caption chip. Side-by-side >=640px, stacked below.

**When to use:** When two images tell the beat together (process + result, tools + texture).

**Slots:** for each of 2 panels: `{{duo_N_image}}`, `{{duo_N_alt}}`, `{{duo_N_caption}}`

**Copy formula:** same as `media--panel`, twice.

---

### Stats band (2 archetypes)

Both stats archetypes render on the theme's dark closing-band tokens (`--band-dark-bg`/`--band-dark-ink`), giving the page a dark contrast beat mid-page rather than saving all the dark treatment for the footer.

#### `blocks/band--stats-grid.html`

**Layout personality:** A statement column beside a 2x2 grid of number tiles in a bordered card, on a dark band with two ambient glows.

**When to use:** When you have four distinct numbers worth counting up (results delivered, years operating, treatments performed, rating), and want them to read as a unified proof block rather than scattered through the page.

**Slots:** `{{stats_kicker}}`, `{{stats_statement}}`, and for each of 4 stats: `{{stat_N_value}}`, `{{stat_N_unit}}`, `{{stat_N_label}}`

**Copy formula:** kicker = short label ("By The Numbers", "Proof, Not Promises"). Statement = one confident, factual claim sentence, not a guarantee of individual results. Each stat = a real or plausible whole number (drives the `data-count-to` count-up animation), an optional short unit suffix (`+`, `%`, a currency symbol), and a label naming what the number measures. Never state a number you cannot stand behind if a client asks for the source.

---

#### `blocks/band--stats-row.html`

**Layout personality:** A large pull-quote style statement above a single row of 3 stat figures with vertical dividers, on a dark band with one centered glow.

**When to use:** The leaner sibling of `band--stats-grid` when you only have 3 strong numbers, or want the statement to read as a standalone pull-quote rather than sitting beside the numbers.

**Slots:** `{{stats_kicker}}`, `{{stats_statement}}`, and for each of 3 stats: `{{stat_N_value}}`, `{{stat_N_unit}}`, `{{stat_N_label}}`

**Copy formula:** identical to `band--stats-grid` above, minus the fourth stat.

---

### Offer (3 archetypes)

#### `blocks/offer--centered-price.html`

**Layout personality:** A single narrow centered card: a large price lockup (with optional count-up), four bullet inclusions, a fine-print note, and a full-width CTA.

**When to use:** A flat-price or complimentary-consultation offer with no deposit mechanic, presented as the single obvious next step after the hero.

**Slots:** `{{offer_kicker}}`, `{{offer_headline}}`, `{{offer_headline_emphasis}}`, `{{offer_price_num}}`, `{{currency}}`, `{{offer_price}}`, `{{offer_was_price}}`, `{{offer_price_per}}`, `{{offer_includes_1..4}}`, `{{offer_note}}`, `{{primary_cta_label}}`, `{{cta_micro}}`

**Copy formula:** kicker = short label above the headline. Headline = benefit framing of the whole card, not just "The Offer", split into `{{offer_headline}}` + an emphasized trailing word/phrase in `{{offer_headline_emphasis}}`. `offer_price_num` is the plain number driving the count-up (e.g. `160`) and `currency` is its prefix symbol; `offer_price` is the same value as visible fallback text for when JS is absent, so keep them consistent. Four bullets = concrete, specific deliverables, one line each, no filler adjectives. Note = fine print that manages expectations (price varies by treatment, consultation is complimentary, no obligation), never a hard guarantee. `cta_micro` mirrors the hero's reassurance line.

---

#### `blocks/offer--deposit.html`

**Layout personality:** A two-pane horizontal card: a tinted price pane (now/was price plus a dedicated deposit-line row in the deposit accent color) beside an includes-and-CTA pane.

**When to use:** The offer is built around a deposit that comes off the treatment price and secures the appointment. This is the deposit-led counterpart to `offer--centered-price`.

**Slots:** `{{offer_kicker}}`, `{{offer_headline}}`, `{{offer_headline_emphasis}}`, `{{offer_price}}`, `{{offer_was_price}}`, `{{offer_price_per}}`, `{{deposit_line}}`, `{{offer_includes_1..4}}`, `{{offer_note}}`, `{{primary_cta_label}}`

**Copy formula:** headline/kicker formula identical to `offer--centered-price`. `deposit_line`: one short sentence stating the deposit amount and that it comes straight off the treatment price. Four bullets and note: same formula as `offer--centered-price`, but the note should also spell out the deposit mechanic plainly (amount, that it is deducted from the price, that it confirms the appointment).

**Optional part:** an `{{offer_cta_micro}}` secure-payment microcopy line renders under the CTA (mirrors the hero's reassurance line); remove the `.cta-micro` `<p>` when unused.

---

#### `blocks/offer--split-card.html`

**Layout personality:** A priced offer card beside a tall media panel carrying a floating tag chip. Two-column, stacks under 768px.

**When to use:** When a real image (treatment room, product, result) earns its own visual weight beside the offer, rather than the offer standing alone as in `offer--centered-price`.

**Slots:** `{{offer_badge}}`, `{{offer_headline}}`, `{{offer_price}}`, `{{offer_was_price}}`, `{{offer_price_per}}`, `{{offer_includes_1..4}}`, `{{offer_note}}`, `{{primary_cta_label}}`, `{{media_tag}}`

**Copy formula:** `offer_badge` = a short pill label above the offer name ("Most Booked", "Signature Treatment"). Headline/bullets/note: same formula as `offer--centered-price`. `media_tag` = a short caption chip floating over the image (what the image shows, factually).

---

### Practitioner (2 archetypes)

#### `blocks/practitioner--plate.html`

**Layout personality:** A single portrait "plate" with a pull-quote card overlapping its lower edge, styled as a first-person testimonial from the practitioner rather than a bio.

**When to use:** When the practitioner has a strong, quotable line about their own approach that builds trust faster than a full biography would.

**Slots:** `{{founder_image_url}}`, `{{founder_image_alt}}`, `{{founder_quote}}`, `{{founder_name}}`, `{{founder_title}}`

**Copy formula:** `founder_quote` = one to two sentences, first person, about why they practice this way or what they want every client to feel; not an outcome guarantee. Name/title = factual. Image alt = describe the scene factually, not a marketing line.

---

#### `blocks/practitioner--split.html`

**Layout personality:** A portrait beside a full bio, three credential chips, and its own CTA button, standard side-by-side introduction layout.

**When to use:** Practices led personally by a named practitioner where a fuller credibility narrative (not just a quote) is worth the space. Skip both practitioner archetypes if the client has no single named lead.

**Slots:** `{{founder_image_url}}`, `{{founder_image_alt}}`, `{{founder_name}}`, `{{founder_title}}`, `{{founder_bio}}`, `{{credential_1..3}}`, `{{cta_label}}`

**Copy formula:** bio = origin story (why they started the practice) + credential + care-model differentiator + closing line about who they lead today, two to four sentences, avoiding outcome guarantees. Three credential chips = short, factual (qualification, years practicing, association membership). `cta_label` = repeats the primary booking action; this archetype carries its own CTA since it can also serve as a page's closing trust beat before booking.

---

### Process (2 archetypes)

#### `blocks/process--ghost.html`

**Layout personality:** A fixed 3-step row, each with an oversized faded "ghost" numeral behind a small step badge, divided by top borders.

**When to use:** The default process explainer when three steps fully describe the journey (book, attend, result).

**Slots:** `{{process_kicker}}`, `{{process_headline}}`, and for each of 3 steps: `{{step_N_title}}`, `{{step_N_body}}`

**Copy formula:** kicker = short label. Headline = states what's being explained ("How It Works", or a client-specific variant). Each step = a short imperative title (2-4 words) + one sentence of detail. Step 1 = the booking action, Step 2 = what happens at/before the appointment, Step 3 = the outcome/result of the visit. Mirror the hero's CTA verb in Step 1's title where possible.

**Variant (opt-in):** add `lp-process-ghost--boxed` to the section class to render the 3 steps inside one white rounded card with solid circular number badges (the ghost numerals stay as a faint backdrop and the "Step 0N" text label is hidden). Rows divide by top borders on mobile, left borders across 3 columns >=640px. The default open ghost-numeral columns are unchanged when the modifier is absent.

---

#### `blocks/process--timeline.html`

**Layout personality:** A vertical numbered timeline with connecting rail and circular markers, fixed at 4 steps.

**When to use:** When the journey genuinely needs a fourth beat that `process--ghost`'s 3-step format can't fit (e.g. a follow-up or check-in step distinct from the appointment itself), or when a vertical rail suits the page's rhythm better than a 3-column row.

**Slots:** `{{process_kicker}}`, `{{process_headline}}`, and for each of 4 steps: `{{step_N_title}}`, `{{step_N_body}}`

**Copy formula:** same formula as `process--ghost` for the first 3 steps; the 4th step is typically an after-care, follow-up, or results-check beat that extends the journey past the appointment itself.

---

### Reviews (3 archetypes)

#### `blocks/reviews--cards.html`

**Layout personality:** A head (optional kicker + headline) above an OPTIONAL mint rating-banner, a fixed 3-card grid of equal-weight italic quotes (each with an initials avatar + treatment tag), then an OPTIONAL trailing wide photo panel and an OPTIONAL badge row. The rating-banner, trailing photo, and badge row are optional slotted parts: drop those elements when a page only needs the three cards.

**When to use:** The default reviews section when three strong, evenly-weighted quotes are available. Use the optional rating-banner / photo / badge parts when the social-proof beat should carry a headline rating, a supporting image, and accreditation badges in one section (as in the Francesca port).

**Slots:** `{{reviews_kicker}}`, `{{reviews_headline}}`, `{{rating_value}}`, `{{rating_fine}}`, and for each of 3 reviews: `{{review_N_quote}}`, `{{review_N_initials}}`, `{{review_N_name}}`, `{{review_N_tag}}`; optional trailing photo: `{{reviews_photo}}`, `{{reviews_photo_alt}}`, `{{reviews_photo_caption}}`; optional badges: `{{badge_1..3}}`

**Copy formula:** kicker = short label ("In their words"). headline = restate the count as social proof. `rating_value` drives the `data-count-to` count-up (e.g. `4.9`); `rating_fine` = source ("as reviewed on Treatwell"). Quotes = specific, not generic; ideally each of the 3 defeats a different objection. `review_N_initials` = the reviewer's initials for the avatar; `review_N_tag` = treatment received or "Verified visit". Real reviews when available; otherwise plausible, non-outcome-guaranteeing sample quotes.

**Mobile behavior:** on narrow viewports the 3 cards become a horizontal snap-scroll carousel with `.rv-dots` position dots (the motion layer lights the dot for the card nearest centre); it reflows to the static 3-column grid >=640px. No configuration needed.

---

#### `blocks/reviews--featured.html`

**Layout personality:** One large featured quote in an oversized card beside two smaller supporting mini-quotes stacked in a side column. Asymmetric, not a grid.

**When to use:** When one review is clearly the strongest (most specific, most quotable) and deserves to lead, with two others in support rather than equal billing.

**Slots:** `{{reviews_headline}}`, `{{review_rating}}`, `{{featured_quote}}`, `{{featured_name}}`, `{{featured_meta}}`, `{{support_1_quote}}`, `{{support_1_name}}`, `{{support_2_quote}}`, `{{support_2_name}}`

**Copy formula:** headline/rating formula identical to `reviews--cards`. `featured_quote` = the strongest, most specific quote available (defeats the biggest objection). `featured_meta` = a short qualifier under the name (treatment received, suburb). The two support quotes = shorter, defeat different objections than the featured one.

---

#### `blocks/reviews--marquee.html`

**Layout personality:** A centered head above an auto-scrolling horizontal rail of 6 review chips (masked edges, pauses on hover/focus).

**When to use:** When you have volume (6 usable quotes) and want reviews to read as an ongoing stream of proof rather than a curated handful.

**Slots:** `{{reviews_headline}}`, `{{review_rating}}`, and for each of 6 reviews: `{{review_N_quote}}`, `{{review_N_name}}`

**Copy formula:** same formula as `reviews--cards`, but keep each quote short (the chip is a fixed ~320px wide) since there are twice as many to fit; favor breadth of objections defeated across the 6 over depth in any one.

---

### CTA (2 archetypes)

Both CTA archetypes are secondary, mid-page or pre-footer conversion beats, restating urgency or the offer without repeating the hero verbatim. Use at most one per page, typically after trust-building content and before (or as part of leading into) booking.

#### `blocks/cta--band.html`

**Layout personality:** A single centered ask on a dark band with two contained glows, eyebrow + headline + subhead + one button + a reassurance line.

**When to use:** A punchy, single-message closing push, e.g. after reviews and before booking, when the page doesn't need a mini-offer restatement, just a confident "now book it" beat.

**Slots:** `{{cta_eyebrow}}`, `{{cta_headline}}`, `{{cta_subhead}}`, `{{cta_button}}`, `{{cta_reassurance}}`, and (framed variant only) `{{cta_bg_image}}`

**Copy formula:** eyebrow = a short urgency or trust signal. Headline = the single strongest reason to act now, not a repeat of the hero headline. Subhead = one sentence expanding on that reason. Button = action verb + what they get. Reassurance = a short line lowering friction (no obligation, free consultation, secure booking).

**Variant (opt-in):** add `lp-cta-band--framed` to the section class to render the band as a rounded, inset card centered in its own section padding, optionally over a darkened treatment photo (fill the `{{cta_bg_image}}` slot; leave the `.band-photo` element off, or the slot empty, for no photo), with a light (surface) button and a dot in the eyebrow pill. The default full-bleed solid band is unchanged when the modifier is absent.

---

#### `blocks/cta--split.html`

**Layout personality:** A statement column (kicker + headline + supporting sentence) beside a boxed action card that restates a mini price/offer line and its own CTA.

**When to use:** When the closing push should also re-anchor the price or deposit line one more time before booking, not just urgency alone.

**Slots:** `{{cta_kicker}}`, `{{cta_headline}}`, `{{cta_statement}}`, `{{cta_offer_line}}`, `{{cta_card_heading}}`, `{{cta_card_body}}`, `{{cta_button}}`, `{{cta_reassurance}}`

**Copy formula:** kicker/headline/statement = same intent as `cta--band`'s eyebrow/headline/subhead. `cta_offer_line` = a short restated price or deposit line (uses `--deposit-accent` styling, so it reads well for either a flat price or a deposit mechanic). `cta_card_heading`/`cta_card_body` = a tight restatement of the offer's value, 1 heading + 1 sentence. Button/reassurance: same formula as `cta--band`.

---

### Booking (1 archetype)

#### `blocks/booking--selector.html`

**Layout personality:** A two-pane card: a dark reassurance side panel (kicker, heading, body, 3 assurance bullets) beside the booking widget itself (day picker, time-slot grid, summary line, CTA, fallback contact).

**When to use:** Every LP needs exactly one booking section. Place it after trust-building content, immediately before the FAQ.

**Slots:** `{{booking_headline}}`, `{{booking_subhead}}`, `{{booking_side_kicker}}`, `{{booking_side_heading}}`, `{{booking_side_body}}`, `{{booking_assure_1..3}}`, `{{booking_day_label}}`, `{{day_N_dow}}`/`{{day_N_dom}}` (4 days), `{{booking_time_label}}`, `{{slot_1..6}}`, `{{booking_summary}}`, `{{booking_cta}}`, `{{booking_fallback}}`, `{{clinic_phone}}`, `{{booking_worker_url}}`

**Copy formula:** headline = direct booking CTA restated ("Book Your Mobile Facial", "Reserve Your Consultation"). Subhead = reduce friction by explaining what happens right after they pick a time. Side panel = a compact trust card: kicker + short heading + one-sentence body + 3 short assurance bullets (what makes booking safe/easy/flexible). Day/time labels and the day/slot chip content are illustrative skeleton values (the live booking embed replaces them at runtime); keep them plausible rather than inventing a specific real schedule. `booking_summary` = a short dynamic-reading line ("You've selected..."). `booking_cta` = the button label. `booking_fallback` = an alternative contact path for people who won't self-book online, paired with `clinic_phone` in `tel:` format.

**Structural notes (do not deviate):** the widget mounts into `<div id="lp-booking-widget">` and every time-slot element carries the `.time-chip` class (`.sel`/`.muted` state modifiers). Both selectors are shared contracts with the motion layer and the live booking embed; never rename them. `{{booking_worker_url}}` is the client's booking-worker origin, not a full URL with `/embed.js` appended (the archetype appends `/embed.js` itself). See `BUILD-GUIDE.md` §6.

**One booking mount per page.** There is exactly one `#lp-booking-widget` on any page. When a page opens with the `hero--booking` archetype, that hero already carries the booking mount in the fold, so the page does **not** also place `booking--selector`. A calendar-at-top page that wants a second booking prompt lower down uses a plain CTA that scrolls back to `#hero`, not a duplicate widget. Never place both `hero--booking` and `booking--selector` on the same page.

---

### FAQ (2 archetypes)

#### `blocks/faq--accordion.html`

**Layout personality:** A centered, single-column stack of 5 native `<details>`/`<summary>` accordion items, no JS required for the toggle itself.

**When to use:** The default, compact FAQ treatment, just before the footer.

**Slots:** `{{faq_headline}}`, and for each of 5 Q&A pairs: `{{faq_N_q}}`, `{{faq_N_a}}`

**Copy formula:** answer the top 5 booking objections, in this order: (1) price/what's included, (2) time/duration of the visit, (3) location/logistics, (4) suitability/safety for their situation, (5) practitioner/what happens at the appointment. Every answer should reassure and imply the next step is to book, without repeating the CTA verbatim.

**Variant (opt-in):** add `lp-faq-acc--left` to the section class for a left-aligned `{{faq_kicker}}` + title over full-width rows (the container widens to `--maxw`). The default centered-narrow layout (with the kicker hidden) is unchanged when the modifier is absent.

---

#### `blocks/faq--two-col.html`

**Layout personality:** An intro column (kicker, headline, one sentence, a "still have questions" link back to booking) beside the 5-item Q&A stack, intro column goes sticky on wide viewports.

**When to use:** When the FAQ section should also carry one more soft conversion nudge (the help link back to `#book`) alongside the objection-handling, rather than standing alone as a pure reference block.

**Slots:** `{{faq_kicker}}`, `{{faq_headline}}`, `{{faq_intro}}`, `{{faq_help_cta}}`, and for each of 5 Q&A pairs: `{{faq_N_q}}`, `{{faq_N_a}}`

**Copy formula:** the 5 Q&A pairs follow the identical formula to `faq--accordion`. `faq_intro` = one sentence framing why these are the right questions to answer. `faq_help_cta` = a short link label back to booking ("Still deciding? Book a free chat").

---

### Mobile sticky CTA (hand-authored, not an archetype)

There is no `blocks/sticky-cta--*.html` file. The fixed, mobile-only bottom bar with a single CTA button is small enough that it is hand-authored directly into each page's own markup and `<style>` block, following the motion layer's `#sticky` hook contract (`motion/README.md`): a fixed-position element with `id="sticky"`, styled entirely with theme tokens, hidden at the desktop breakpoint you choose (every shipped starter hides it above `1024px`; `768px` is also reasonable), showing a short label plus one CTA link to `#book`. Look at any starter's `.sticky-cta`/`#sticky` markup (e.g. `starters/direct-response/index.html`) as a working reference. Every LP needs one; it is the mobile conversion safety net while the visitor scrolls past the hero's CTA.

### Footer (2 archetypes)

#### `blocks/footer--multicol.html`

**Layout personality:** A 4-column band (brand blurb, visit/address, contact, hours) over a fine-print legal line, on the theme's dark closing-band tokens.

**When to use:** Every LP, always last.

**Slots:** `{{clinic_name}}`, `{{footer_blurb}}`, `{{footer_visit_label}}`, `{{footer_address}}`, `{{footer_map_href}}`, `{{footer_directions}}`, `{{footer_contact_label}}`, `{{footer_phone}}`, `{{footer_email}}`, `{{footer_hours_label}}`, `{{footer_hours}}`, `{{footer_year}}`, `{{footer_rights}}`, `{{footer_legal_href}}`, `{{footer_legal_label}}`, `{{footer_disclaimer}}`

**Copy formula:** factual only, no persuasive copy. `footer_blurb` = one factual sentence about the practice (not a tagline). Address is a coverage-area line for mobile services or a street/suburb line for a fixed clinic. `footer_phone` must be a real, dialable number matching `{{clinic_phone}}` used elsewhere on the page. `footer_disclaimer` = the practice's standard treatment-outcome/eligibility disclaimer line, never a promise of results.

---

#### `blocks/footer--centered.html`

**Layout personality:** A light, centered close: an italic wordmark over an address line and a fine-print disclaimer, on the page background (not a dark band). The quiet counterpart to `footer--multicol`.

**When to use:** Pages that end on the page background rather than a dark slab, and that have no directory of contact/hours to list (so `footer--multicol`'s contact/hours columns would force invented data). Ported from the live Francesca footer.

**Slots:** `{{clinic_name}}`, `{{footer_address}}`, `{{footer_disclaimer}}`

**Copy formula:** factual only. `clinic_name` = the practice name (rendered as an italic wordmark). `footer_address` = the street/suburb line. `footer_disclaimer` = the standard copyright + treatment-outcome disclaimer, never a promise of results.

---

## Themes

Each theme file in `themes/` defines the full `_contract.css` variable set (palette, type, layout, and 8 decorative tokens) with different values. A block archetype never needs to know which theme is active; it only reads contract variables. Exactly one theme is applied per LP, inlined into the document `<head>` after the contract (contract first, theme second, so the theme's values win). See `BUILD-GUIDE.md` §2 for the exact inlining order.

### `themes/clinical-trust.css`

Cool, sage-toned, credibility-led. Grotesque sans display face, tighter radii (6px), hairline shadows, smaller/tighter type scale. **Intended use:** injectable, dermatology, or doctor-led clinics where the positioning is clinical trust and a named practitioner, typically with a complimentary-consultation offer rather than a stated treatment price.

### `themes/direct-response.css`

Bold, warm, price-led. Serif display, pill-shaped buttons (`--btn-radius: 999px`), larger type scale, warmer palette. **Intended use:** price-led local services or packaged offers where a clear number and urgency are the primary conversion driver (mobile services, body-contouring packages, discount-style offers).

### `themes/premium-editorial.css`

Clay/charcoal palette, higher-ticket, editorial. Serif display and serif body, generous section spacing (`--space-section` up to 128px), squared-off corners (`--radius: 2px`), and CTAs with no drop shadow (`--shadow-cta: none`) for a flatter, more considered feel. **Intended use:** high-ticket aesthetic studios wanting a considered, premium feel with a stated starting price (not a discount) and an intimate, low-volume positioning.

### `themes/clinical-botanical.css`

Porcelain and deep-green palette with mint and blush ambient glows, gradient CTA buttons, pill-shaped buttons and chips (`--r-pill: 999px`), soft layered shadows, and the most generous corner radii (`--radius: 24px`) of the five themes. One of two themes that load external web fonts: it opens with a Google Fonts `@import` for Fraunces (display serif, used with italic emphasis) and Hanken Grotesk (body sans). **Intended use:** calm, botanical-clinical positioning (facials, skin renewal, aesthetic studios), especially where the offer is built around a deposit-secures-booking mechanic (pair with `offer--deposit`).

### `themes/clinical-steel.css`

Cool ice-and-steel-blue clinical palette (ice ground, graphite ink, one precise steel-blue accent, sage as the secondary accent), gradient steel CTA buttons, sharp radii (`--radius: 22px`, `--r-sm: 8px`), and soft layered shadows. The second web-font theme: it opens with a Google Fonts `@import` for Archivo (grotesque display), Inter (body), and IBM Plex Mono (`--font-mono`, used for clinical eyebrows, labels, data, and time slots). Aligned 1:1 to the live Alevere Stockton body-contouring LP tokens. **Intended use:** measured, credibility-led, non-surgical body-contouring / medical-aesthetic positioning where a personalised consultation-led session (with a deposit-secures-booking mechanic) is the offer; pairs naturally with the calendar-at-top `hero--booking`. The `starters/clinical-steel/` starter is the finished calendar-at-top demo built on this theme (a de-branded body-contouring clinic), composed from `blocks/` and reproducing the live Alevere design.

### `themes/_contract.css`

Not a theme to apply directly; this is the token contract every theme must fully satisfy and every block must style against exclusively. Use it as the reference list of every CSS custom property a new theme must define.

### Decorative tokens

`_contract.css` defines 8 decorative tokens on top of the core palette/type/layout set: `--cta-grad-a`, `--cta-grad-b`, `--shadow-cta` (a button's gradient start/end and drop shadow), `--glow-1`, `--glow-2` (ambient background glow colors), `--ghost-color` (the faded oversized numeral in `process--ghost`), `--deposit-accent` (the deposit/offer accent used by `offer--deposit` and `cta--split`), and `--r-pill` (pill corner radius for chips and buttons). Every theme now gives all 8 of these its own distinct values (its own gradient pair, its own glow tints, its own ghost tone, its own deposit accent), so an archetype that reads them (most of the CTA buttons in the library, both stats bands, both hero glows, `process--ghost`, `offer--deposit`, `cta--split`) renders with a genuinely different accent treatment per theme, not a single library-wide gradient recolored by palette alone. `--cta-grad-a`/`-b` collapse to a flat single color when a theme sets them equal (e.g. `premium-editorial` keeps `--shadow-cta: none` for a flatter button), so a theme can opt out of the gradient/glow look entirely while still satisfying the contract.
