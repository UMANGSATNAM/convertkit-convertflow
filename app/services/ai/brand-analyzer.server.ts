import { CatalogContext } from "./catalog-analyzer.server";
import { VisualContext } from "./visual-analyzer.server";
import { generateStructuredJson } from "./claude.server";

export interface BrandContext {
  brand_archetype: string;
  tone: string;
  visual_direction: string;
  trust_level: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  theme_tokens: {
    button_style: string;
    card_style: string;
    section_density: string;
    image_ratio: string;
    animation_level: string;
  };
}

const VALID_ARCHETYPES = [
  "modern_minimal",
  "editorial_luxury",
  "playful_modern",
  "technical_performance",
  "heritage_classic",
  "bold_lifestyle",
  "natural_organic",
  "artisan_handcrafted"
];

/**
 * Analyzes brand aesthetics with prioritized inputs (Phases 2 & 3).
 * Uses Anthropic Claude to determine the Business Architect profile and Brand System tokens
 * based on the catalog's metadata and visual asset context.
 */
export async function analyzeBrand(catalogData: CatalogContext, visualData: VisualContext, shopDomain: string): Promise<BrandContext> {
  
  const systemInstruction = `
    You are a Senior Brand Architect for an Elite Shopify Agency.
    Your job is to determine the exact brand identity and design system tokens based on the store's catalog and visual assets.
    
    You must output ONLY valid JSON matching this exact schema:
    {
      "brand_archetype": "string",
      "tone": "string (e.g., premium, approachable, clinical, aggressive)",
      "visual_direction": "string (e.g., editorial, flat, vibrant, muted)",
      "trust_level": "string (e.g., high, standard)",
      "theme_tokens": {
        "button_style": "string (e.g., rounded, pill, sharp)",
        "card_style": "string (e.g., soft, bordered, minimal)",
        "section_density": "string (e.g., airy, tight, standard)",
        "image_ratio": "string (e.g., portrait, square, landscape, mixed)",
        "animation_level": "string (e.g., high, medium, none)"
      },
      "colors": {
        "primary": "string (hex code)",
        "secondary": "string (hex code)",
        "accent": "string (hex code)"
      },
      "typography": {
        "heading": "string (e.g., Playfair, Inter, Roboto, Outfit)",
        "body": "string (e.g., Inter, Roboto, system-ui)"
      }
    }

    CRITICAL RULE: "brand_archetype" MUST BE EXACTLY ONE OF THESE VALUES:
    - modern_minimal
    - editorial_luxury
    - playful_modern
    - technical_performance
    - heritage_classic
    - bold_lifestyle
    - natural_organic
    - artisan_handcrafted
    
    Any other value for brand_archetype will break the ranking engine. Pick the absolute best match.
  `;

  const userPrompt = JSON.stringify({
    shopDomain,
    catalogContext: catalogData,
    visualContext: visualData
  });

  let aiResult = {
    brand_archetype: "modern_minimal",
    tone: "premium",
    visual_direction: "editorial",
    trust_level: "high",
    theme_tokens: {
      button_style: "rounded",
      card_style: "soft",
      section_density: "airy",
      image_ratio: "portrait",
      animation_level: "medium"
    },
    colors: {
      primary: "#111111",
      secondary: "#F5F5F5",
      accent: "#C9A227"
    },
    typography: {
      heading: "Inter",
      body: "Inter"
    }
  };

  try {
    const result = await generateStructuredJson<typeof aiResult>(systemInstruction, userPrompt);
    
    if (result && result.brand_archetype) {
      aiResult = result;
    }
    
    // Ensure the archetype is one of our supported ones (deterministic safeguard)
    if (!VALID_ARCHETYPES.includes(aiResult.brand_archetype)) {
      console.warn("Claude hallucinated archetype:", aiResult.brand_archetype, "- falling back to modern_minimal");
      aiResult.brand_archetype = "modern_minimal";
    }
  } catch (err) {
    console.error("Claude failed in brand analyzer, falling back to defaults.", err);
  }

  return aiResult;
}
