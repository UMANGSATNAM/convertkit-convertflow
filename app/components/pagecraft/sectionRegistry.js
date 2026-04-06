// Section Registry — shared types, icons, labels, categories, and defaults

export const SECTION_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "hero", label: "Hero" },
  { id: "content", label: "Content" },
  { id: "trust", label: "Trust" },
  { id: "conversion", label: "Conversion" },
  { id: "footer", label: "Footer" },
];

export const SECTION_TYPES = {
  hero: {
    icon: "🎯", label: "Hero Section", category: "hero",
    desc: "Bold headline with CTA button",
  },
  video_hero: {
    icon: "🎬", label: "Video Hero", category: "hero",
    desc: "Hero with embedded video",
  },
  announcement_bar: {
    icon: "📢", label: "Announcement Bar", category: "hero",
    desc: "Dismissible top banner",
  },
  product_showcase: {
    icon: "🛍️", label: "Product Showcase", category: "content",
    desc: "Product grid display",
  },
  image_with_text: {
    icon: "🖼️", label: "Image + Text", category: "content",
    desc: "Split layout — image and text",
  },
  brand_logos: {
    icon: "💎", label: "Brand Logos", category: "trust",
    desc: "Auto-scrolling logo marquee",
  },
  trust_badges: {
    icon: "🛡️", label: "Trust Badges", category: "trust",
    desc: "Shipping, returns, guarantees",
  },
  social_proof: {
    icon: "⭐", label: "Customer Reviews", category: "trust",
    desc: "Testimonial cards with ratings",
  },
  faq: {
    icon: "❓", label: "FAQ", category: "content",
    desc: "Accordion Q&A section",
  },
  newsletter: {
    icon: "📧", label: "Newsletter", category: "conversion",
    desc: "Email capture with CTA",
  },
  countdown_timer: {
    icon: "⏳", label: "Countdown Timer", category: "conversion",
    desc: "Deadline countdown display",
  },
  urgency_bar: {
    icon: "🔥", label: "Urgency Bar", category: "conversion",
    desc: "Limited stock alert bar",
  },
  cta_banner: {
    icon: "🚀", label: "CTA Banner", category: "conversion",
    desc: "Full-width call to action",
  },
  whatsapp_widget: {
    icon: "💬", label: "WhatsApp Chat", category: "conversion",
    desc: "Floating chat button",
  },
  footer: {
    icon: "📋", label: "Footer", category: "footer",
    desc: "Links, copyright, socials",
  },
};

export function getSectionMeta(type) {
  return SECTION_TYPES[type] || { icon: "📄", label: type, category: "content", desc: "" };
}

