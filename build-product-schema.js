// Part 1: Product Schema
export function productSchema(tpl) {
  return JSON.stringify({
    name: `CF ${tpl.label} PDP`.substring(0, 25),
    settings: [
      { type: "header", content: "Brand Colors" },
      { type: "color", id: "color_accent", label: "Accent Color", default: tpl.accent },
      { type: "color", id: "color_bg", label: "Page Background", default: tpl.bg },
      { type: "color", id: "color_text", label: "Text Color", default: "#1a1a1a" },
      { type: "header", content: "Product Display" },
      { type: "checkbox", id: "show_breadcrumb", label: "Show Breadcrumb", default: true },
      { type: "checkbox", id: "show_vendor", label: "Show Vendor Name", default: true },
      { type: "checkbox", id: "show_rating", label: "Show Star Rating", default: true },
      { type: "text", id: "review_count", label: "Review Count Display", default: "2,148 reviews" },
      { type: "checkbox", id: "show_wishlist", label: "Show Wishlist Button", default: true },
      { type: "header", content: "Buttons" },
      { type: "text", id: "atc_text", label: "Add to Cart Text", default: "Add to Cart" },
      { type: "checkbox", id: "show_buy_now", label: "Show Buy Now Button", default: true },
      { type: "text", id: "buy_now_text", label: "Buy Now Text", default: "Buy Now" },
      { type: "header", content: "Trust Badges" },
      { type: "text", id: "trust_1", label: "Badge 1", default: "Authentic & Certified" },
      { type: "text", id: "trust_2", label: "Badge 2", default: "Free Delivery" },
      { type: "text", id: "trust_3", label: "Badge 3", default: "Easy 30-Day Returns" },
      { type: "text", id: "trust_4", label: "Badge 4", default: "Secure Checkout" },
      { type: "header", content: "Related Products" },
      { type: "checkbox", id: "show_related", label: "Show Related Products", default: true },
      { type: "text", id: "related_heading", label: "Section Heading", default: "You May Also Like" },
      { type: "collection", id: "related_collection", label: "Related Products Collection" },
      { type: "range", id: "related_count", label: "Number of Products", min: 2, max: 8, step: 2, default: 4 }
    ],
    presets: [{ name: `CF ${tpl.label} PDP`.substring(0, 25) }]
  }, null, 2);
}
