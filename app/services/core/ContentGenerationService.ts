import { z } from "zod";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { redis } from "../redis.server.js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface ComponentTextSetting {
  id: string;
  type: string;
  label?: string;
  default?: string;
}

export interface SectionInstance {
  sectionKey: string; // e.g. "index:0:hero-bold-v1"
  pageName: string;
  sectionIndex: number;
  componentId: string;
  settingsSchema: ComponentTextSetting[];
}

export interface ContentGenerationInput {
  shopDomain: string;
  storeName: string;
  industry: string;
  brandArchetype?: string;
  tone?: string;
  blueprint: any; // Active StoreBlueprintData
  catalogSummary: {
    totalProducts: number;
    topCategories: string[];
    priceRange?: string;
    heroProduct?: string;
    topProducts?: string[]; // Top 5-10 actual product titles
  };
}

export interface ContentGenerationResult {
  content: Record<string, Record<string, string>>; // sectionKey -> { settingId -> generatedText }
  isFallback: boolean;
  cached: boolean;
  cacheKey: string;
  error?: string;
}

export function extractBlueprintSectionInstances(
  blueprint: any,
  registryPath = "app/data/templates/theme-engine/registry.json",
  baseDir = "app/data/templates/theme-engine"
): SectionInstance[] {
  const instances: SectionInstance[] = [];
  if (!blueprint || !blueprint.pages) return instances;

  let compList: any[] = [];
  if (fs.existsSync(registryPath)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
      compList = Array.isArray(registry) ? registry : registry.components || [];
    } catch {
      compList = [];
    }
  }

  const getSchemaForComponent = (compId: string): ComponentTextSetting[] => {
    const compMeta = compList.find((c: any) => c.componentId === compId);
    if (!compMeta?.liquidPath) return [];

    const fullPath = path.join(baseDir, compMeta.liquidPath);
    if (!fs.existsSync(fullPath)) return [];

    try {
      const liquid = fs.readFileSync(fullPath, "utf-8");
      const match = liquid.match(/{% schema %}([\s\S]*?){% endschema %}/);
      if (!match) return [];

      const parsed = JSON.parse(match[1]);
      return (parsed.settings || [])
        .filter((s: any) => ["text", "richtext", "inline_richtext", "textarea", "html", "liquid"].includes(s.type))
        .map((s: any) => ({
          id: s.id,
          type: s.type,
          label: s.label,
          default: s.default
        }));
    } catch {
      return [];
    }
  };

  for (const [pageName, pageData] of Object.entries(blueprint.pages)) {
    const sections = (pageData as any).sections;
    if (!Array.isArray(sections)) continue;

    sections.forEach((section: any, idx: number) => {
      const compId = section.componentId;
      if (!compId) return;

      const settingsSchema = getSchemaForComponent(compId);
      if (settingsSchema.length > 0) {
        instances.push({
          sectionKey: `${pageName}:${idx}:${compId}`,
          pageName,
          sectionIndex: idx,
          componentId: compId,
          settingsSchema
        });
      }
    });
  }

  return instances;
}

export function buildDynamicZodSchema(instances: SectionInstance[]): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const instance of instances) {
    const compShape: Record<string, z.ZodTypeAny> = {};
    for (const setting of instance.settingsSchema) {
      let maxLen = 180;
      if (setting.type === "textarea" || setting.id.includes("subheading") || setting.id.includes("description") || setting.id.includes("subtitle") || setting.id.includes("subtext")) {
        maxLen = 300;
      } else if (setting.id.includes("heading") || setting.id.includes("title")) {
        maxLen = 80;
      } else if (setting.id.includes("button") || setting.id.includes("label") || setting.id.includes("cta")) {
        maxLen = 35;
      }

      compShape[setting.id] = z.string().min(1, `Field ${setting.id} is required`).max(maxLen);
    }
    shape[instance.sectionKey] = z.object(compShape);
  }

  return z.object(shape);
}

