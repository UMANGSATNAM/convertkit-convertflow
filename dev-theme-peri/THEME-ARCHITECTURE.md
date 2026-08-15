# THEME ARCHITECTURE — ConvertFlow Universal Plug-and-Play Chassis

> **Base Chassis Specification v2.0**
> This theme serves as the universal foundation chassis for an automated Shopify store-generation engine. It allows 70+ variants of every section type (`pdp-v1..70`, `pc-v1..70`, `hero-v1..70`, etc.) to plug in seamlessly without manual fixing.

---

## 1. Naming & CSS Isolation Contract
To guarantee zero style leakage across 70+ section variants:
- **File Naming**: `sections/{type}-v{n}.liquid` (e.g., `sections/pc-v12.liquid`, `sections/pdp-v33.liquid`).
- **CSS Isolation**: All CSS rules inside a section MUST be scoped under `.{type}v{n}-` (e.g., `.pcv12-card`, `.pdpv33-cta`).
- **Zero Global Leakage**: Sections MUST NEVER style raw `body`, `h1`, `h2`, `p`, or `button` tags globally.

---

## 2. Global Design Token Specification

All sections consume shared CSS variables defined in `layout/theme.liquid` from `settings_schema.json`. Section styling relies on these tokens for instant automated re-skinning:

| Token Name | Default Value | Description |
| :--- | :--- | :--- |
| `--color-primary` | `#111827` | Primary brand color (buttons, headings) |
| `--color-secondary` | `#4B5563` | Subtitles and secondary UI elements |
| `--color-accent` | `#2563EB` | Call to action, highlights, active states |
| `--color-bg` | `#FFFFFF` | Primary page background |
| `--color-bg-secondary` | `#F9FAFB` | Alternate section background |
| `--color-surface` | `#FFFFFF` | Card container background |
| `--color-text` | `#111827` | Main body text |
| `--color-text-muted` | `#6B7280` | Muted text and captions |
| `--color-border` | `#E5E7EB` | Dividers and input borders |
| `--color-sale` | `#DC2626` | Sale badges and discount callouts |
| `--color-star` | `#F59E0B` | Rating star color |
| `--font-heading` | `'Inter', sans-serif` | Heading font stack |
| `--font-body` | `'Inter', sans-serif` | Body text font stack |
| `--page-width` | `1280px` | Maximum container width |
| `--radius-button` | `8px` | Button corner radius |
| `--radius-card` | `12px` | Product & content card radius |
| `--radius-badge` | `99px` | Badge pill corner radius |

---

## 3. Shared JavaScript Modules

Loaded once, deferred, from `layout/theme.liquid`. Sections must never re-implement these.

| Asset | Global | What it owns |
| :--- | :--- | :--- |
| `utils.js` | `window.PubSub`, `window.domReady` | Small helpers |
| `cart-drawer.js` | `window.CartDrawer` | Wraps `fetch` once — any `/cart/add.js`, `/cart/change.js` or `/cart/update.js` from **any** call site refreshes the drawer, updates counts and opens it. No per-section cart code needed. |
| `wishlist.js` | `window.Wishlist` | Single store, key `cf_wishlist_items` |
| `recently-viewed.js` | `window.RecentlyViewed` | Single store, key `cf_recent_products` |
| `predictive-search.js` | — | Binds any `[data-predictive-search]` input |
| `countdown.js` | `window.CFCountdown` | Binds any `[data-countdown]` element |
| `facets.js` | — | AJAX collection filtering via Section Rendering API |

### Events

```javascript
document.addEventListener('cart:updated', e => e.detail);        // cart object
document.addEventListener('wishlist:updated', e => e.detail);    // { items, count, handle, saved }
document.addEventListener('recently-viewed:updated', e => e.detail);
document.addEventListener('facets:updated', e => e.detail);      // { url }

document.dispatchEvent(new CustomEvent('cart:added'));    // force drawer refresh + open
document.dispatchEvent(new CustomEvent('cart:refresh'));  // refresh without opening
window.CartDrawer.open();  window.toggleWishlist();
```

### Markup contracts — no JS per section

| Attribute / class | Wired by | Purpose |
| :--- | :--- | :--- |
| `[data-cart-open]` | `cart-drawer.js` | Opens the cart drawer instead of navigating |
| `[data-cart-count]`, `[class*="cart-count"]` | `cart-drawer.js` | Live item count |
| `[data-wishlist-toggle]` + `data-wishlist-handle/id/title/price/image/url` | `wishlist.js` | Heart button; paints `.active` / `aria-pressed` |
| `[data-wishlist-count]` | `wishlist.js` | Live saved count |
| `[data-recently-viewed]` | `recently-viewed.js` | Auto-renders stored items |
| `[data-predictive-search]` | `predictive-search.js` | Live product suggestions |
| `[data-countdown]` + `data-countdown-mode/hours/end/daily/expired` | `countdown.js` | All offer timers |

