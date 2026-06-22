# Shopify Multi-Niche Theme Engine — Data Contract

This document defines the interface boundary between the **Store Generation Engine** and the **Shopify Theme Templates**. 

---

## 1. Engine Build & Resolution Rules

At store generation time, the engine MUST execute the following folder copying and merging operations to construct the final Shopify theme directory:

1. **Step 1: Copy Core**
   - Copy the entire contents of `app/data/templates/theme-engine/core/` to the output theme directory.
2. **Step 2: Merge Selectable Niche**
   - Copy all contents from the selected niche directory `app/data/templates/theme-engine/niches/<selected-niche>/` (e.g., `niches/jewellery/`) directly into the output theme directory, overwriting any matching files (e.g., assets, snippets, layouts, templates).
3. **Step 3: Resolve CSS Assets**
   - The engine must copy `assets/niche-tokens.css` from the selected niche folder into the root `assets/niche-tokens.css` in the output theme. 
   - `theme.liquid` will load it statically via:
     `{{ 'niche-tokens.css' | asset_url | stylesheet_tag }}`
4. **Step 4: JSON Template Generation**
   - Keep structural JSON templates (`templates/*.json`) frozen. The template engine copies these as-is. They reference standard section names (e.g. `hero-banner`, `header`), which Shopify resolves correctly because the selectable files overwrite the section names in the Shopify themes folder.

---

## 2. Canonical Section Schemas

For the generation engine to write settings programmatically (like updating hero headings or collection assignments), every niche variant of a section MUST conform exactly to the identical schema IDs and setting types defined below.

### 2.1 announcement-bar
Provides a simple promo strip at the very top of the page.
- **Settings:**
  - `text` (`text`): Promotional announcement message. Default: `"Free shipping on orders over $50"`.
  - `link` (`url`): Optional redirection URL.
  - `show_countdown` (`checkbox`): Show countdown timer if enabled.
  - `countdown_date` (`text`): End date in ISO-8601 format (e.g. `"2026-12-31T23:59:59Z"`).

### 2.2 header
Main navigation layout and controls.
- **Settings:**
  - `menu` (`link_list`): Shopify Link List menu. Default: `"main-menu"`.
  - `show_search` (`checkbox`): Show predictive search input trigger. Default: `true`.
  - `show_account` (`checkbox`): Show customer account link if shop accounts are enabled. Default: `true`.

### 2.3 hero-banner
Large intro section for brand positioning.
- **Settings:**
  - `image` (`image_picker`): Desktop main banner image.
  - `heading` (`text`): Primary title text.
  - `subheading` (`text`): Accent description text.
  - `button_label` (`text`): Text label of primary call-to-action button.
  - `button_link` (`url`): Redirection link of primary CTA.
  - `video_url` (`video_url`): Optional streaming video background URL.
  - `show_video` (`checkbox`): Activates video background wrapper instead of static image. Default: `false`.

### 2.4 featured-collection
Renders a grid of products from a chosen collection.
- **Settings:**
  - `title` (`text`): Title banner text. Default: `"Featured Products"`.
  - `collection` (`collection`): Selected collection to pull items from.
  - `products_to_show` (`range`): Number of cards to load (min: 2, max: 12, step: 1). Default: `4`.
  - `columns_desktop` (`range`): Responsive grid columns (min: 2, max: 4, step: 1). Default: `4`.
  - `show_secondary_image` (`checkbox`): Toggles second product image swap on hover. Default: `true`.
  - `show_vendor` (`checkbox`): Render vendor text above titles. Default: `false`.

### 2.5 image-with-text
Split story section matching lifestyle text with visual content.
- **Settings:**
  - `image` (`image_picker`): Brand photography file.
  - `layout` (`select`): Image alignment, options:
    - `image_first` (Image on the left, text on the right)
    - `text_first` (Text on the left, image on the right)
    - Default: `"image_first"`
  - `heading` (`text`): Sub-story main title.
  - `text` (`richtext`): Detailed brand description paragraphs.
  - `button_label` (`text`): Text label of secondary CTA button.
  - `button_link` (`url`): Redirection URL.

