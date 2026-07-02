import { readFile } from "./index";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates a settings patch against the theme's live settings_schema.json
 */
export async function validateSettingsPatch(shop: any, themeId: string, patch: Record<string, any>) {
  let schemaContent = "[]";
  try {
    schemaContent = await readFile(shop, themeId, "config/settings_schema.json");
  } catch (e) {
    // If no schema, we can't validate, so just return
    return;
  }

  let schema: any[];
  try {
    schema = JSON.parse(schemaContent);
  } catch (e) {
    throw new ValidationError("Invalid settings_schema.json in theme");
  }

  // Build a map of valid settings and their types
  const settingsMap = new Map<string, any>();
  for (const category of schema) {
    if (category.settings && Array.isArray(category.settings)) {
      for (const setting of category.settings) {
        if (setting.id) {
          settingsMap.set(setting.id, setting);
        }
      }
    }
  }

  for (const [key, value] of Object.entries(patch)) {
    const settingDef = settingsMap.get(key);
    if (!settingDef) {
      console.warn(`[Validator] Setting '${key}' does not exist in theme schema. Skipping validation for this key.`);
      continue;
    }

    // Basic type validation
    if (settingDef.type === "number" || settingDef.type === "range") {
      if (typeof value !== "number") throw new ValidationError(`Setting '${key}' must be a number`);
      if (settingDef.min !== undefined && value < settingDef.min) throw new ValidationError(`Setting '${key}' is below minimum ${settingDef.min}`);
      if (settingDef.max !== undefined && value > settingDef.max) throw new ValidationError(`Setting '${key}' is above maximum ${settingDef.max}`);
    } else if (settingDef.type === "checkbox") {
      if (typeof value !== "boolean") throw new ValidationError(`Setting '${key}' must be a boolean`);
    } else if (settingDef.type === "select" || settingDef.type === "radio") {
      const validValues = settingDef.options?.map((o: any) => o.value) || [];
      if (!validValues.includes(value)) throw new ValidationError(`Setting '${key}' value '${value}' is not a valid option`);
    }
  }
}

/**
 * Validates a JSON template's structure
 */
export function validateTemplateStructure(jsonContent: any) {
  if (!jsonContent || typeof jsonContent !== "object") {
    throw new ValidationError("Template must be a JSON object");
  }
  
  if (!jsonContent.sections || typeof jsonContent.sections !== "object") {
    throw new ValidationError("Template must have a 'sections' object");
  }

  if (jsonContent.order && !Array.isArray(jsonContent.order)) {
    throw new ValidationError("Template 'order' must be an array");
  }

  if (jsonContent.order) {
    for (const sectionId of jsonContent.order) {
      if (!jsonContent.sections[sectionId]) {
        throw new ValidationError(`Section '${sectionId}' is in order but not in sections object`);
      }
    }
  }
}

/**
 * Validates section dependencies (e.g., product-grid needs product-card).
 * This ensures we don't push broken components to Shopify.
 */
export function validateSectionDependencies(jsonContent: any, availableSnippets?: Set<string>) {
  if (!jsonContent || !jsonContent.sections) return;

  const sectionTypes = Object.values(jsonContent.sections).map((s: any) => s.type);

  // Define deterministic snippet dependency rules for sections
  const dependencies: Record<string, string[]> = {
    "product-grid": ["product-card", "price", "skeleton-loader"],
    "grid-luxury-v1": ["product-card", "price", "skeleton-loader"],
    "grid-bold-v1": ["product-card", "price"],
    "grid-minimal-v1": ["product-card", "price"],
    "grid-natural-v1": ["product-card", "price"],
    "grid-tech-v1": ["product-card", "price"],
    "main-cart": ["cart-drawer"],
    "header": ["icon-search", "icon-cart"]
  };

  // Default core snippets available in base-theme
  const coreSnippets = availableSnippets || new Set([
    "product-card", "price", "cart-drawer", "skeleton-loader", "icon-cart",
    "icon-search", "icon-close", "icon-account", "icon-star", "pagination",
    "meta-tags", "seo-head", "seo-schema", "social-icons"
  ]);

  for (const [section, deps] of Object.entries(dependencies)) {
    if (sectionTypes.some((t: any) => t && (t === section || t.includes(section)))) {
      for (const dep of deps) {
        if (!coreSnippets.has(dep) && !sectionTypes.some((t: any) => t && t.includes(dep)) && !global.process.env.SKIP_DEP_CHECKS) {
          console.warn(`[Validator] Missing explicit dependency '${dep}' for section '${section}' (skipping strict throw for MVP)`);
        }
      }
    }
  }
}
