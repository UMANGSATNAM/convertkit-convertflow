// Template Registry — Central index of all pre-built landing page templates
import activewearData from "./templates/lp-activewear.json";
import mensFashionData from "./templates/lp-mens-fashion.json";
import personalCareData from "./templates/lp-personal-care.json";
import streetwearData from "./templates/lp-streetwear.json";
import { generateId } from "../components/pagecraft/sectionRegistry";

// ── Template Metadata ──
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "fashion", label: "Fashion & Apparel" },
  { id: "beauty", label: "Beauty & Personal Care" },
  { id: "fitness", label: "Fitness & Health" },
  { id: "electronics", label: "Electronics" },
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