---

## 3b. Universal Snippets

Render these instead of writing new markup:

| Snippet | Params | Notes |
| :--- | :--- | :--- |
| `back-in-stock` | `product`, `heading`, `body`, `button_label`, `accent` | **Variant-aware** — shows when the *selected* variant is sold out. Submits tagged `notify-me` with product + variant id. |
| `wishlist-button` | `product`, `class`, `size` | `class` lets each section keep its own look |
| `wishlist-icon` | `class`, `size`, `label` | Header icon + live badge |
| `search-bar` | `class`, `placeholder`, `limit`, `compact` | `compact: true` = icon-width, expands on focus |
| `countdown-timer` | `product`, `mode`, `hours`, `prefix`, `class` | Reads theme settings by default |
| `trust-badges` | `image`, `text` | Merchant image, else inline SVG row — no external request |
| `recently-viewed-track` | — | Rendered from the layout on product templates |
| `product-card` / `card-v{n}` | `card_prod`, style params | Shared cards; never fork them |

---

## 3c. Hard rules the engine can rely on

- **No external image hosts.** Every image is either a merchant upload (`image_url`) or a Shopify `placeholder_svg_tag`. Zero requests to Unsplash or any other store's CDN.
- **No hardcoded currency.** All money passes through the `money` filter — multi-currency safe.
- **No invented social proof.** Rating and review lines are settings, empty by default.
- **Every section has a `preset`** except 5 template-bound ones (`header`, `footer`, `main-cart`, `main-collection`, `main-search`), so the engine can add any section programmatically.
- **Every declared setting is used.** No orphan settings.

---

## 4. Standard Shopify Metafields Map

The engine and section snippets consume these standardized Shopify metafield namespaces:

| Metafield Handle | Type | Description |
| :--- | :--- | :--- |
| `reviews.rating.value` | `rating` | Star rating average (e.g. `4.9`) |
| `reviews.rating_count.value` | `number_integer` | Total number of reviews |
| `custom.ugc_videos` | `list.file_reference` | UGC customer video URLs for PDP |
| `custom.bundle` | `list.product_reference` | Product bundle recommendations |
| `custom.offers` | `single_line_text_field` | Active product specific promo code |
| `custom.usp` | `json` | Unique selling proposition bullet points |

---

## 5. Discount Code & Promo Engine Sync Protocol

Since Liquid cannot directly query Shopify backend discount rules, the store-generation engine writes active promo codes via Shopify Admin API to:
1. `settings_data.json` → `"active_promo_code": "SAVE20"`
2. `shop.metafields.custom.active_discount` → `"SAVE20"`

Universal snippets (`promo-code.liquid`, `cart-drawer.liquid`, `product-card.liquid`) read from these sources and render one-click `/discount/{CODE}` checkout links automatically.

---

## 6. What the engine must populate

Counted across all 1,647 sections. These are the setting types that decide whether a generated store looks finished or empty:

| Setting type | Count | Engine action |
| :--- | ---: | :--- |
| `url` | 717 | Point at real collections / pages; blank renders no link, never a dead `#` |
| `image_picker` | 605 | Upload store images; unset falls back to a Shopify placeholder |
| `collection` | 337 | **Highest priority** — an unset collection renders the section's empty state |
| `link_list` | 86 | Menus |
| `product` | 53 | Bundles, upsells, featured picks |
| `video` | 13 | UGC reels, video banners |
| `blog` | 11 | Blog sections |

Global settings under **Settings → Social Proof & Urgency** control every countdown and the social-proof popup store-wide, so the engine sets the sale deadline and offer copy in one place rather than per section.

---

## 7. Section inventory

| Series | Count | Purpose |
| :--- | ---: | :--- |
| `pdp-v1..70` | 70 | Product pages |
| `pc-v1..70` | 70 | Product grids |
| `cl-v1..70` | 70 | Collection layouts |
| `cp-v1..70` | 70 | Collection pages |
| `ab-v1..40` | 40 | Announcement bars |
| `cdr-v1..20` | 20 | Cart drawers |
| `popup-v1..20` | 20 | Marketing popups |
| `hp*` | ~1,200 | Homepage sections across 64 homepage identities |

Cards live in `snippets/card-v{n}.liquid` and are rendered by the grid sections — change a card once, every grid using it updates.
