/**
 * ConvertFlow — Full Theme Generator
 * Generates complete theme-base with rich demo content in settings_data.json
 * and properly structured index.json / product.json / collection.json
 * Run: node generate-full-theme.mjs
 */
import fs from 'fs';
import path from 'path';

const BASE = 'i:/converflow app/convertkit-convertflow/theme-base';

function write(rel, content) {
  const full = path.join(BASE, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('  wrote:', rel);
}

// ─── 1. COMPLETE settings_data.json with rich defaults ───────────────────────
write('config/settings_data.json', JSON.stringify({
  current: {
    color_accent: "#1a1a2e",
    color_accent_text: "#ffffff",
    color_bg: "#ffffff",
    color_text: "#0f0f0f",
    color_subtle: "#6b7280",
    color_border: "#e5e7eb",
    color_header_bg: "#ffffff",
    color_header_text: "#0f0f0f",
    color_footer_bg: "#0f0f0f",
    color_footer_text: "#f5f5f5",
    font_heading: "playfair_display_n4",
    font_body: "inter_n4",
    font_size_base: 15,
    font_size_heading: 130,
    page_width: 1280,
    grid_gap: 40,
    card_style: "shadow",
    card_border_radius: 10,
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
    show_sku: false,
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

// ─── 2. index.json — Home page with rich sections and demo blocks ─────────────
write('templates/index.json', JSON.stringify({
  sections: {
    "announcement": {
      type: "announcement-bar",
      settings: {
        announcement_text: "🎉 Free shipping on orders over ₹999 · Use code WELCOME10 for 10% off",
        bg_color: "#1a1a2e",
        text_color: "#ffffff",
        show_close: true
      }
    },
    "hero": {
      type: "hero-slideshow",
      blocks: {
        "slide1": {
          type: "slide",
          settings: {
            heading: "Discover Your Style",
            subheading: "Shop the latest collections crafted for modern living",
            cta_label: "Shop Now",
            cta_url: "/collections/all",
            cta_label_2: "Learn More",
            cta_url_2: "/pages/about",
            overlay_opacity: 50,
            text_color: "#ffffff",
            text_align: "center"
          }
        }
      },
      block_order: ["slide1"],
      settings: {
        height: 85,
        autoplay_speed: 5
      }
    },
    "featured-cols": {
      type: "featured-collections",
      blocks: {},
      block_order: [],
      settings: {
        eyebrow: "Browse by Category",
        title: "Shop Our Collections",
        subtitle: "Explore our curated selection of premium products"
      }
    },
    "featured-prods": {
      type: "featured-products",
      settings: {
        eyebrow: "Staff Picks",
        title: "Bestselling Products",
        products_count: 8,
        cta_label: "View All Products",
        cta_url: "/collections/all"
      }
    },
    "promo-band": {
      type: "promo-tiles",
      blocks: {
        "t1": { type: "tile", settings: { icon: "🚚", title: "Free Shipping", text: "On all orders above ₹999 across India" } },
        "t2": { type: "tile", settings: { icon: "↩️", title: "Easy Returns", text: "30-day hassle-free returns on all orders" } },
        "t3": { type: "tile", settings: { icon: "🔒", title: "Secure Payment", text: "100% secure checkout with 256-bit SSL" } },
        "t4": { type: "tile", settings: { icon: "💬", title: "24/7 Support", text: "Talk to our team anytime, we're here" } }
      },
      block_order: ["t1","t2","t3","t4"],
      settings: {}
    },
    "countdown": {
      type: "countdown-timer",
      settings: {
        title: "Flash Sale Ends In",
        subtitle: "Up to 50% off on selected items — don't miss out!",
        end_date: "2026-12-31",
        end_time: "23:59",
        cta_label: "Shop the Sale",
        cta_url: "/collections/sale"
      }
    },
    "testimonials": {
      type: "testimonials",
      blocks: {
        "r1": { type: "testimonial", settings: { rating: 5, quote: "Absolutely love the quality. The fabric is premium and the fit is perfect. Will definitely order again!", name: "Priya S.", location: "Mumbai, India" } },
        "r2": { type: "testimonial", settings: { rating: 5, quote: "Super fast delivery and beautiful packaging. The product exceeded my expectations. Highly recommend!", name: "Arjun M.", location: "Bangalore, India" } },
        "r3": { type: "testimonial", settings: { rating: 5, quote: "Best purchase I've made this year. The customer support was also incredible when I had a question.", name: "Deepa K.", location: "Delhi, India" } }
      },
      block_order: ["r1","r2","r3"],
      settings: {
        title: "Loved by 10,000+ Customers",
        subtitle: "Don't just take our word for it"
      }
    },
    "logo-bar": {
      type: "logo-list",
      blocks: {},
      block_order: [],
      settings: { title: "As Featured In" }
    },
    "newsletter": {
      type: "email-signup",
      settings: {
        title: "Join Our Community",
        text: "Subscribe for exclusive deals, new arrivals, and style inspiration delivered to your inbox.",
        placeholder: "Your email address",
        btn: "Subscribe"
      }
    }
  },
  order: ["announcement","hero","featured-cols","featured-prods","promo-band","countdown","testimonials","logo-bar","newsletter"]
}, null, 2));

// ─── 3. product.json — Full PDP layout ───────────────────────────────────────
write('templates/product.json', JSON.stringify({
  sections: {
    "main": {
      type: "product-main",
      settings: {
        show_vendor: true,
        show_sku: false,
        show_stock: true,
        stock_threshold: 10,
        show_trust_badges: true,
        show_share: true,
        gallery_style: "thumbnails",
        enable_zoom: true
      }
    },
    "tabs": {
      type: "product-tabs",
      blocks: {
        "tab1": { type: "tab", settings: { tab_label: "Description", tab_content: "<p>This product features premium quality materials and expert craftsmanship. Designed for durability and style, it's built to last.</p>" } },
        "tab2": { type: "tab", settings: { tab_label: "Shipping & Returns", tab_content: "<p><strong>Shipping:</strong> Free on orders over ₹999. Standard delivery 3-5 business days.</p><p><strong>Returns:</strong> Easy 30-day returns. No questions asked.</p>" } },
        "tab3": { type: "tab", settings: { tab_label: "Care Instructions", tab_content: "<p>Hand wash or machine wash cold. Do not bleach. Hang to dry. Do not iron directly on print.</p>" } }
      },
      block_order: ["tab1","tab2","tab3"],
      settings: { tabs_heading: "Product Information" }
    },
    "recommendations": {
      type: "product-recommendations",
      settings: { title: "You May Also Like", products_count: 4 }
    },
    "recently": {
      type: "recently-viewed",
      settings: { title: "Recently Viewed", products_count: 4 }
    }
  },
  order: ["main","tabs","recommendations","recently"]
}, null, 2));

// ─── 4. collection.json ───────────────────────────────────────────────────────
write('templates/collection.json', JSON.stringify({
  sections: {
    "banner": {
      type: "collection-banner",
      settings: {}
    },
    "main": {
      type: "collection-main",
      settings: {
        products_per_page: 24,
        columns_desktop: 4,
        columns_mobile: 2,
        enable_filtering: true,
        enable_sorting: true,
        show_product_count: true
      }
    }
  },
  order: ["banner","main"]
}, null, 2));

// ─── 5. cart.json ────────────────────────────────────────────────────────────
write('templates/cart.json', JSON.stringify({
  sections: {
    "main": {
      type: "cart-main",
      settings: { show_note: true, show_gift: false }
    }
  },
  order: ["main"]
}, null, 2));

// ─── 6. Remaining templates ───────────────────────────────────────────────────
write('templates/404.json', JSON.stringify({ sections: { "main": { type: "not-found-main", settings: {} } }, order: ["main"] }, null, 2));
write('templates/article.json', JSON.stringify({ sections: { "main": { type: "article-main", settings: {} } }, order: ["main"] }, null, 2));
write('templates/blog.json', JSON.stringify({ sections: { "main": { type: "blog-posts", settings: { posts_per_page: 9 } } }, order: ["main"] }, null, 2));
write('templates/page.json', JSON.stringify({ sections: { "main": { type: "page-main", settings: {} } }, order: ["main"] }, null, 2));
write('templates/page.contact.json', JSON.stringify({ sections: { "main": { type: "contact-form", settings: {} } }, order: ["main"] }, null, 2));
write('templates/page.faq.json', JSON.stringify({
  sections: {
    "main": {
      type: "collapsible-content",
      blocks: {
        "q1": { type: "faq_item", settings: { question: "What is your return policy?", answer: "We offer 30-day hassle-free returns on all products." } },
        "q2": { type: "faq_item", settings: { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Free on orders over ₹999." } },
        "q3": { type: "faq_item", settings: { question: "Do you ship internationally?", answer: "Yes, we ship to 50+ countries worldwide." } },
        "q4": { type: "faq_item", settings: { question: "How can I track my order?", answer: "You'll receive a tracking link via email once your order ships." } }
      },
      block_order: ["q1","q2","q3","q4"],
      settings: {}
    }
  },
  order: ["main"]
}, null, 2));
write('templates/search.json', JSON.stringify({ sections: { "main": { type: "search-main", settings: {} } }, order: ["main"] }, null, 2));
write('templates/password.json', JSON.stringify({ sections: { "main": { type: "password-main", settings: {} } }, order: ["main"] }, null, 2));

// ─── 7. gift_card.liquid ─────────────────────────────────────────────────────
write('templates/gift_card.liquid', `<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Gift Card — {{ shop.name }}</title>
  {%- render 'css-variables' -%}
  {{ 'theme.css' | asset_url | stylesheet_tag }}
</head>
<body style="background:var(--c-bg);color:var(--c-text);font-family:var(--f-body);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px">
  <div style="text-align:center;max-width:480px;width:100%">
    <a href="/" style="font-family:var(--f-heading);font-size:24px;font-weight:700;display:block;margin-bottom:32px">{{ shop.name }}</a>
    <div style="background:linear-gradient(135deg,var(--c-accent),color-mix(in srgb,var(--c-accent) 60%,#000));border-radius:16px;padding:40px;margin-bottom:32px;color:#fff">
      <p style="font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;opacity:.7;margin-bottom:8px">Gift Card</p>
      <p style="font-family:var(--f-heading);font-size:48px;font-weight:700;margin-bottom:8px">{{ gift_card.initial_value | money_without_trailing_zeros }}</p>
      <p style="opacity:.7;font-size:14px">Balance: {{ gift_card.balance | money }}</p>
    </div>
    <p style="font-size:13px;color:var(--c-subtle);margin-bottom:16px">Gift card code</p>
    <div style="font-family:monospace;font-size:22px;font-weight:700;letter-spacing:4px;background:var(--c-border);padding:16px 24px;border-radius:8px;margin-bottom:24px">{{ gift_card.code | format_code }}</div>
    {%- if gift_card.expired or gift_card.enabled == false -%}
    <p style="color:#dc2626;font-weight:600">This gift card has expired or is disabled.</p>
    {%- else -%}
    <a href="{{ shop.url }}" class="btn-primary" style="display:inline-block;width:100%">Shop Now</a>
    {%- endif -%}
  </div>
</body>
</html>`);

// ─── 8. customers templates ───────────────────────────────────────────────────
const customerLayout = (title, content) => `{% layout 'theme' %}
<div class="page-width" style="padding:60px 20px 80px;max-width:560px;margin:0 auto">
  <h1 style="font-family:var(--f-heading);font-size:clamp(24px,4vw,36px);margin-bottom:32px">${title}</h1>
  ${content}
</div>`;

write('templates/customers/login.json', JSON.stringify({
  sections: { "main": { type: "customer-login", settings: {} } }, order: ["main"]
}, null, 2));

write('templates/customers/register.json', JSON.stringify({
  sections: { "main": { type: "customer-register", settings: {} } }, order: ["main"]
}, null, 2));

write('templates/customers/account.json', JSON.stringify({
  sections: { "main": { type: "customer-account", settings: {} } }, order: ["main"]
}, null, 2));

write('templates/customers/addresses.json', JSON.stringify({
  sections: { "main": { type: "customer-addresses", settings: {} } }, order: ["main"]
}, null, 2));

write('templates/customers/order.json', JSON.stringify({
  sections: { "main": { type: "customer-order", settings: {} } }, order: ["main"]
}, null, 2));

write('templates/customers/reset_password.json', JSON.stringify({
  sections: { "main": { type: "customer-reset-password", settings: {} } }, order: ["main"]
}, null, 2));

write('templates/customers/activate_account.json', JSON.stringify({
  sections: { "main": { type: "customer-activate-account", settings: {} } }, order: ["main"]
}, null, 2));

console.log('\n✅ Full theme scaffold generated!');
