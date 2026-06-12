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
      throw new ValidationError(`Setting '${key}' does not exist in theme schema`);
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
