# 03 PAGE INJECTION SYSTEM

The Page Injection System allows merchants to browse pre-built page templates and inject them directly into their Shopify store with one click. No manual section setup, no drag-and-drop, no coding. The page appears live in the store as a real Online Store 2.0 JSON template — fully editable in Theme Editor after injection.

## 3.1 — How Injection Works (8-Step Flow)
1. Fetch template JSON from `page_templates` table in MySQL database
2. Get merchant's active theme ID via Shopify Themes REST API
3. Detect theme type: Online Store 2.0 (JSON templates) vs Legacy (.liquid only)
4. Generate page handle (URL slug) from the page title
5. PUT template JSON to theme via Assets API: `templates/page.{handle}.json`
6. Create Shopify Page via Pages API with `template_suffix = handle`
7. Save InjectedPage record to MySQL (`merchantId`, `templateId`, `shopifyPageId`, `handle`)
8. Return live URL to merchant dashboard: `store.com/pages/{handle}`

*IMPORTANT: The injection creates a REAL Shopify Online Store 2.0 JSON template. The page is fully editable in the Shopify Theme Editor after injection. It is not a locked iframe or external page.*

## 3.2 — 64 Templates Matrix (8 Niches x 8 Page Types)
**Niches:** Jewellery, Grooming, Fashion, Beauty, Food, Home Decor, Fitness, Pets
**Page Types:** Homepage, Product Page (PDP), Collection Page, About / Brand, FAQ Page, Landing Page, Policy Pages, Niche-Specific (Authenticity Page, Bundle Deals Page, Lookbook Page, Transformation Gallery, Recipe / How-To Page, Room Inspiration, Workout Program, Breed Guide Pages)

## Theme Compatibility
- **Online Store 2.0 (Dawn, Craft)**: JSON files in `templates/`. JSON template + Assets API. Fully editable.
- **Custom 2.0 theme**: `templates/` has .json files. JSON template + Assets API. Editable.
- **Legacy theme (pre-2.0)**: `.liquid` files only. HTML `body_html` injection. Limited — text only.
- **Headless storefront**: No Online Store channel. Not supported — show warning.
