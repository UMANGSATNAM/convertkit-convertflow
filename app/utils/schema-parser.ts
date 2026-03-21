/**
 * Shopify Section Schema Parser
 * Extracts and parses {% schema %} blocks from .liquid section files.
 */

/**
 * A single Shopify section setting definition.
 */
export interface ShopifySetting {
  type: string;
  id?: string;
  label?: string;
  default?: string | number | boolean;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  info?: string;
  placeholder?: string;
  content?: string;
}

/**
 * A Shopify section block definition (inside a section schema).
 */
export interface ShopifyBlock {
  type: string;
  name: string;
  limit?: number;
  settings?: ShopifySetting[];
}

/**
 * The fully parsed section schema object.
 */
export interface ParsedSchema {
  name: string;
  class?: string;
  tag?: string;
  limit?: number;
  settings: ShopifySetting[];
  blocks: ShopifyBlock[];
  presets?: Array<{ name: string; blocks?: Array<{ type: string }> }>;
  templates?: string[];
  disabled_on?: { groups?: string[]; templates?: string[] };
  enabled_on?: { groups?: string[]; templates?: string[] };
}

/**
 * Extract the raw JSON string from between {% schema %} and {% endschema %} Liquid tags.
 */
function extractSchemaJson(liquidContent: string): string | null {
  const match = liquidContent.match(
    /\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/
  );
  return match ? match[1].trim() : null;
}

/**
 * Parse a Shopify section .liquid file and return its schema definition.
 * Returns an empty schema if no {% schema %} block is found or if parsing fails.
 */
export function parseShopifySchema(liquidContent: string): ParsedSchema {
  const emptySchema: ParsedSchema = {
    name: "Unknown Section",
    settings: [],
    blocks: [],
  };

  if (!liquidContent) return emptySchema;

  const rawJson = extractSchemaJson(liquidContent);
  if (!rawJson) return emptySchema;

  try {
    const parsed = JSON.parse(rawJson);
    return {
      name: parsed.name || "Untitled Section",
      class: parsed.class || undefined,
      tag: parsed.tag || undefined,
      limit: parsed.limit || undefined,
      settings: Array.isArray(parsed.settings) ? parsed.settings : [],
      blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
      presets: Array.isArray(parsed.presets) ? parsed.presets : undefined,
      templates: Array.isArray(parsed.templates) ? parsed.templates : undefined,
      disabled_on: parsed.disabled_on || undefined,
      enabled_on: parsed.enabled_on || undefined,
    };
  } catch (err) {
    console.error("Schema parse error:", (err as Error).message);
    return emptySchema;
  }
}

/**
 * Human-readable label from a section key like "sections/header.liquid"
 */
export function sectionKeyToLabel(key: string): string {
  return key
    .replace(/^sections\//, "")
    .replace(/\.liquid$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
