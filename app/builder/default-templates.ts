// app/builder/default-templates.ts
import type { Block, Section, PageSchema, ElementPaletteItem } from "./types";

export function generateId(prefix: string = "b"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export const DEFAULT_GLOBAL_STYLES = {
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  primaryColor: "#0f172a",
  accentColor: "#2563eb",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  maxWidth: "1200px",
  containerPadding: 24,
};

export const ELEMENT_PALETTE: ElementPaletteItem[] = [
  // Basic
  {
    type: "heading",
    title: "Heading",
    category: "basic",
    icon: "🔤",
    description: "H1-H6 page headline with custom typography",
    defaultBlock: () => ({
      id: generateId("head"),
      type: "heading",
      label: "Heading",
      settings: {
        text: "Transform Your Skin in 14 Days",
        tag: "h2",
      },
      styles: {
        fontSize: "32px",
        fontWeight: "700",
        lineHeight: "1.2",
        textAlign: "left",
        textColor: "#0f172a",
        marginTop: 0,
        marginBottom: 16,
      },
    }),
  },
  {
    type: "paragraph",
    title: "Text / Paragraph",
    category: "basic",
    icon: "📝",
    description: "Rich text description, lead paragraph, or caption",
    defaultBlock: () => ({
      id: generateId("para"),
      type: "paragraph",
      label: "Paragraph",
      settings: {
        text: "Dermatologist-tested, clean clinical formula made with cold-pressed botanical extracts. Experience real radiance without irritation.",
      },
      styles: {
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "1.6",
        textAlign: "left",
        textColor: "#475569",
        marginTop: 0,
        marginBottom: 20,
      },
    }),
  },
  {
    type: "button",
    title: "Call to Action Button",
    category: "basic",
    icon: "🔘",
    description: "Primary or secondary clickable button with link",
    defaultBlock: () => ({
      id: generateId("btn"),
      type: "button",
      label: "Button",
      settings: {
        text: "Claim 40% Off Today →",
        url: "#buy-now",
        style: "primary",
      },
      styles: {
        fontSize: "16px",
        fontWeight: "600",
        textAlign: "center",
        textColor: "#ffffff",
        backgroundColor: "#0284c7",
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 28,
        paddingRight: 28,
        borderRadius: 8,
        boxShadow: "md",
        marginTop: 8,
        marginBottom: 16,
      },
    }),
  },
  {
    type: "image",
    title: "Image",
    category: "basic",
    icon: "🖼️",
    description: "Responsive banner, lifestyle photo, or product badge",
    defaultBlock: () => ({
      id: generateId("img"),
      type: "image",
      label: "Image",
      settings: {
        src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
        alt: "Premium skincare product bottle",
        aspectRatio: "16/9",
      },
      styles: {
        borderRadius: 12,
        boxShadow: "sm",
        marginTop: 0,
        marginBottom: 20,
        width: "100%",
      },
    }),
  },
  {
    type: "video",
    title: "Video Player",
    category: "basic",
    icon: "🎬",
    description: "YouTube, Vimeo, or self-hosted MP4 showcase",
    defaultBlock: () => ({
      id: generateId("vid"),
      type: "video",
      label: "Video",
      settings: {
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        aspectRatio: "16/9",
      },
      styles: {
        borderRadius: 12,
        marginTop: 0,
        marginBottom: 20,
      },
    }),
  },
  {
    type: "divider",
    title: "Divider",
    category: "basic",
    icon: "➖",
    description: "Horizontal separator line",
    defaultBlock: () => ({
      id: generateId("div"),
      type: "divider",
      label: "Divider",
      settings: {
        thickness: 1,
      },
      styles: {
        borderColor: "#e2e8f0",
        borderStyle: "solid",
        marginTop: 24,
        marginBottom: 24,
      },
    }),
  },

  // Shopify Product Elements
  {
    type: "product_title",
    title: "Product Title",
    category: "product",
    icon: "🏷️",
    description: "Dynamic product title linked to Shopify catalog",
    defaultBlock: () => ({
      id: generateId("ptitle"),
      type: "product_title",
      label: "Product Title",
      settings: {
        text: "Radiance Dew Glow Elixir (50ml)",
        tag: "h1",
      },
      styles: {
        fontSize: "36px",
        fontWeight: "800",
        lineHeight: "1.15",
        textColor: "#0f172a",
        marginBottom: 12,
      },
    }),
  },
  {
    type: "product_price",
    title: "Product Price",
    category: "product",
    icon: "💰",
    description: "Current price, strike-through compare price & discount tag",
    defaultBlock: () => ({
      id: generateId("pprice"),
      type: "product_price",
      label: "Product Price",
      settings: {
        price: "₹1,499",
        comparePrice: "₹2,499",
        badgeText: "SAVE 40%",
      },
      styles: {
        fontSize: "24px",
        fontWeight: "700",
        textColor: "#0f172a",
        marginBottom: 16,
      },
    }),
  },
  {
    type: "product_gallery",
    title: "Product Image Gallery",
    category: "product",
    icon: "📸",
    description: "Interactive thumbnail gallery with zoom",
    defaultBlock: () => ({
      id: generateId("pgall"),
      type: "product_gallery",
      label: "Product Gallery",
      settings: {
        images: [
          "https://images.unsplash.com/photo-1608248597359-251f5e8b39aa?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
        ],
      },
      styles: {
        borderRadius: 12,
        marginBottom: 20,
      },
    }),
  },
  {
    type: "product_variants",
    title: "Variant Selector",
    category: "product",
    icon: "🎨",
    description: "Color swatches and size pill buttons",
    defaultBlock: () => ({
      id: generateId("pvars"),
      type: "product_variants",
      label: "Variant Selector",
      settings: {
        options: [
          { name: "Size", values: ["30ml (Trial)", "50ml (Most Popular)", "100ml (Value)"] },
        ],
      },
      styles: {
        marginBottom: 20,
      },
    }),
  },
  {
    type: "product_atc",
    title: "Add to Cart Button",
    category: "product",
    icon: "🛒",
    description: "1-Click Ajax Add-to-Cart button wired to cart drawer",
    defaultBlock: () => ({
      id: generateId("patc"),
      type: "product_atc",
      label: "Add to Cart",
      settings: {
        text: "ADD TO CART — ₹1,499",
        showQuantity: true,
      },
      styles: {
        fontSize: "18px",
        fontWeight: "700",
        textColor: "#ffffff",
        backgroundColor: "#0284c7",
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
        borderRadius: 8,
        width: "100%",
        marginBottom: 12,
      },
    }),
  },
  {
    type: "product_buynow",
    title: "Buy Now (Direct Checkout)",
    category: "product",
    icon: "⚡",
    description: "Skips cart and goes straight to Shopify Checkout",
    defaultBlock: () => ({
      id: generateId("pbuy"),
      type: "product_buynow",
      label: "Buy Now Button",
      settings: {
        text: "⚡ BUY NOW WITH CASH ON DELIVERY",
      },
      styles: {
        fontSize: "16px",
        fontWeight: "700",
        textColor: "#0f172a",
        backgroundColor: "#f59e0b",
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 24,
        paddingRight: 24,
        borderRadius: 8,
        width: "100%",
        marginBottom: 16,
      },
    }),
  },
  {
    type: "product_stock_urgency",
    title: "Stock Urgency Bar",
    category: "product",
    icon: "🔥",
    description: "Urgency progress bar showing limited stock remaining",
    defaultBlock: () => ({
      id: generateId("purg"),
      type: "product_stock_urgency",
      label: "Stock Urgency",
      settings: {
        text: "⚡ High Demand: Only 6 units left in stock at this price!",
        percentage: 84,
      },
      styles: {
        fontSize: "14px",
        fontWeight: "600",
        textColor: "#b91c1c",
        marginBottom: 16,
      },
    }),
  },
  {
    type: "product_rating",
    title: "Star Rating",
    category: "product",
    icon: "⭐",
    description: "Review stars badge with customer count",
    defaultBlock: () => ({
      id: generateId("prate"),
      type: "product_rating",
      label: "Star Rating",
      settings: {
        rating: 4.9,
        reviewsCount: 1842,
        verifiedText: "Verified Buyer Reviews",
      },
      styles: {
        fontSize: "14px",
        fontWeight: "600",
        textColor: "#d97706",
        marginBottom: 12,
      },
    }),
  },

  // CRO & Conversion Elements
  {
    type: "countdown_timer",
    title: "Urgency Countdown Timer",
    category: "cro",
    icon: "⏱️",
    description: "Live ticking clock for flash sales and limited deals",
    defaultBlock: () => ({
      id: generateId("time"),
      type: "countdown_timer",
      label: "Countdown Timer",
      settings: {
        title: "FLASH SALE ENDS IN:",
        hours: 3,
        minutes: 45,
        seconds: 20,
      },
      styles: {
        backgroundColor: "#fef2f2",
        borderColor: "#fecaca",
        borderWidth: 1,
        borderRadius: 8,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 16,
      },
    }),
  },
  {
    type: "trust_badges",
    title: "Trust Badges Row",
    category: "cro",
    icon: "🛡️",
    description: "COD, Free Delivery, 7-Day Replacement & Dermatologist Tested",
    defaultBlock: () => ({
      id: generateId("trust"),
      type: "trust_badges",
      label: "Trust Badges",
      settings: {
        badges: [
          { icon: "🚚", title: "Free Express Shipping", desc: "Across India" },
          { icon: "💵", title: "Cash on Delivery", desc: "Available at checkout" },
          { icon: "🌿", title: "100% Clean Formula", desc: "Cruelty Free" },
          { icon: "🔄", title: "7-Day Return Policy", desc: "No questions asked" },
        ],
      },
      styles: {
        backgroundColor: "#f8fafc",
        borderRadius: 8,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 12,
        marginBottom: 20,
      },
    }),
  },
  {
    type: "testimonial",
    title: "Customer Review Card",
    category: "cro",
    icon: "💬",
    description: "Verified customer quote with avatar, rating, and date",
    defaultBlock: () => ({
      id: generateId("test"),
      type: "testimonial",
      label: "Testimonial",
      settings: {
        name: "Ananya Sharma",
        location: "Mumbai, Maharashtra",
        quote: "“I was sceptical at first, but within 10 days my acne scars noticeably faded and my skin has a natural glass glow. Completely holy-grail product!”",
        rating: 5,
        verified: true,
      },
      styles: {
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 12,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        boxShadow: "sm",
        marginBottom: 16,
      },
    }),
  },
  {
    type: "faq_accordion",
    title: "FAQ Accordion",
    category: "cro",
    icon: "❓",
    description: "Collapsible questions & answers for objection handling",
    defaultBlock: () => ({
      id: generateId("faq"),
      type: "faq_accordion",
      label: "FAQ Accordion",
      settings: {
        faqs: [
          { q: "How soon can I see results?", a: "Most users report visible hydration from day 1, and significant barrier recovery within 14 days of regular twice-daily use." },
          { q: "Is this suitable for sensitive and acne-prone skin?", a: "Yes, our formula is non-comedogenic, fragrance-free, and dermatologically tested for all skin types." },
          { q: "Can I pay with Cash on Delivery (COD)?", a: "Yes! We offer Cash on Delivery across 24,000+ pincodes in India." },
        ],
      },
      styles: {
        marginBottom: 24,
      },
    }),
  },
  {
    type: "pincode_checker",
    title: "Pincode Delivery Estimator",
    category: "cro",
    icon: "📍",
    description: "Indian D2C delivery checker (COD check & estimated days)",
    defaultBlock: () => ({
      id: generateId("pin"),
      type: "pincode_checker",
      label: "Pincode Checker",
      settings: {
        placeholder: "Enter 6-digit Pincode (e.g. 110001)",
        sampleResult: "⚡ Delivered by Wednesday | COD Available",
      },
      styles: {
        backgroundColor: "#f8fafc",
        borderRadius: 8,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 14,
        paddingRight: 14,
        marginBottom: 16,
      },
    }),
  },
  {
    type: "whatsapp_chat",
    title: "WhatsApp VIP Chat Button",
    category: "cro",
    icon: "💬",
    description: "Direct WhatsApp concierge for questions and quick order",
    defaultBlock: () => ({
      id: generateId("wa"),
      type: "whatsapp_chat",
      label: "WhatsApp Chat",
      settings: {
        number: "919876543210",
        message: "Hi! I have a question about the product.",
        text: "Chat with Skincare Advisor on WhatsApp",
      },
      styles: {
        fontSize: "15px",
        fontWeight: "600",
        textColor: "#ffffff",
        backgroundColor: "#16a34a",
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 8,
        textAlign: "center",
        marginBottom: 16,
      },
    }),
  },

  // Layout Containers
  {
    type: "columns_1",
    title: "1 Column (Full Width)",
    category: "layout",
    icon: "⏹️",
    description: "Single column container for centered content or banners",
    defaultBlock: () => ({
      id: generateId("col1"),
      type: "columns_1",
      label: "1 Column Row",
      settings: {},
      styles: {
        paddingTop: 24,
        paddingBottom: 24,
      },
    }),
  },
  {
    type: "columns_2",
    title: "2 Columns (50 / 50)",
    category: "layout",
    icon: "◫",
    description: "Two balanced columns for media + text or Buy Box layout",
    defaultBlock: () => ({
      id: generateId("col2"),
      type: "columns_2",
      label: "2 Columns Row",
      settings: {},
      styles: {
        paddingTop: 24,
        paddingBottom: 24,
      },
    }),
  },
  {
    type: "columns_3",
    title: "3 Columns (33 / 33 / 33)",
    category: "layout",
    icon: "☱",
    description: "Three columns for feature cards, testimonials, or steps",
    defaultBlock: () => ({
      id: generateId("col3"),
      type: "columns_3",
      label: "3 Columns Row",
      settings: {},
      styles: {
        paddingTop: 24,
        paddingBottom: 24,
      },
    }),
  },
];

// Helper to create pre-made sections
export const PREBUILT_SECTIONS = [
  {
    id: "sec_hero",
    title: "High-Converting Hero Section",
    category: "hero",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Hero Banner",
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        backgroundColor: "#f8fafc",
      },
      columns: [
        {
          id: generateId("col"),
          width: 6,
          blocks: [
            {
              id: generateId("b"),
              type: "product_rating",
              settings: { rating: 4.9, reviewsCount: 2310, verifiedText: "Rated 4.9/5 by 2,300+ customers" },
              styles: { marginBottom: 12, textColor: "#d97706", fontSize: "14px", fontWeight: "600" },
            },
            {
              id: generateId("b"),
              type: "heading",
              settings: { text: "Clinical Results. Zero Irritation.", tag: "h1" },
              styles: { fontSize: "42px", fontWeight: "800", textColor: "#0f172a", lineHeight: "1.1", marginBottom: 16 },
            },
            {
              id: generateId("b"),
              type: "paragraph",
              settings: { text: "Formulated with 10% Niacinamide, Hyaluronic Acid, and Korean Centella. Clinically proven to reduce blemishes and brighten skin within 14 days." },
              styles: { fontSize: "17px", textColor: "#475569", lineHeight: "1.6", marginBottom: 24 },
            },
            {
              id: generateId("b"),
              type: "button",
              settings: { text: "SHOP NOW — 40% OFF TODAY", url: "#buy-now" },
              styles: { fontSize: "16px", fontWeight: "700", textColor: "#ffffff", backgroundColor: "#0284c7", paddingTop: 16, paddingBottom: 16, paddingLeft: 32, paddingRight: 32, borderRadius: 8, textAlign: "center" },
            },
          ],
        },
        {
          id: generateId("col"),
          width: 6,
          blocks: [
            {
              id: generateId("b"),
              type: "image",
              settings: {
                src: "https://images.unsplash.com/photo-1608248597359-251f5e8b39aa?w=800&auto=format&fit=crop&q=80",
                alt: "Clinical serum bottle",
              },
              styles: { borderRadius: 16, boxShadow: "lg", width: "100%" },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_buybox",
    title: "Product Buy Box (High-AOV Funnel)",
    category: "product",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Product Buy Box",
      styles: {
        paddingTop: 40,
        paddingBottom: 40,
        backgroundColor: "#ffffff",
      },
      columns: [
        {
          id: generateId("col"),
          width: 6,
          blocks: [
            {
              id: generateId("b"),
              type: "product_gallery",
              settings: {
                images: [
                  "https://images.unsplash.com/photo-1608248597359-251f5e8b39aa?w=800&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
                ],
              },
              styles: { borderRadius: 12 },
            },
          ],
        },
        {
          id: generateId("col"),
          width: 6,
          blocks: [
            {
              id: generateId("b"),
              type: "countdown_timer",
              settings: { title: "⚡ LIMITED TIME OFFER ENDS IN:", hours: 2, minutes: 15, seconds: 40 },
              styles: { backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1, borderRadius: 8, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, marginBottom: 14 },
            },
            {
              id: generateId("b"),
              type: "product_title",
              settings: { text: "Luminous Glass Glow Barrier Serum", tag: "h1" },
              styles: { fontSize: "32px", fontWeight: "700", textColor: "#0f172a", marginBottom: 8 },
            },
            {
              id: generateId("b"),
              type: "product_rating",
              settings: { rating: 4.9, reviewsCount: 1420, verifiedText: "4.9/5 (1,420 Reviews)" },
              styles: { marginBottom: 12, textColor: "#d97706" },
            },
            {
              id: generateId("b"),
              type: "product_price",
              settings: { price: "₹1,299", comparePrice: "₹2,199", badgeText: "SAVE 41%" },
              styles: { fontSize: "24px", fontWeight: "700", textColor: "#0f172a", marginBottom: 16 },
            },
            {
              id: generateId("b"),
              type: "product_variants",
              settings: { options: [{ name: "Pack Size", values: ["1 Bottle (30ml)", "2 Bottles (Best Value - Save 50%)"] }] },
              styles: { marginBottom: 16 },
            },
            {
              id: generateId("b"),
              type: "product_stock_urgency",
              settings: { text: "⚡ Only 7 units remaining in stock at this discounted rate", percentage: 88 },
              styles: { textColor: "#b91c1c", fontSize: "14px", fontWeight: "600", marginBottom: 16 },
            },
            {
              id: generateId("b"),
              type: "product_atc",
              settings: { text: "ADD TO CART — ₹1,299", showQuantity: true },
              styles: { backgroundColor: "#0284c7", textColor: "#ffffff", fontSize: "17px", fontWeight: "700", paddingTop: 15, paddingBottom: 15, borderRadius: 8, width: "100%", marginBottom: 10 },
            },
            {
              id: generateId("b"),
              type: "product_buynow",
              settings: { text: "⚡ BUY WITH CASH ON DELIVERY (1-CLICK)" },
              styles: { backgroundColor: "#f59e0b", textColor: "#0f172a", fontSize: "15px", fontWeight: "700", paddingTop: 14, paddingBottom: 14, borderRadius: 8, width: "100%", marginBottom: 16 },
            },
            {
              id: generateId("b"),
              type: "trust_badges",
              settings: {
                badges: [
                  { icon: "🚚", title: "Free Express Shipping", desc: "Fast 2-4 days" },
                  { icon: "💵", title: "COD Available", desc: "Pay on delivery" },
                  { icon: "🛡️", title: "100% Genuine Formula", desc: "Lab tested" },
                ],
              },
              styles: { backgroundColor: "#f8fafc", borderRadius: 8, paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_features",
    title: "3-Column Benefits & USPs",
    category: "features",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Benefits Grid",
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        backgroundColor: "#f8fafc",
      },
      columns: [
        {
          id: generateId("col"),
          width: 4,
          blocks: [
            {
              id: generateId("b"),
              type: "heading",
              settings: { text: "🌿 100% Bio-Compatible", tag: "h3" },
              styles: { fontSize: "20px", fontWeight: "700", textColor: "#0f172a", marginBottom: 8 },
            },
            {
              id: generateId("b"),
              type: "paragraph",
              settings: { text: "Made with cold-pressed natural seed oils that mimic the skin's lipid barrier for instant absorption." },
              styles: { fontSize: "15px", textColor: "#64748b", lineHeight: "1.5" },
            },
          ],
        },
        {
          id: generateId("col"),
          width: 4,
          blocks: [
            {
              id: generateId("b"),
              type: "heading",
              settings: { text: "🔬 Dermatologist Verified", tag: "h3" },
              styles: { fontSize: "20px", fontWeight: "700", textColor: "#0f172a", marginBottom: 8 },
            },
            {
              id: generateId("b"),
              type: "paragraph",
              settings: { text: "Clinically trialled on 300+ sensitive skin participants with zero reported redness or irritation." },
              styles: { fontSize: "15px", textColor: "#64748b", lineHeight: "1.5" },
            },
          ],
        },
        {
          id: generateId("col"),
          width: 4,
          blocks: [
            {
              id: generateId("b"),
              type: "heading",
              settings: { text: "✨ 14-Day Money Back", tag: "h3" },
              styles: { fontSize: "20px", fontWeight: "700", textColor: "#0f172a", marginBottom: 8 },
            },
            {
              id: generateId("b"),
              type: "paragraph",
              settings: { text: "If you don't notice brighter, more supple skin within 14 days, we'll refund your purchase in full." },
              styles: { fontSize: "15px", textColor: "#64748b", lineHeight: "1.5" },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_faq",
    title: "FAQ Objection-Buster Accordion",
    category: "faq",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Frequently Asked Questions",
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        backgroundColor: "#ffffff",
      },
      columns: [
        {
          id: generateId("col"),
          width: 12,
          blocks: [
            {
              id: generateId("b"),
              type: "heading",
              settings: { text: "Frequently Asked Questions", tag: "h2" },
              styles: { fontSize: "32px", fontWeight: "700", textColor: "#0f172a", textAlign: "center", marginBottom: 24 },
            },
            {
              id: generateId("b"),
              type: "faq_accordion",
              settings: {
                faqs: [
                  { q: "How long does a 50ml bottle last?", a: "With twice-daily use of 3-4 drops, a 50ml bottle lasts approximately 6 to 8 weeks." },
                  { q: "Can I use this with Vitamin C and Sunscreen?", a: "Yes! Our formula is neutral pH and pairs perfectly under sunscreen in the morning and moisturizer at night." },
                  { q: "How fast is shipping?", a: "Orders placed before 2 PM are dispatched same-day. Delivery takes 2 to 4 business days across India." },
                ],
              },
              styles: { marginBottom: 16 },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_urgency_flash_bar",
    title: "⚡ Flash Sale Urgency Countdown Bar",
    category: "urgency",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Flash Sale Urgency Bar",
      styles: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: "#0f172a",
      },
      columns: [
        {
          id: generateId("col"),
          width: 12,
          blocks: [
            {
              id: generateId("b"),
              type: "countdown_timer",
              settings: {
                title: "🔥 FLASH SALE ENDING: 40% OFF STOREWIDE — CODE: FLASH40",
                hours: 2,
                minutes: 48,
                seconds: 15,
              },
              styles: {
                textColor: "#f8fafc",
                backgroundColor: "transparent",
                marginBottom: 0,
              },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_urgency_stock_scarcity",
    title: "🔥 Stock Scarcity & Inventory Urgency Meter",
    category: "urgency",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Stock Scarcity Meter",
      styles: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#fff1f2",
      },
      columns: [
        {
          id: generateId("col"),
          width: 12,
          blocks: [
            {
              id: generateId("b"),
              type: "product_stock_urgency",
              settings: {
                text: "⚡ CRITICAL DEMAND: Only 4 items left in stock! 87 shoppers viewing right now.",
                percentage: 92,
              },
              styles: {
                textColor: "#9f1239",
                marginBottom: 0,
              },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_urgency_live_proof",
    title: "👥 Real-Time Live Buyer Social Proof",
    category: "urgency",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Live Buyer Proof",
      styles: {
        paddingTop: 24,
        paddingBottom: 24,
        backgroundColor: "#f0fdf4",
      },
      columns: [
        {
          id: generateId("col"),
          width: 12,
          blocks: [
            {
              id: generateId("b"),
              type: "testimonial",
              settings: {
                quote: "“Just ordered 2 pairs! Fast COD checkout and unbelievable quality.”",
                name: "Aman Sharma from Mumbai (Purchased 4 minutes ago)",
              },
              styles: {
                backgroundColor: "#ffffff",
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 20,
                paddingRight: 20,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#bbf7d0",
                marginBottom: 0,
              },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_urgency_cart_timer",
    title: "⏳ Cart Reservation Timer & Locked Price",
    category: "urgency",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Cart Reservation Timer",
      styles: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: "#fef3c7",
      },
      columns: [
        {
          id: generateId("col"),
          width: 12,
          blocks: [
            {
              id: generateId("b"),
              type: "countdown_timer",
              settings: {
                title: "🔒 YOUR CART IS RESERVED FOR THE NEXT:",
                hours: 0,
                minutes: 9,
                seconds: 52,
              },
              styles: {
                textColor: "#92400e",
                marginBottom: 0,
              },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "sec_urgency_sticky_atc",
    title: "🛒 Sticky Floating Add-to-Cart Conversion Bar",
    category: "urgency",
    create: (): Section => ({
      id: generateId("sec"),
      title: "Sticky Add to Cart Bar",
      styles: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: "#0f172a",
      },
      columns: [
        {
          id: generateId("col"),
          width: 12,
          blocks: [
            {
              id: generateId("b"),
              type: "product_atc",
              settings: {
                text: "⚡ INSTANT CHECKOUT — 40% OFF APPLIED",
                showQuantity: true,
              },
              styles: {
                backgroundColor: "#0284c7",
                textColor: "#ffffff",
                borderRadius: 8,
                paddingTop: 14,
                paddingBottom: 14,
                width: "100%",
                marginBottom: 0,
              },
            },
          ],
        },
      ],
    }),
  },
];

export const PREBUILT_URGENCY_SECTIONS = PREBUILT_SECTIONS.filter((s) => s.category === "urgency");

export const PREBUILT_TEMPLATES: Array<{
  id: string;
  name: string;
  category: "landing" | "product" | "fashion" | "tech";
  thumbnail: string;
  description: string;
  generate: () => PageSchema;
}> = [
  {
    id: "blank_canvas",
    name: "Blank Canvas (Start from Scratch)",
    category: "landing",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80",
    description: "Clean empty canvas to build your exact vision with drag-and-drop elements.",
    generate: (): PageSchema => ({
      version: "2.0",
      id: generateId("page"),
      title: "My New Landing Page",
      handle: "new-page",
      pageType: "LANDING",
      layoutMode: "FULL_PAGE_NO_CHROME",
      globalStyles: DEFAULT_GLOBAL_STYLES,
      sections: [
        {
          id: generateId("sec"),
          title: "Introduction Banner",
          styles: { paddingTop: 60, paddingBottom: 60, backgroundColor: "#ffffff" },
          columns: [
            {
              id: generateId("col"),
              width: 12,
              blocks: [
                {
                  id: generateId("b"),
                  type: "heading",
                  settings: { text: "Welcome to Your Custom Page", tag: "h1" },
                  styles: { fontSize: "36px", fontWeight: "800", textAlign: "center", textColor: "#0f172a", marginBottom: 12 },
                },
                {
                  id: generateId("b"),
                  type: "paragraph",
                  settings: { text: "Drag elements from the left panel to build your dream store layout." },
                  styles: { fontSize: "18px", textAlign: "center", textColor: "#64748b", marginBottom: 24 },
                },
                {
                  id: generateId("b"),
                  type: "button",
                  settings: { text: "Explore Collection →", url: "/collections/all" },
                  styles: { fontSize: "16px", fontWeight: "600", textAlign: "center", textColor: "#ffffff", backgroundColor: "#0284c7", paddingTop: 14, paddingBottom: 14, paddingLeft: 28, paddingRight: 28, borderRadius: 8 },
                },
              ],
            },
          ],
        },
      ],
    }),
  },
  {
    id: "d2c_skincare",
    name: "D2C Skincare & Beauty Landing Page",
    category: "product",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80",
    description: "High-converting editorial landing page with hero, buy box, clinical proof, and FAQ.",
    generate: (): PageSchema => ({
      version: "2.0",
      id: generateId("page"),
      title: "Luminous Skincare Special Offer",
      handle: "skincare-special",
      pageType: "LANDING",
      layoutMode: "FULL_PAGE_NO_CHROME",
      globalStyles: DEFAULT_GLOBAL_STYLES,
      sections: [
        PREBUILT_SECTIONS[0].create(), // Hero
        PREBUILT_SECTIONS[1].create(), // Buy Box
        PREBUILT_SECTIONS[2].create(), // Features
        PREBUILT_SECTIONS[3].create(), // FAQ
      ],
    }),
  },
  {
    id: "tech_gadgets",
    name: "High-AOV Tech & Gadgets Launch Funnel",
    category: "tech",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    description: "High-impact dark tech layout with urgency timer, spec highlights, and COD checkout.",
    generate: (): PageSchema => ({
      version: "2.0",
      id: generateId("page"),
      title: "AudioPro Wireless Headphones",
      handle: "audiopro-launch",
      pageType: "PRODUCT",
      layoutMode: "FULL_PAGE_NO_CHROME",
      globalStyles: { ...DEFAULT_GLOBAL_STYLES, primaryColor: "#09090b", backgroundColor: "#ffffff" },
      sections: [
        PREBUILT_SECTIONS[1].create(),
        PREBUILT_SECTIONS[2].create(),
        PREBUILT_SECTIONS[3].create(),
      ],
    }),
  },
];

export const DEFAULT_TEMPLATES = PREBUILT_TEMPLATES;