### 2.6 testimonials
Merchant-configurable review sliders.
- **Settings:**
  - `title` (`text`): Section header. Default: `"What our customers say"`.
- **Blocks:**
  - `testimonial` (Allows multiple blocks):
    - Settings:
      - `author` (`text`): Customer/author name.
      - `quote` (`richtext`): Review body text.
      - `rating` (`range`): Star count (min: 1, max: 5, step: 1). Default: `5`.

### 2.7 newsletter
Shopify customer sign-up module.
- **Settings:**
  - `heading` (`text`): Subscription title text. Default: `"Subscribe to our newsletter"`.
  - `subtext` (`richtext`): Marketing permissions note.

### 2.8 main-product (Product Detail Page)
Standardized PDP components container.
- **Settings:**
  - `enable_sticky_info` (`checkbox`): Keep variant selections and buy-box sticky on scroll. Default: `true`.
  - `enable_image_zoom` (`checkbox`): Allows hover modal magnification on product gallery. Default: `true`.
- **Blocks:**
  - `title` (Product title header)
  - `price` (Price snippet display)
  - `variant_picker` (Variant options list utilizing `variant-swap.js` customs)
  - `quantity_selector` (Increment steppers)
  - `buy_buttons` (Add to Cart + dynamic checkout payment buttons)
  - `description` (Product description text accordion)
  - `trust_badges` (Static visual Trust Badges matrix settings)

### 2.9 main-collection
Standardized grid listing for collection pages.
- **Settings:**
  - `products_per_page` (`range`): (min: 8, max: 32, step: 4). Default: `16`.
  - `enable_filtering` (`checkbox`): Show sidebar dynamic filters. Default: `true`.
  - `enable_sorting` (`checkbox`): Show Sort By dropdown. Default: `true`.

### 2.10 footer
Footer navigation columns and social badges.
- **Settings:**
  - `show_payment_methods` (`checkbox`): Render payment partner SVG badges. Default: `true`.
- **Blocks:**
  - `link_list`:
    - Settings:
      - `heading` (`text`): Column linklist header.
      - `menu` (`link_list`): Main Shopify menu references.
  - `text`:
    - Settings:
      - `heading` (`text`): Column title.
      - `subtext` (`richtext`): Store description.
  - `newsletter`:
    - Settings:
      - `heading` (`text`): Newsletter title.

### 2.11 spin-wheel-popup
Exit-intent or timed gamified promo popups.
- **Settings:**
  - `title` (`text`): Gamified popup title. Default: `"Spin to Win!"`.
  - `subheading` (`text`): Popup text.
  - `exit_intent_only` (`checkbox`): Only trigger popup when pointer leaves boundary. Default: `true`.
  - `delay_seconds` (`range`): Seconds to wait before prompt if exit intent is disabled (min: 2, max: 30). Default: `5`.
- **Blocks:**
  - `segment` (Exactly 8 blocks expected):
    - Settings:
      - `label` (`text`): Segment label (e.g. `"10% Off"`).
      - `discount_code` (`text`): Active discount code.
      - `win_chance` (`number`): Weighted win probability.

### 2.12 bundle-builder
Displays complementary products that can be bundled together.
- **Settings:**
  - `title` (`text`): Headline text. Default: `"Frequently Bought Together"`.
  - `discount_percentage` (`number`): Percentage discount applied when all selected. Default: `15`.
- **Blocks:**
  - `product` (Up to 3 blocks):
    - Settings:
      - `product` (`product`): Product select picker.

---

## 3. Snippet Properties

### 3.1 product-card
- Expects a `product` Liquid object parameter.
- MUST parse rating stars using `icon-star` snippets.
- MUST handle wishlist local storage status checks with `.js-wishlist-toggle` query hooks.
- Hover action swaps from `product.featured_image` to `product.images[1]` if `settings.product_card_swap_image_on_hover` settings value maps to `true`.
