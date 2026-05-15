/**
 * ConvertFlow — Complete Shopify Theme Generator
 * Run: node generate-theme.mjs
 * Generates all theme-base files + 25 niche settings_data.json files
 */
import fs from 'fs';
import path from 'path';

const BASE = 'i:/converflow app/convertkit-convertflow/theme-base';
const NICHES_DIR = 'i:/converflow app/convertkit-convertflow/theme-niches';

const write = (rel, content) => {
  const full = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('wrote: ' + rel);
};

const writeNiche = (niche, rel, content) => {
  const full = path.join(NICHES_DIR, niche, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
};

// ─── TEMPLATES ───────────────────────────────────────────────────────────────
const makeTemplate = (sections, order) => JSON.stringify({ layout: 'theme', sections, order }, null, 2);

const tmpl = (sectionId, sectionType, extra = {}) => ({
  sections: { [sectionId]: { type: sectionType, settings: {}, ...extra } },
  order: [sectionId]
});

write('templates/index.json', makeTemplate({
  'announcement': { type: 'announcement-bar', settings: {} },
  'hero': { type: 'hero-slideshow', settings: {} },
  'featured-collections': { type: 'featured-collections', settings: {} },
  'featured-products': { type: 'featured-products', settings: {} },
  'promo-tiles': { type: 'promo-tiles', settings: {} },
  'testimonials': { type: 'testimonials', settings: {} },
  'logo-list': { type: 'logo-list', settings: {} },
  'countdown': { type: 'countdown-timer', settings: {} },
  'email-signup': { type: 'email-signup', settings: {} }
}, ['hero','featured-collections','featured-products','promo-tiles','testimonials','logo-list','countdown','email-signup']));

write('templates/product.json', makeTemplate({
  'product-main': { type: 'product-main', settings: {} },
  'product-tabs': { type: 'product-tabs', settings: {} },
  'product-recommendations': { type: 'product-recommendations', settings: {} },
  'recently-viewed': { type: 'recently-viewed', settings: {} }
}, ['product-main','product-tabs','product-recommendations','recently-viewed']));

write('templates/collection.json', makeTemplate({
  'collection-banner': { type: 'collection-banner', settings: {} },
  'collection-main': { type: 'collection-main', settings: {} }
}, ['collection-banner','collection-main']));

write('templates/cart.json', makeTemplate({
  'cart-main': { type: 'cart-main', settings: {} }
}, ['cart-main']));

write('templates/page.json', makeTemplate({ 'page-main': { type: 'page-main', settings: {} } }, ['page-main']));
write('templates/page.contact.json', makeTemplate({ 'contact-form': { type: 'contact-form', settings: {} } }, ['contact-form']));
write('templates/page.faq.json', makeTemplate({ 'faq': { type: 'collapsible-content', settings: {} } }, ['faq']));
write('templates/404.json', makeTemplate({ '404-main': { type: 'not-found-main', settings: {} } }, ['404-main']));
write('templates/blog.json', makeTemplate({ 'blog-posts': { type: 'blog-posts', settings: {} } }, ['blog-posts']));
write('templates/article.json', makeTemplate({ 'article-main': { type: 'article-main', settings: {} } }, ['article-main']));
write('templates/search.json', makeTemplate({ 'search-main': { type: 'search-main', settings: {} } }, ['search-main']));
write('templates/password.json', makeTemplate({ 'password-main': { type: 'password-main', settings: {} } }, ['password-main']));
write('templates/customers/login.json', makeTemplate({ 'login': { type: 'login-main', settings: {} } }, ['login']));
write('templates/customers/register.json', makeTemplate({ 'register': { type: 'register-main', settings: {} } }, ['register']));
write('templates/customers/account.json', makeTemplate({ 'account': { type: 'account-main', settings: {} } }, ['account']));
write('templates/customers/order.json', makeTemplate({ 'order': { type: 'account-main', settings: {} } }, ['order']));
write('templates/customers/addresses.json', makeTemplate({ 'addresses': { type: 'account-main', settings: {} } }, ['addresses']));
write('templates/customers/reset_password.json', makeTemplate({ 'reset': { type: 'login-main', settings: {} } }, ['reset']));
write('templates/customers/activate_account.json', makeTemplate({ 'activate': { type: 'login-main', settings: {} } }, ['activate']));

// ─── GIFT CARD ────────────────────────────────────────────────────────────────
write('templates/gift_card.liquid', `{% layout 'gift_card' %}
<div class="gift-card-page">
  <div class="gift-card-page__inner">
    <h1>{{ gift_card.initial_value | money }} Gift Card</h1>
    <img src="{{ gift_card | img_url: 'large' }}" alt="Gift card">
    <p class="gift-card__code">{{ gift_card.code | format_code }}</p>
    {% unless gift_card.enabled %}<p>This gift card has been disabled.</p>{% endunless %}
    {% if gift_card.expired %}<p>This gift card expired on {{ gift_card.expires_on | date: '%B %d, %Y' }}.</p>{% endif %}
    <p>Remaining balance: {{ gift_card.balance | money }}</p>
    <a href="{{ shop.url }}">Continue Shopping</a>
  </div>
</div>`);

// ─── GIFT CARD LAYOUT ─────────────────────────────────────────────────────────
write('../layout/gift_card.liquid', `<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Gift Card – {{ shop.name }}</title>
  {{ content_for_header }}
  {{ 'theme.css' | asset_url | stylesheet_tag }}
</head>
<body>{{ content_for_layout }}</body>
</html>`);

// ─── SETTINGS SCHEMA ─────────────────────────────────────────────────────────
write('config/settings_schema.json', JSON.stringify([
  {
    name: "theme_info",
    theme_name: "ConvertFlow Theme",
    theme_version: "1.0.0",
    theme_author: "ConvertFlow",
    theme_documentation_url: "https://convertflow.app",
    theme_support_url: "https://convertflow.app/support"
  },
  {
    name: "Colors",
    settings: [
      { type: "color", id: "color_accent", label: "Accent / Brand Color", default: "#2563EB" },
      { type: "color", id: "color_accent_text", label: "Accent Text Color", default: "#ffffff" },
      { type: "color", id: "color_bg", label: "Page Background", default: "#ffffff" },
      { type: "color", id: "color_text", label: "Body Text", default: "#111111" },
      { type: "color", id: "color_subtle", label: "Subtle / Muted Text", default: "#6b7280" },
      { type: "color", id: "color_border", label: "Border Color", default: "#e5e7eb" },
      { type: "color", id: "color_header_bg", label: "Header Background", default: "#ffffff" },
      { type: "color", id: "color_header_text", label: "Header Text", default: "#111111" },
      { type: "color", id: "color_footer_bg", label: "Footer Background", default: "#111111" },
      { type: "color", id: "color_footer_text", label: "Footer Text", default: "#ffffff" }
    ]
  },
  {
    name: "Typography",
    settings: [
      { type: "font_picker", id: "font_heading", label: "Heading Font", default: "playfair_display_n4" },
      { type: "font_picker", id: "font_body", label: "Body Font", default: "inter_n4" },
      { type: "range", id: "font_size_base", label: "Base Font Size (px)", min: 13, max: 18, step: 1, default: 15 },
      { type: "range", id: "font_size_heading", label: "Heading Scale", min: 100, max: 160, step: 5, unit: "%", default: 130 }
    ]
  },
  {
    name: "Layout",
    settings: [
      { type: "range", id: "page_width", label: "Max Page Width (px)", min: 1000, max: 1600, step: 40, default: 1280 },
      { type: "range", id: "grid_gap", label: "Section Spacing (px)", min: 20, max: 80, step: 4, default: 40 },
      { type: "select", id: "card_style", label: "Product Card Style",
        options: [
          { value: "standard", label: "Standard" },
          { value: "border", label: "Bordered" },
          { value: "shadow", label: "Shadow" }
        ], default: "standard" },
      { type: "range", id: "card_border_radius", label: "Card Border Radius (px)", min: 0, max: 24, step: 2, default: 8 }
    ]
  },
  {
    name: "Header",
    settings: [
      { type: "image_picker", id: "logo", label: "Logo" },
      { type: "range", id: "logo_width", label: "Logo Width (px)", min: 60, max: 300, step: 10, default: 140 },
      { type: "checkbox", id: "sticky_header", label: "Sticky Header", default: true },
      { type: "checkbox", id: "enable_search", label: "Enable Search", default: true },
      { type: "select", id: "menu_type", label: "Menu Type",
        options: [{ value: "standard", label: "Standard" }, { value: "mega", label: "Mega Menu" }],
        default: "mega" }
    ]
  },
  {
    name: "Cart",
    settings: [
      { type: "select", id: "cart_type", label: "Cart Type",
        options: [
          { value: "drawer", label: "Slide-out Drawer" },
          { value: "page", label: "Cart Page" },
          { value: "notification", label: "Notification" }
        ], default: "drawer" },
      { type: "checkbox", id: "enable_slide_cart", label: "Enable Slide-out Cart", default: true },
      { type: "checkbox", id: "cart_notes", label: "Enable Cart Notes", default: true },
      { type: "checkbox", id: "gift_wrapping", label: "Enable Gift Wrapping", default: false },
      { type: "checkbox", id: "cart_upsell", label: "Show Upsell in Cart", default: true }
    ]
  },
  {
    name: "Product Page",
    settings: [
      { type: "checkbox", id: "enable_quick_view", label: "Enable Quick View", default: true },
      { type: "checkbox", id: "sticky_atc", label: "Sticky Add-to-Cart Bar", default: true },
      { type: "checkbox", id: "enable_image_zoom", label: "Enable Image Zoom", default: true },
      { type: "checkbox", id: "show_stock_counter", label: "Show Stock Counter", default: true },
      { type: "number", id: "stock_threshold", label: "Low Stock Warning Threshold", default: 10 },
      { type: "checkbox", id: "show_sku", label: "Show SKU", default: false },
      { type: "checkbox", id: "show_vendor", label: "Show Vendor", default: true },
      { type: "checkbox", id: "show_share_buttons", label: "Show Share Buttons", default: true }
    ]
  },
  {
    name: "Collection Page",
    settings: [
      { type: "checkbox", id: "enable_filtering", label: "Enable Filtering", default: true },
      { type: "checkbox", id: "enable_sorting", label: "Enable Sorting", default: true },
      { type: "checkbox", id: "enable_infinite_scroll", label: "Infinite Scroll", default: false },
      { type: "range", id: "products_per_page", label: "Products Per Page", min: 8, max: 48, step: 4, default: 24 },
      { type: "select", id: "default_columns", label: "Default Grid Columns",
        options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }],
        default: "4" }
    ]
  },
  {
    name: "Announcements",
    settings: [
      { type: "checkbox", id: "show_announcement_bar", label: "Show Announcement Bar", default: true }
    ]
  },
  {
    name: "Popups",
    settings: [
      { type: "checkbox", id: "enable_promo_popup", label: "Enable Promo Popup", default: false },
      { type: "checkbox", id: "enable_age_verifier", label: "Enable Age Verifier", default: false },
      { type: "number", id: "age_minimum", label: "Minimum Age", default: 18 }
    ]
  },
  {
    name: "Accessibility & UX",
    settings: [
      { type: "checkbox", id: "show_back_to_top", label: "Show Back-to-Top Button", default: true },
      { type: "checkbox", id: "enable_animations", label: "Enable Animations", default: true },
      { type: "select", id: "text_direction", label: "Text Direction",
        options: [{ value: "ltr", label: "Left to Right" }, { value: "rtl", label: "Right to Left" }],
        default: "ltr" }
    ]
  },
  {
    name: "Social Media",
    settings: [
      { type: "text", id: "social_instagram", label: "Instagram URL" },
      { type: "text", id: "social_facebook", label: "Facebook URL" },
      { type: "text", id: "social_twitter", label: "Twitter / X URL" },
      { type: "text", id: "social_youtube", label: "YouTube URL" },
      { type: "text", id: "social_pinterest", label: "Pinterest URL" }
    ]
  },
  {
    name: "Advanced",
    settings: [
      { type: "image_picker", id: "favicon", label: "Favicon" },
      { type: "textarea", id: "custom_css", label: "Custom CSS" },
      { type: "textarea", id: "custom_js", label: "Custom JavaScript" }
    ]
  }
], null, 2));

