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
import matchaData from "./templates/lp-superfood-matcha.json";
import securityData from "./templates/lp-smart-security.json";
import watchData from "./templates/lp-luxury-watch.json";
import cleaningData from "./templates/lp-eco-cleaning.json";
import journalData from "./templates/lp-productivity-journal.json";
import luggageData from "./templates/lp-travel-luggage.json";
import serumData from "./templates/lp-haircare-serum.json";
import yogaData from "./templates/lp-yoga-equipment.json";
import chairData from "./templates/lp-ergonomic-chair.json";
import snacksData from "./templates/lp-vegan-snacks.json";
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
  {
    id: "superfood-matcha",
    name: "ZenBlend — Superfood Matcha",
    category: "food",
    niche: "superfoods",
    description: "Vibrant, high-energy superfood matcha page with vibrant green tones, health benefits grids, recipe sections, and a subscription funnel.",
    icon: "🍵",
    gradient: "linear-gradient(135deg, #22C55E, #DCFCE7)",
    sectionCount: 8,
    tags: ["Food", "Superfoods", "Subscription", "Energy"],
    data: matchaData,
  },
  {
    id: "smart-security",
    name: "SecureLens — Smart Home Security",
    category: "electronics",
    niche: "security",
    description: "Tech-driven smart home security page with a dark aesthetic, 4K camera features, AI detection callouts, and multi-camera bundles.",
    icon: "📸",
    gradient: "linear-gradient(135deg, #3B82F6, #1E293B)",
    sectionCount: 7,
    tags: ["Electronics", "Security", "Smart Home", "Bundles"],
    data: securityData,
  },
  {
    id: "luxury-watch",
    name: "Chronos — Luxury Automatic Watch",
    category: "fashion",
    niche: "watches",
    description: "Premium dark-mode watch landing page featuring auto-movement specs, craftsmanship storytelling, macro imagery placeholders, and elegant serif typography.",
    icon: "⏱️",
    gradient: "linear-gradient(135deg, #D4AF37, #111111)",
    sectionCount: 7,
    tags: ["Fashion", "Watches", "Luxury", "Pre-Order"],
    data: watchData,
  },
  {
    id: "eco-cleaning",
    name: "PureEarth — Eco Cleaning",
    category: "home",
    niche: "cleaning",
    description: "Clean, airy pastel landing page for eco-friendly cleaning supplies. Focuses on safe ingredients, reusable bottles, and subscription refilling.",
    icon: "🫧",
    gradient: "linear-gradient(135deg, #14B8A6, #CCFBF1)",
    sectionCount: 6,
    tags: ["Home", "Cleaning", "Eco-Friendly", "Subscription"],
    data: cleaningData,
  },
  {
    id: "productivity-journal",
    name: "FocusFlow — Productivity Journal",
    category: "general",
    niche: "stationery",
    description: "Warm, minimalist productivity journal landing page with cream and gold tones. Highlights habit tracking layouts and 90-day focus psychology.",
    icon: "📓",
    gradient: "linear-gradient(135deg, #CA8A04, #FAFAF9)",
    sectionCount: 6,
    tags: ["Journal", "Stationery", "Productivity", "Mindfulness"],
    data: journalData,
  },
  {
    id: "travel-luggage",
    name: "AeroTrek — Premium Luggage",
    category: "general",
    niche: "travel",
    description: "Sleek, modern luggage landing page showcasing indestructible polycarbonate shells, 360 spinner wheels, and lifetime warranties. Metallic silver and navy tones.",
    icon: "✈️",
    gradient: "linear-gradient(135deg, #1E3A8A, #E2E8F0)",
    sectionCount: 7,
    tags: ["Travel", "Luggage", "Premium", "Durable"],
    data: luggageData,
  },
  {
    id: "haircare-serum",
    name: "AuraLocks — Hair Growth Serum",
    category: "beauty",
    niche: "haircare",
    description: "Luxurious, scientifically backed haircare serum landing page with deep purple and gold tones. Highlights clinical trials, before/after galleries, and subscriptions.",
    icon: "💧",
    gradient: "linear-gradient(135deg, #4C1D95, #DDD6FE)",
    sectionCount: 7,
    tags: ["Beauty", "Haircare", "Science", "Subscription"],
    data: serumData,
  },
  {
    id: "yoga-equipment",
    name: "PranaMats — Yoga Equipment",
    category: "fitness",
    niche: "yoga",
    description: "Earthy, calming eco-friendly yoga mat landing page. Focuses on grip technology, natural rubber materials, and alignment lines.",
    icon: "🧘‍♀️",
    gradient: "linear-gradient(135deg, #3F6212, #F4F1EA)",
    sectionCount: 6,
    tags: ["Fitness", "Yoga", "Eco-Friendly", "Mindful"],
    data: yogaData,
  },
  {
    id: "ergonomic-chair",
    name: "ErgoFlex — Office Chair",
    category: "home",
    niche: "furniture",
    description: "Modern dark-mode office furniture landing page with neon blue accents. Focuses on lumbar support tech, posture correction, and work-from-home ergonomics.",
    icon: "💺",
    gradient: "linear-gradient(135deg, #38BDF8, #1E293B)",
    sectionCount: 6,
    tags: ["Home Office", "Furniture", "Ergonomic", "WFH"],
    data: chairData,
  },
  {
    id: "vegan-snacks",
    name: "CrunchBite — Vegan Protein Bars",
    category: "food",
    niche: "snacks",
    description: "Playful, energetic snack bar landing page using vibrant bold colors, macro ingredient photography placeholders, and a subscribe & save focus.",
    icon: "💥",
    gradient: "linear-gradient(135deg, #E11D48, #FECDD3)",
    sectionCount: 6,
    tags: ["Food", "Snacks", "Vegan", "High Protein"],
    data: snacksData,
  }
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
