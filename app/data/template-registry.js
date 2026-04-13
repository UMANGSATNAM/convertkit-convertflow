// Template Registry — Central index of all pre-built landing page templates
import gymsharkPremiumData from "./templates/lp-gymshark-premium.json";
import { generateId } from "../components/pagecraft/sectionRegistry";

// ── Template Metadata ──
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "fitness", label: "Fitness & Apparel" },
];

export const TEMPLATES = [
  {
    id: "gymshark-premium-100x",
    name: "Gymshark Premium (Theme Ext)",
    category: "fitness",
    niche: "fitness",
    description: "The 100x better ultra-premium template with native Theme App Extension support for Parallax, Video backgrounds, and Sticky Mobile Carts.",
    icon: "🥇",
    gradient: "linear-gradient(135deg, #0A0A0A, #111111)",
    sectionCount: 5,
    tags: ["Premium", "Fitness", "Native UI", "100x"],
    data: gymsharkPremiumData,
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