// ─── DEFAULT SETTINGS DATA ───────────────────────────────────────────────────
write('config/settings_data.json', JSON.stringify({
  current: {
    color_accent: "#2563EB",
    color_accent_text: "#ffffff",
    color_bg: "#ffffff",
    color_text: "#111111",
    color_subtle: "#6b7280",
    color_border: "#e5e7eb",
    color_header_bg: "#ffffff",
    color_header_text: "#111111",
    color_footer_bg: "#111111",
    color_footer_text: "#ffffff",
    font_heading: "playfair_display_n4",
    font_body: "inter_n4",
    font_size_base: 15,
    font_size_heading: 130,
    page_width: 1280,
    grid_gap: 40,
    card_style: "standard",
    card_border_radius: 8,
    sticky_header: true,
    enable_search: true,
    menu_type: "mega",
    cart_type: "drawer",
    enable_slide_cart: true,
    cart_notes: true,
    gift_wrapping: false,
    cart_upsell: true,
    enable_quick_view: true,
    sticky_atc: true,
    enable_image_zoom: true,
    show_stock_counter: true,
    stock_threshold: 10,
    show_vendor: true,
    show_share_buttons: true,
    enable_filtering: true,
    enable_sorting: true,
    enable_infinite_scroll: false,
    products_per_page: 24,
    default_columns: "4",
    show_announcement_bar: true,
    enable_promo_popup: false,
    enable_age_verifier: false,
    age_minimum: 18,
    show_back_to_top: true,
    enable_animations: true,
    text_direction: "ltr"
  },
  presets: {}
}, null, 2));