export function getNicheFallbackContent(
  instances: SectionInstance[],
  industry: string
): Record<string, Record<string, string>> {
  const nicheKey = industry.toLowerCase().trim();

  const nicheDictionary: Record<
    string,
    { heading: string; subheading: string; cta: string; title: string }
  > = {
    beauty: {
      heading: "Mindful Indian Beauty & Skincare",
      subheading: "Crafted for Indian beauty rituals. Pure ingredients, conscious formulations.",
      cta: "Explore Skincare",
      title: "Festive & Daily Rituals"
    },
    jewellery: {
      heading: "Handcrafted Heritage & Contemporary Elegance",
      subheading: "Timeless craftsmanship for modern Indian celebrations.",
      cta: "Explore Jewels",
      title: "Featured Adornments"
    },
    fashion: {
      heading: "Effortless Indian & Western Silhouettes",
      subheading: "Tailored luxury in breathable natural fabrics. Perfect fit guaranteed across India.",
      cta: "Shop New Arrivals",
      title: "Trending Edits"
    },
    default: {
      heading: "Curated Excellence Across India",
      subheading: "Discover premium quality crafted for daily elegance. Fast Pan-India shipping with UPI & COD.",
      cta: "Explore Collection",
      title: "Featured Picks"
    }
  };

  const copy = nicheDictionary[nicheKey] || nicheDictionary.default;
  const result: Record<string, Record<string, string>> = {};

  for (const instance of instances) {
    result[instance.sectionKey] = {};
    for (const setting of instance.settingsSchema) {
      if (setting.id.includes("subheading") || setting.id.includes("description")) {
        result[instance.sectionKey][setting.id] = copy.subheading;
      } else if (setting.id === "heading" || setting.id.includes("title")) {
        result[instance.sectionKey][setting.id] =
          setting.id === "title" ? copy.title : copy.heading;
      } else if (
        setting.id.includes("button") ||
        setting.id.includes("cta") ||
        setting.id.includes("label")
      ) {
        result[instance.sectionKey][setting.id] = copy.cta;
      } else {
        result[instance.sectionKey][setting.id] = setting.default || copy.heading;
      }
    }
  }

  return result;
}

async function defaultClaudeCaller(userPrompt: string, systemPrompt: string): Promise<string> {
  if (!anthropic) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  // No `temperature`. The current models reject it outright —
  // `400 invalid_request_error: temperature is deprecated for this model` —
  // and because this call is wrapped in a 3-attempt retry, the failure was
  // invisible except as a fallback to niche copy, which does not fill
  // testimonial names or social handles. The schema defaults then rendered:
  // "Jane Doe", "Eleanor Vance", "@yourbrand".
  const msg = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }]
  });

  const textOutput = msg.content[0].type === "text" ? msg.content[0].text : "{}";
  console.log("[ContentGenerationService] Raw Claude JSON output:", textOutput);
  return textOutput;
}

