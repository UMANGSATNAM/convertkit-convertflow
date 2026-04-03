// PageCraft AI — System prompts for page generation
// Uses existing Gemini integration (@google/generative-ai)

export const PAGECRAFT_SYSTEM_PROMPT = `You are PageCraft AI — an intelligent Shopify page builder assistant.
Your ONLY job is to generate high-converting store page sections as structured JSON.

RULES:
- Every page MUST have a CTA button visible above the fold
- Trust badges MUST appear near the buy button
- Every page has exactly ONE primary CTA
- Mobile layout is always checked first
- Use simple, encouraging language — no technical jargon
- Never create a page without a CTA button
- All text must be conversion-optimized

OUTPUT: Return a valid JSON object with this exact structure:
{
  "sections": [
    {
      "type": "hero",
      "headline": "compelling headline for the store",
      "subtext": "supporting text that builds desire",
      "cta_text": "action-oriented button text",
      "cta_color": "#hex color that matches the style",
      "background_color": "#hex",
      "background_gradient": "CSS gradient string or null",
      "image_position": "left|right|center|background"
    },
    {
      "type": "product_showcase",
      "headline": "section headline",
      "subtext": "brief description",
      "layout": "grid|carousel|featured",
      "columns": 3,
      "show_prices": true,
      "show_ratings": true
    },
    {
      "type": "trust_badges",
      "badges": [
        { "icon": "shield", "label": "Secure Checkout" },
        { "icon": "truck", "label": "Free Shipping" },
        { "icon": "refresh", "label": "30-Day Returns" },
        { "icon": "star", "label": "5-Star Rated" }
      ],
      "layout": "horizontal",
      "background_color": "#hex"
    },
    {
      "type": "social_proof",
      "headline": "What our customers say",
      "layout": "grid|carousel",
      "show_photos": true,
      "show_ratings": true,
      "reviews": [
        { "name": "Customer Name", "rating": 5, "text": "Review text", "location": "City, State" }
      ]
    },
    {
      "type": "faq",
      "headline": "Frequently Asked Questions",
      "items": [
        { "question": "...", "answer": "..." }
      ],
      "style": "accordion"
    },
    {
      "type": "urgency_bar",
      "message": "urgency message text",
      "style": "countdown|stock|banner",
      "background_color": "#hex",
      "text_color": "#hex"
    },
    {
      "type": "footer",
      "columns": [
        { "title": "column title", "links": ["link1", "link2"] }
      ],
      "show_newsletter": true,
      "show_social": true,
      "copyright": "copyright text"
    }
  ],
  "meta": {
    "page_title": "SEO-optimized page title",
    "page_description": "SEO meta description under 160 chars",
    "style_theme": "the style applied"
  }
}

Return ONLY valid JSON. No markdown, no explanation, no code blocks.`;

export function buildGenerationPrompt(niche, style, storeName, product) {
  const nicheDescriptions = {
    fashion: "Fashion & Apparel — clothing, accessories, shoes. Focus on visual appeal, lifestyle imagery, and size guides.",
    beauty: "Beauty & Cosmetics — skincare, makeup, haircare. Focus on ingredients, before/after results, and self-care messaging.",
    electronics: "Electronics & Tech — gadgets, accessories, smart devices. Focus on specs, comparisons, and innovation messaging.",
    home: "Home & Living — furniture, decor, kitchen. Focus on cozy lifestyle, quality materials, and room transformations.",
    food: "Food & Beverage — gourmet, snacks, drinks, supplements. Focus on ingredients, taste descriptions, and health benefits.",
    sports: "Sports & Fitness — activewear, equipment, supplements. Focus on performance, results, and motivation.",
    pets: "Pets & Animals — pet food, toys, accessories. Focus on pet happiness, quality ingredients, and owner peace of mind.",
    other: "General ecommerce store. Focus on trust, value proposition, and clear product benefits.",
  };

  const styleDescriptions = {
    minimal: "Minimal & Clean — lots of whitespace, simple typography, muted colors, elegant and understated. Use soft neutrals with one accent color.",
    bold: "Bold & Energetic — vibrant colors, large typography, dynamic layouts, attention-grabbing. Use contrasting colors and strong visual hierarchy.",
    luxe: "Luxe & Premium — dark backgrounds, gold/metallic accents, serif fonts, sophisticated imagery. Convey exclusivity and craftsmanship.",
  };

  return `Generate a complete, high-converting Shopify store page for:

STORE NAME: ${storeName || "My Store"}
MAIN PRODUCT: ${product || "Premium products"}
NICHE: ${nicheDescriptions[niche] || nicheDescriptions.other}
STYLE: ${styleDescriptions[style] || styleDescriptions.minimal}

Requirements:
1. Hero section with a compelling headline that mentions the product/niche
2. Product showcase section highlighting the main product
3. Trust badges row (always include: Secure Checkout, Free Shipping, 30-Day Returns, and one niche-specific badge)
4. Social proof section with 3 realistic customer reviews matching the niche
5. FAQ section with 4-5 questions specific to the niche and product
6. Urgency bar with a niche-appropriate urgency message
7. Footer with standard columns

Color palette must match the ${style} style. All copy must be conversion-optimized.
Headlines should be punchy, under 8 words. Subtext under 20 words.
CTA buttons should use action verbs ("Shop Now", "Get Yours", "Discover").`;
}

export function buildScoreImprovements(sections) {
  const improvements = [];
  const hasHero = sections.some(s => s.type === "hero");
  const hasTrust = sections.some(s => s.type === "trust_badges");
  const hasSocial = sections.some(s => s.type === "social_proof");
  const hasFaq = sections.some(s => s.type === "faq");
  const hasUrgency = sections.some(s => s.type === "urgency_bar");
  const heroSection = sections.find(s => s.type === "hero");

  if (!hasHero) improvements.push({ text: "Add a hero section — customers need to see your value in the first 3 seconds", priority: "critical", fixType: "add_hero" });
  if (!hasTrust) improvements.push({ text: "Add trust badges near your buy button — this alone can increase conversions by 15%", priority: "critical", fixType: "add_trust" });
  if (!hasSocial) improvements.push({ text: "Add customer reviews — 93% of customers read reviews before buying", priority: "high", fixType: "add_social" });
  if (!hasFaq) improvements.push({ text: "Add an FAQ section — reduces support tickets by 40% and helps SEO", priority: "medium", fixType: "add_faq" });
  if (!hasUrgency) improvements.push({ text: "Add urgency elements — creates FOMO and can lift conversions by 20%", priority: "medium", fixType: "add_urgency" });
  if (heroSection && (!heroSection.cta_text || heroSection.cta_text.length < 3)) {
    improvements.push({ text: "Your hero needs a stronger CTA button — use action words like 'Shop Now' or 'Get Started'", priority: "critical", fixType: "fix_cta" });
  }

  return improvements;
}
