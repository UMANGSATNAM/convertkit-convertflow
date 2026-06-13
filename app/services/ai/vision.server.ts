import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

export interface ExtractedStoreData {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  sections: Array<{
    type: string;
    content?: any;
  }>;
}

const SYSTEM_PROMPT = `
You are an expert Shopify Theme Architect and UI/UX Designer.
Your task is to analyze a screenshot of an eCommerce store and extract its complete visual identity and layout structure.

You must return ONLY a JSON object matching this schema:
{
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "background": "#HEX",
    "text": "#HEX"
  },
  "typography": {
    "headingFont": "font name",
    "bodyFont": "font name"
  },
  "sections": [
    {
      "type": "header" | "hero_banner" | "image_with_text" | "featured_collection" | "rich_text" | "multicolumn" | "footer",
      "content": {
        // any specific text, alignment, or settings observed in this section
      }
    }
  ]
}

Guidelines:
1. Analyze the exact layout from top to bottom and map them to the available section types.
2. Extract the exact hex codes for colors.
3. Guess the closest Google Font for typography.
`;

export async function analyzeStoreScreenshot(base64Image: string, mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg"): Promise<ExtractedStoreData> {
  if (!anthropic) {
    throw new Error("Anthropic API key is not configured.");
  }

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: "text",
            text: "Extract the layout and styling of this store into the requested JSON schema."
          }
        ],
      }
    ]
  });

  const textOutput = response.content.find(block => block.type === 'text')?.text || "{}";
  
  try {
    // Attempt to parse out any markdown JSON blocks if Claude included them
    const jsonMatch = textOutput.match(/```json\n([\s\S]*?)\n```/) || textOutput.match(/```\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : textOutput;
    return JSON.parse(jsonString) as ExtractedStoreData;
  } catch (error) {
    console.error("Failed to parse Claude output as JSON:", textOutput);
    throw new Error("AI failed to return valid JSON structure.");
  }
}