// ─── LOCALES ─────────────────────────────────────────────────────────────────
const en = {
  general: { search: { placeholder: "Search products...", title: "Search" }, password: { login_form: { title: "Enter store using password" } } },
  accessibility: { skip_to_content: "Skip to content", close: "Close", back_to_top: "Back to top", next_slide: "Next slide", prev_slide: "Previous slide" },
  products: { product: { add_to_cart: "Add to Cart", sold_out: "Sold Out", unavailable: "Unavailable", quantity: "Quantity", sku: "SKU", vendor: "Vendor", sale_badge: "Sale", new_badge: "New", in_stock: "In Stock", low_stock: "Only {{ count }} left!", quick_view: "Quick View", choose_option: "Choose {{ option }}" }, general: { columns_grid: "Grid", columns_list: "List" } },
  cart: { general: { title: "Your Cart", empty: "Your cart is empty", subtotal: "Subtotal", checkout: "Checkout", continue_shopping: "Continue Shopping", remove: "Remove", cart_note: "Order note", gift_wrapping: "Gift wrapping" }, count_items: { one: "{{ count }} item", other: "{{ count }} items" } },
  collections: { general: { filter_and_sort: "Filter & Sort", sort_by: "Sort by", clear_filters: "Clear All", results_count: { one: "{{ count }} product", other: "{{ count }} products" } }, sorting: { manual: "Featured", best_selling: "Best Selling", title_ascending: "A-Z", title_descending: "Z-A", price_ascending: "Price: Low to High", price_descending: "Price: High to Low", created_descending: "Newest", created_ascending: "Oldest" } },
  footer: { newsletter: { label: "Email address", button: "Subscribe", success: "Thanks for subscribing!" } },
  customer: { login: { title: "Login", submit: "Sign In", forgot_password: "Forgot password?" }, register: { title: "Create Account", submit: "Create Account" }, account: { title: "My Account", orders: "Order History", details: "Account Details" }, addresses: { title: "Addresses", add_new: "Add New Address" } }
};
write('locales/en.default.json', JSON.stringify(en, null, 2));