export function generateId() {
  return `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const SECTION_DEFAULTS = {
  hero: {
    type: "hero", headline: "Welcome to Our Store", subtext: "Discover premium products crafted just for you.",
    cta_text: "Shop Now", cta_color: "#10B981", background_color: "#0F172A", text_color: "#FFFFFF",
    padding_y: 80, alignment: "center",
  },
  video_hero: {
    type: "video_hero", headline: "See It In Action", subtext: "Watch how our product transforms your routine.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", cta_text: "Learn More", cta_color: "#3B82F6",
    background_color: "#000000", text_color: "#FFFFFF", overlay_opacity: 0.5, padding_y: 80,
  },
  announcement_bar: {
    type: "announcement_bar", message: "🎉 Free shipping on orders over $50!", link_text: "Shop Now", link_url: "/collections/all",
    background_color: "#1E293B", text_color: "#FFFFFF", dismissible: true,
  },
  product_showcase: {
    type: "product_showcase", headline: "Our Best Sellers", subtext: "Handpicked favorites from our collection.",
    columns: 3, show_prices: true, background_color: "#FFFFFF", padding_y: 48,
    products: [
      { name: "Featured Product 1", price: "$29.99" },
      { name: "Featured Product 2", price: "$39.99" },
      { name: "Featured Product 3", price: "$49.99" },
    ],
  },
  image_with_text: {
    type: "image_with_text", headline: "Our Story", text: "We believe in creating products that make a difference. Every item is carefully crafted with the finest materials and attention to detail.",
    image_url: "", image_position: "left", cta_text: "Learn More", cta_url: "/pages/about",
    cta_color: "#10B981", background_color: "#F8FAFC", padding_y: 48,
  },
  brand_logos: {
    type: "brand_logos", headline: "As Seen In",
    logos: [
      { name: "Forbes", text: "FORBES" },
      { name: "TechCrunch", text: "TECHCRUNCH" },
      { name: "Vogue", text: "VOGUE" },
      { name: "GQ", text: "GQ" },
      { name: "Wired", text: "WIRED" },
    ],
    background_color: "#FFFFFF", speed: "normal", padding_y: 32,
  },
  trust_badges: {
    type: "trust_badges",
    badges: [
      { icon: "shield", label: "Secure Checkout" },
      { icon: "truck", label: "Free Shipping" },
      { icon: "refresh", label: "30-Day Returns" },
      { icon: "star", label: "5-Star Rated" },
    ],
    layout: "horizontal", background_color: "#F8FAFC", padding_y: 24,
  },
  social_proof: {
    type: "social_proof", headline: "What Our Customers Say",
    reviews: [
      { name: "Sarah M.", rating: 5, text: "Absolutely love this product! Fast shipping and great quality.", location: "New York" },
      { name: "James K.", rating: 5, text: "Best purchase I've made this year. Highly recommend!", location: "Los Angeles" },
      { name: "Emily R.", rating: 4, text: "Great quality and the customer service is top notch.", location: "Chicago" },
    ],
    background_color: "#FFFFFF", padding_y: 48,
  },
  faq: {
    type: "faq", headline: "Frequently Asked Questions",
    items: [
      { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Express shipping is available at checkout." },
      { question: "What is your return policy?", answer: "We offer a 30-day money-back guarantee on all products." },
      { question: "Do you ship internationally?", answer: "Yes! We ship to over 50 countries worldwide." },
    ],
    background_color: "#FFFFFF", padding_y: 48,
  },
  newsletter: {
    type: "newsletter", headline: "Stay in the Loop", subtext: "Get 10% off your first order when you subscribe.",
    placeholder: "Enter your email", button_text: "Subscribe", button_color: "#10B981",
    background_color: "#0F172A", text_color: "#FFFFFF", padding_y: 48,
  },
  countdown_timer: {
    type: "countdown_timer", headline: "Sale Ends In", subtext: "Don't miss our biggest sale of the year!",
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    background_color: "#0F172A", text_color: "#FFFFFF", accent_color: "#EF4444", padding_y: 48,
  },
  urgency_bar: {
    type: "urgency_bar", message: "🔥 Limited stock — order in the next 2 hours for same-day dispatch!",
    background_color: "#DC2626", text_color: "#FFFFFF", padding_y: 12,
  },
  cta_banner: {
    type: "cta_banner", headline: "Ready to Transform Your Routine?", subtext: "Join thousands of happy customers today.",
    cta_text: "Get Started", cta_url: "/collections/all", cta_color: "#10B981",
    background_color: "#10B981", text_color: "#FFFFFF", padding_y: 48,
  },
  whatsapp_widget: {
    type: "whatsapp_widget", phone: "", message: "Hi! I'm interested in your products.", position: "bottom-right",
  },
  footer: {
    type: "footer",
    columns: [
      { title: "Shop", links: ["All Products", "New Arrivals", "Best Sellers"] },
      { title: "Help", links: ["FAQ", "Shipping", "Returns"] },
      { title: "Company", links: ["About Us", "Contact", "Blog"] },
    ],
    copyright: "© 2025 Your Store. All rights reserved.",
    background_color: "#0F172A", text_color: "#94A3B8", padding_y: 48,
  },
};
