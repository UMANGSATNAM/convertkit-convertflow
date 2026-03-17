/**
 * ConvertFlow Liquid Extraction Engine
 * Fetches theme files via Shopify Admin REST API, parses section .liquid files,
 * and processes extracted code with Gemini AI.
 */

import { getClient } from "./gemini.server.js";

// ─── Shopify Theme REST API helpers ───

/**
 * List all themes for the authenticated shop.
 */
export async function listThemes(admin) {
  const response = await admin.rest.get({ path: "themes" });
  const body = await response.json();
  return (body.themes || []).map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    previewable: t.previewable,
    updated_at: t.updated_at,
  }));
}

/**
 * List section files (sections/*.liquid) inside a theme.
 */
export async function listThemeSections(admin, themeId) {
  const response = await admin.rest.get({
    path: `themes/${themeId}/assets`,
  });
  const body = await response.json();
  const assets = body.assets || [];

  return assets
    .filter((a) => a.key.startsWith("sections/") && a.key.endsWith(".liquid"))
    .map((a) => ({
      key: a.key,
      name: a.key.replace("sections/", "").replace(".liquid", ""),
      size: a.size,
      updated_at: a.updated_at,
    }));
}

/**
 * Fetch a single asset's content from a theme.
 */
export async function fetchAsset(admin, themeId, assetKey) {
  const response = await admin.rest.get({
    path: `themes/${themeId}/assets`,
    query: { "asset[key]": assetKey },
  });
  const body = await response.json();
  return body.asset?.value || "";
}

// ─── Liquid Parser ───

/**
 * Parse a section .liquid file into its component parts:
 * - liquid: the template markup
 * - css: content inside {% stylesheet %} or {% style %} or <style> tags
 * - schema: content inside {% schema %} tags (JSON)
 */
export function parseSectionFile(content) {
  let liquid = content;
  let css = "";
  let schema = "";

  // Extract {% schema %} block
  const schemaMatch = content.match(
    /\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/
  );
  if (schemaMatch) {
    schema = schemaMatch[1].trim();
    liquid = liquid.replace(schemaMatch[0], "").trim();
  }

  // Extract {% stylesheet %} block
  const stylesheetMatch = content.match(
    /\{%-?\s*stylesheet\s*-?%\}([\s\S]*?)\{%-?\s*endstylesheet\s*-?%\}/
  );
  if (stylesheetMatch) {
    css = stylesheetMatch[1].trim();
    liquid = liquid.replace(stylesheetMatch[0], "").trim();
  }

  // Extract {% style %} block
  const styleTagMatch = content.match(
    /\{%-?\s*style\s*-?%\}([\s\S]*?)\{%-?\s*endstyle\s*-?%\}/
  );
  if (styleTagMatch && !css) {
    css = styleTagMatch[1].trim();
    liquid = liquid.replace(styleTagMatch[0], "").trim();
  }

  // Extract <style> tags
  const htmlStyleMatch = content.match(
    /<style[^>]*>([\s\S]*?)<\/style>/i
  );
  if (htmlStyleMatch && !css) {
    css = htmlStyleMatch[1].trim();
    liquid = liquid.replace(htmlStyleMatch[0], "").trim();
  }

  return { liquid, css, schema };
}

// ─── Gemini AI Processing ───

/**
 * Process extracted section code with Gemini AI.
 * Cleans up Liquid, converts CSS to BEM, and validates JSON schema.
 */
export async function processWithGemini(rawLiquid, rawCSS, rawSchema) {
  const client = getClient();
  if (!client) {
    return {
      processedLiquid: rawLiquid,
      processedCSS: rawCSS,
      processedSchema: rawSchema,
      error: "Gemini API key not configured. Returning raw code.",
    };
  }

  const systemPrompt = `You are a Shopify theme expert. You process extracted Liquid section code into clean, production-ready components. Follow these rules strictly:
1. Liquid: Keep all Liquid tags functional. Remove unnecessary whitespace. Ensure proper indentation (2 spaces). Remove any inline styles and move them to CSS.
2. CSS: Convert all class names to BEM methodology (block__element--modifier). Scope all styles under a unique section class. Use CSS custom properties where appropriate.
3. Schema: Validate the JSON schema. Ensure all settings have proper types, labels, and defaults. Fix any JSON syntax errors.
4. Return ONLY a JSON object with exactly three keys: "liquid", "css", "schema". No markdown fences, no explanation.`;

  const userPrompt = `Process this Shopify section:

=== LIQUID ===
${rawLiquid}

=== CSS ===
${rawCSS || "(no CSS found)"}

=== SCHEMA ===
${rawSchema || "(no schema found)"}

Return a JSON object with keys: "liquid", "css", "schema" containing the cleaned, production-ready code.`;

  try {
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    let text = result.response.text().trim();

    // Strip markdown fences if Gemini wraps in ```json
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    const parsed = JSON.parse(text);
    return {
      processedLiquid: parsed.liquid || rawLiquid,
      processedCSS: parsed.css || rawCSS,
      processedSchema: parsed.schema || rawSchema,
    };
  } catch (err) {
    console.error("ConvertFlow Gemini processing error:", err.message);
    return {
      processedLiquid: rawLiquid,
      processedCSS: rawCSS,
      processedSchema: rawSchema,
      error: `AI processing failed: ${err.message}`,
    };
  }
}

/**
 * Push a component to a Shopify theme via the Assets API.
 * Combines liquid, css, and schema into a complete section file.
 */
export async function pushToTheme(admin, themeId, sectionKey, liquid, css, schema) {
  let fileContent = liquid;

  if (css) {
    fileContent += `\n\n{% stylesheet %}\n${css}\n{% endstylesheet %}`;
  }

  if (schema) {
    fileContent += `\n\n{% schema %}\n${schema}\n{% endschema %}`;
  }

  const response = await admin.rest.put({
    path: `themes/${themeId}/assets`,
    data: {
      asset: {
        key: sectionKey.startsWith("sections/") ? sectionKey : `sections/${sectionKey}.liquid`,
        value: fileContent,
      },
    },
  });

  const body = await response.json();
  return body;
}