export class ContentGenerationService {
  static async generateStoreContent(
    input: ContentGenerationInput,
    llmCaller?: (prompt: string, systemPrompt: string) => Promise<string>
  ): Promise<ContentGenerationResult> {
    const caller = llmCaller || defaultClaudeCaller;
    const sectionInstances = extractBlueprintSectionInstances(input.blueprint);
    if (sectionInstances.length === 0) {
      return {
        content: {},
        isFallback: false,
        cached: false,
        cacheKey: "empty"
      };
    }

    const dynamicZodSchema = buildDynamicZodSchema(sectionInstances);

    const schemaDigest = sectionInstances
      .map((i) => `${i.sectionKey}:${i.settingsSchema.map((s) => s.id).join(",")}`)
      .join("|");

    const payloadHash = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          shop: input.shopDomain,
          industry: input.industry,
          schemaDigest
        })
      )
      .digest("hex");

    const cacheKey = `content:${input.shopDomain}:${payloadHash}`;

    try {
      const cachedJson = await redis.get(cacheKey);
      if (cachedJson) {
        console.log(`[ContentGenerationService] 🟢 Cache hit for ${input.shopDomain}`);
        return {
          content: JSON.parse(cachedJson),
          isFallback: false,
          cached: true,
          cacheKey
        };
      }
    } catch (e) {}

    const schemaInstructions = sectionInstances
      .map((inst) => {
        const fields = inst.settingsSchema
          .map((s) => `"${s.id}": string (${s.label || s.id})`)
          .join(", ");
        return `- "${inst.sectionKey}" (Component: ${inst.componentId}): { ${fields} }`;
      })
      .join("\n");

    const systemPrompt = `You are an expert Indian D2C E-commerce Copywriter.
Write high-converting, culturally polished copy tailored for Indian shoppers (Pan-India trust, UPI/COD comfort, Indian English elegance).

CRITICAL CHARACTER LENGTH CONSTRAINTS (MANDATORY):
- Any heading or title field: STRICT MAXIMUM 60 characters. Keep them short, punchy, and high-impact.
- Any subheading or description field: STRICT MAXIMUM 140 characters. Concise and culturally relevant.
- Any button or CTA label field: STRICT MAXIMUM 25 characters. Action-oriented (e.g., "Shop Bestsellers").

CRITICAL ARCHITECTURAL REQUIREMENT:
You MUST return a JSON object keyed strictly by the exact section instance keys ("pageName:index:componentId") and setting IDs provided below.
Do not omit any section key or any setting ID. Every field is REQUIRED.

REQUIRED SECTION INSTANCE SHAPE:
{
${schemaInstructions}
}

RETURN ONLY RAW VALID JSON matching this exact structure. Do not wrap in markdown tags.`;

    const productList =
      input.catalogSummary.topProducts && input.catalogSummary.topProducts.length > 0
        ? input.catalogSummary.topProducts.slice(0, 10).join(", ")
        : "Curated collection items";

    const userPrompt = `Store Name: ${input.storeName}
Industry/Niche: ${input.industry}
Brand Archetype: ${input.brandArchetype || "Modern Classic"}
Tone: ${input.tone || "Elegant"}
Catalog Summary:
- Total Products: ${input.catalogSummary.totalProducts}
- Top Categories: ${input.catalogSummary.topCategories.join(", ")}
- Price Range: ${input.catalogSummary.priceRange || "Mid to Premium"}
- Hero Product: ${input.catalogSummary.heroProduct || "Featured Item"}
- Actual Top Products: ${productList}

Generate specific, distinct Indian D2C copy for every required section instance.`;

    let lastError: any = null;
    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      console.log(`[ContentGenerationService] Attempt ${attempt}/${MAX_ATTEMPTS} for ${input.shopDomain}`);
      try {
        const rawResponse = await caller(userPrompt, systemPrompt);
        const cleanedJson = rawResponse.replace(/```json\n?|\n?```/g, "").trim();
        const parsedData = JSON.parse(cleanedJson);

        const validContent = dynamicZodSchema.parse(parsedData);

        try {
          await redis.set(cacheKey, JSON.stringify(validContent), "EX", 86400 * 7);
        } catch {}

        console.log(`[ContentGenerationService] 🟢 SUCCESS on attempt ${attempt}`);
        return {
          content: validContent,
          isFallback: false,
          cached: false,
          cacheKey
        };
      } catch (error: any) {
        lastError = error;
        console.warn(`[ContentGenerationService] ⚠️ Attempt ${attempt} failed: ${error?.message || error}`);
      }
    }

    console.error(`[ContentGenerationService] 🔴 All ${MAX_ATTEMPTS} attempts failed. Falling back to Niche Copy.`);
    const fallbackContent = getNicheFallbackContent(sectionInstances, input.industry);

    return {
      content: fallbackContent,
      isFallback: true,
      cached: false,
      cacheKey,
      error: lastError?.message || "Generation and retry attempts failed"
    };
  }

  private static schemaKeyCache: Record<string, { allKeys: Set<string>, assetKeys: Set<string> }> = {};

  static async injectContentIntoBlueprint(
    blueprint: any,
    generatedContent: Record<string, Record<string, string>>,
    resolvedSections: any[] = []
  ): Promise<any> {
    if (!blueprint || !blueprint.pages) return blueprint;

    const baseDir = "app/data/templates/theme-engine";

    for (const [pageName, pageData] of Object.entries(blueprint.pages)) {
      const sections = (pageData as any).sections;
      if (!Array.isArray(sections)) continue;

      for (let idx = 0; idx < sections.length; idx++) {
        const section = sections[idx];
        const compId = section.componentId;
        if (!compId) continue;

        const sectionKey = `${pageName}:${idx}:${compId}`;
        if (generatedContent[sectionKey]) {
          
          if (!this.schemaKeyCache[compId]) {
             const compMeta = resolvedSections.find(c => c.componentId === compId);
             let allKeys = new Set<string>();
             let assetKeys = new Set<string>();
             
             if (compMeta?.liquidPath) {
                const fullPath = path.join(baseDir, compMeta.liquidPath);
                if (fs.existsSync(fullPath)) {
                   const liquid = fs.readFileSync(fullPath, "utf-8");
                   const match = liquid.match(/{% schema %}([\s\S]*?){% endschema %}/);
                   if (match) {
                      try {
                         const parsed = JSON.parse(match[1]);
                         
                         (parsed.settings || []).forEach((s: any) => {
                            if (s.id) {
                               allKeys.add(s.id);
                               if (["image_picker", "video", "url", "video_url"].includes(s.type)) {
                                  assetKeys.add(s.id);
                               }
                            }
                         });
                         
                         (parsed.blocks || []).forEach((b: any) => {
                            (b.settings || []).forEach((s: any) => {
                               if (s.id) {
                                  allKeys.add(s.id);
                                  if (["image_picker", "video", "url", "video_url"].includes(s.type)) {
                                     assetKeys.add(s.id);
                                  }
                               }
                            });
                         });
                      } catch(e) {}
                   }
                }
             }
             this.schemaKeyCache[compId] = { allKeys, assetKeys };
          }
          
          const { allKeys, assetKeys } = this.schemaKeyCache[compId];

          const safeContent: Record<string, any> = {};
          const RICHTEXT_KEYS = ["subtext", "quote", "richtext", "content"];
          const isBrandStory = compId.includes("story") || compId.includes("brand-story");
          
          for (const [k, v] of Object.entries(generatedContent[sectionKey])) {
            
            if (allKeys.size > 0 && !allKeys.has(k)) {
                throw new Error(`OrphanKeyError: AI generated key "${k}" not found in schema for section "${compId}"`);
            }
            
            if (allKeys.size > 0 && assetKeys.has(k)) {
                throw new Error(`AssetFieldViolation: AI attempted to generate content for asset field "${k}" in "${compId}"`);
            }
            if (typeof v === "string" && (v.includes("http://") || v.includes("https://"))) {
                throw new Error(`DomainLeakageError: AI generated an external URL in field "${k}" for "${compId}"`);
            }
            
            // NEW: Compliance Guard for fabricated reviews/ratings (cache-path validation)
            if (typeof v === "string" && (v.toLowerCase().includes("verified review") || v.toLowerCase().includes("verified buyer"))) {
                throw new Error(`ComplianceError: AI generated fabricated review count "${v}" in field "${k}" for "${compId}"`);
            }

            if (!k.endsWith("_url") && !k.endsWith("_link") && !k.includes("image") && !k.includes("video") && !k.includes("avatar") && !k.includes("logo")) {
              if (typeof v === "string" && v.trim().length > 0 && (RICHTEXT_KEYS.includes(k) || (isBrandStory && k === "text"))) {
                safeContent[k] = /^\s*<(p|ul|ol|h[1-6])/i.test(v) ? v : `<p>${v.trim()}</p>`;
              } else {
                safeContent[k] = v;
              }
            }
          }
          section.settings = {
            ...(section.settings || {}),
            ...safeContent
          };
        }
      }
    }

    return blueprint;
  }
}
