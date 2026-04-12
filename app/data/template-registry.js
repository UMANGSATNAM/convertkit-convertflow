// Template Registry — Central index of all pre-built landing page templates
import activewearData from "./templates/lp-activewear.json";
import mensFashionData from "./templates/lp-mens-fashion.json";
import personalCareData from "./templates/lp-personal-care.json";
import streetwearData from "./templates/lp-streetwear.json";
import wakefitData from "./templates/lp-wakefit-mattress.json";
import appleData from "./templates/lp-apple-product.json";
import gymsharkData from "./templates/lp-gymshark-fitness.json";
import skimsData from "./templates/lp-skims-body.json";
import boatData from "./templates/lp-boat-electronics.json";
import jewelryData from "./templates/lp-jewelry-luxe.json";
import proteinData from "./templates/lp-protein-supplement.json";
import skincareData from "./templates/lp-korean-skincare.json";
import petData from "./templates/lp-pet-supplies.json";
import coffeeData from "./templates/lp-coffee-brand.json";
import { generateId } from "../components/pagecraft/sectionRegistry";

// ── Template Metadata ──
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "fashion", label: "Fashion & Apparel" },
  { id: "beauty", label: "Beauty & Personal Care" },
  { id: "fitness", label: "Fitness & Health" },
  { id: "electronics", label: "Electronics" },
  { id: "home", label: "Home & Living" },
  { id: "food", label: "Food & Beverage" },
  { id: "general", label: "General Store" },
];