// Simple FR translation
const fr = { general: { search: { placeholder: "Rechercher...", title: "Recherche" } }, accessibility: { skip_to_content: "Passer au contenu", close: "Fermer", back_to_top: "Haut de page" }, products: { product: { add_to_cart: "Ajouter au panier", sold_out: "Épuisé", unavailable: "Indisponible", sale_badge: "Promo" } }, cart: { general: { title: "Votre panier", empty: "Votre panier est vide", subtotal: "Sous-total", checkout: "Commander" } } };
write('locales/fr.json', JSON.stringify(fr, null, 2));

const de = { general: { search: { placeholder: "Suchen...", title: "Suche" } }, products: { product: { add_to_cart: "In den Warenkorb", sold_out: "Ausverkauft", sale_badge: "Sale" } }, cart: { general: { title: "Warenkorb", empty: "Ihr Warenkorb ist leer", checkout: "Zur Kasse" } } };
write('locales/de.json', JSON.stringify(de, null, 2));

const it = { general: { search: { placeholder: "Cerca...", title: "Ricerca" } }, products: { product: { add_to_cart: "Aggiungi al carrello", sold_out: "Esaurito", sale_badge: "Offerta" } }, cart: { general: { title: "Carrello", empty: "Il tuo carrello è vuoto", checkout: "Acquista" } } };
write('locales/it.json', JSON.stringify(it, null, 2));

const es = { general: { search: { placeholder: "Buscar...", title: "Búsqueda" } }, products: { product: { add_to_cart: "Añadir al carrito", sold_out: "Agotado", sale_badge: "Oferta" } }, cart: { general: { title: "Tu carrito", empty: "Tu carrito está vacío", checkout: "Pagar" } } };
write('locales/es.json', JSON.stringify(es, null, 2));

const ar = { general: { search: { placeholder: "بحث...", title: "بحث" } }, products: { product: { add_to_cart: "أضف إلى السلة", sold_out: "نفدت الكمية", sale_badge: "تخفيض" } }, cart: { general: { title: "سلة التسوق", empty: "سلتك فارغة", checkout: "الدفع" } } };
write('locales/ar.json', JSON.stringify(ar, null, 2));

console.log('\n✅ All template/config/locale files generated!');