export const TEMPLATES = [
  {
    id: "activewear-bloomfit",
    name: "BloomFit — Women's Activewear",
    category: "fashion",
    niche: "fitness",
    description: "Premium women's activewear with split hero, product showcase, fabric features, and reviews",
    icon: "👗",
    gradient: "linear-gradient(135deg, #D4734A, #F5D5C8)",
    sectionCount: 8,
    tags: ["Women", "Activewear", "Fitness", "Premium"],
    data: activewearData,
  },
  {
    id: "mens-fashion-drip",
    name: "DRIP — Men's Fashion",
    category: "fashion",
    niche: "fashion",
    description: "Bold men's fashion with urban aesthetic, product grid, cashback, and offers section",
    icon: "🧥",
    gradient: "linear-gradient(135deg, #FFB800, #111111)",
    sectionCount: 8,
    tags: ["Men", "Fashion", "Urban", "Bold"],
    data: mensFashionData,
  },
  {
    id: "personal-care-purebody",
    name: "PureBody — Personal Care",
    category: "beauty",
    niche: "skincare",
    description: "Elegant personal care page with benefits grid, product bundles, how-to-use, and premium CTA",
    icon: "🌿",
    gradient: "linear-gradient(135deg, #B8903A, #FAF8F4)",
    sectionCount: 9,
    tags: ["Beauty", "Skincare", "Elegant", "D2C"],
    data: personalCareData,
  },
  {
    id: "streetwear-urbnco",
    name: "URBNCO — Streetwear",
    category: "fashion",
    niche: "fashion",
    description: "Dark, edgy streetwear page with bold typography, feature grid, size selector, and reviews",
    icon: "🔥",
    gradient: "linear-gradient(135deg, #E8292B, #080808)",
    sectionCount: 7,
    tags: ["Streetwear", "Dark", "Bold", "Urban"],
    data: streetwearData,
  },
  {
    id: "wakefit-mattress",
    name: "SleepWell — Mattress & Home",
    category: "home",
    niche: "mattress",
    description: "Wakefit-style mattress landing page with 7-zone tech breakdown, 100-night trial, CoolGel feature sections, and trust-heavy social proof",
    icon: "🛏️",
    gradient: "linear-gradient(135deg, #2563EB, #DBEAFE)",
    sectionCount: 12,
    tags: ["Home", "Mattress", "Sleep", "D2C"],
    data: wakefitData,
  },
  {
    id: "apple-product-launch",
    name: "TechLux — Apple-Style Product Launch",
    category: "electronics",
    niche: "electronics",
    description: "Ultra-minimal Apple-inspired product launch page with typography-driven design, massive whitespace, and precision spec breakdowns",
    icon: "🎧",
    gradient: "linear-gradient(135deg, #1D1D1F, #F5F5F7)",
    sectionCount: 10,
    tags: ["Electronics", "Minimal", "Premium", "Tech"],
    data: appleData,
  },
  {
    id: "gymshark-fitness",
    name: "IronPulse — Gymshark-Style Fitness",
    category: "fitness",
    niche: "fitness",
    description: "Bold, dark, high-energy fitness apparel page with aggressive typography, athlete endorsements, and performance fabric breakdown",
    icon: "💪",
    gradient: "linear-gradient(135deg, #E11D48, #0A0A0A)",
    sectionCount: 10,
    tags: ["Fitness", "Dark", "Bold", "Athletic"],
    data: gymsharkData,
  },
  {
    id: "skims-body",
    name: "VelvetSkin — Skims-Style Intimates",
    category: "fashion",
    niche: "intimates",
    description: "Elegant, warm-toned intimates page with soft typography, inclusivity messaging, CloudSilk fabric tech, and lifestyle positioning",
    icon: "🌸",
    gradient: "linear-gradient(135deg, #8B6F5D, #FAF7F4)",
    sectionCount: 9,
    tags: ["Fashion", "Body", "Inclusive", "Elegant"],
    data: skimsData,
  },
  {
    id: "boat-electronics",
    name: "SonicWave — boAt-Style Audio",
    category: "electronics",
    niche: "audio",
    description: "Gen-Z audio electronics page with neon accents, aggressive pricing, heavy bass marketing, and influencer-driven social proof",
    icon: "🔊",
    gradient: "linear-gradient(135deg, #7C3AED, #00E5FF)",
    sectionCount: 10,
    tags: ["Audio", "Gen-Z", "Budget", "India"],
    data: boatData,
  },
  {
    id: "jewelry-luxe",
    name: "Lumière — Luxury Jewelry",
    category: "fashion",
    niche: "jewelry",
    description: "Ultra-premium luxury jewelry page with gold serif typography, craftsmanship storytelling, and aspirational lifestyle positioning",
    icon: "💎",
    gradient: "linear-gradient(135deg, #B8860B, #FFFCF5)",
    sectionCount: 9,
    tags: ["Jewelry", "Luxury", "Gold", "Bridal"],
    data: jewelryData,
  },
  {
    id: "protein-supplement",
    name: "FuelX — Protein & Supplements",
    category: "fitness",
    niche: "supplements",
    description: "High-energy protein supplement page with neon green accents, lab-tested trust signals, and athlete endorsements",
    icon: "💪",
    gradient: "linear-gradient(135deg, #84CC16, #0A0A0A)",
    sectionCount: 9,
    tags: ["Fitness", "Supplements", "D2C", "Lab-Tested"],
    data: proteinData,
  },
  {
    id: "korean-skincare",
    name: "GlowLab — Korean Skincare",
    category: "beauty",
    niche: "skincare",
    description: "Minimalist Korean skincare page with soft pastels, ingredient transparency, routine builder, and dermatologist endorsements",
    icon: "🌸",
    gradient: "linear-gradient(135deg, #E879A8, #FFF5F8)",
    sectionCount: 9,
    tags: ["Beauty", "K-Beauty", "Skincare", "Vegan"],
    data: skincareData,
  },
  {
    id: "pet-supplies",
    name: "PawPal — Premium Pet Supplies",
    category: "general",
    niche: "pets",
    description: "Warm, playful pet supplies page with rounded aesthetics, vet-approved trust signals, and subscription model",
    icon: "🐕",
    gradient: "linear-gradient(135deg, #F97316, #FFFBF5)",
    sectionCount: 9,
    tags: ["Pets", "Subscription", "D2C", "Vet-Approved"],
    data: petData,
  },
  {
    id: "coffee-brand",
    name: "BrewCraft — Specialty Coffee",
    category: "food",
    niche: "coffee",
    description: "Rich specialty coffee page with deep brown tones, origin storytelling, brewing guides, and fresh-roasted subscription",
    icon: "☕",
    gradient: "linear-gradient(135deg, #92400E, #FAF5F0)",
    sectionCount: 9,
    tags: ["Coffee", "Food", "Subscription", "Specialty"],
    data: coffeeData,
  },
];

// ── Helpers ──

/**
 * Get a template by ID
 */
export function getTemplate(templateId) {
  return TEMPLATES.find((t) => t.id === templateId) || null;
}

/**
 * Hydrate template sections with unique IDs for the editor
 */
export function hydrateTemplate(templateId) {
  const template = getTemplate(templateId);
  if (!template) return null;

  const sections = template.data.sections.map((section) => ({
    ...section,
    id: generateId(),
    visible: section.visible !== false,
    // Flatten settings as top-level props for editor compat
    ...section.settings,
  }));

  return {
    templateId: template.id,
    templateName: template.name,
    sections,
    globalStyles: {
      fonts: template.data.fonts,
      colors: template.data.colors,
    },
    meta: {
      page_title: template.name,
      page_description: template.data.description,
    },
  };
}

/**
 * Filter templates by category
 */
export function filterTemplates(category) {
  if (!category || category === "all") return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}
