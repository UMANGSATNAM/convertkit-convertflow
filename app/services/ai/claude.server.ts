import Anthropic from "@anthropic-ai/sdk";

// Ensure the API key is provided
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("WARNING: ANTHROPIC_API_KEY is not set. AI features will fail.");
}

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "", 
});

/**
 * Helper to call Claude and ensure the output is structured JSON.
 * Uses claude-sonnet-4-6 as the fast default model.
 * 
 * @param systemInstruction The system prompt instructing the model on its persona and JSON schema.
 * @param userPrompt The actual data/prompt to process.
 * @returns A parsed JSON object.
 */
export async function generateStructuredJson<T>(
  systemInstruction: string,
  userPrompt: string,
  /**
   * Raise this when the reply is a list. A truncated response fails
   * `JSON.parse`, and every caller here swallows that into a fallback, so the
   * only symptom is quietly worse output rather than an error.
   */
  maxTokens: number = 2048
): Promise<T> {
  try {
    const msg = await anthropic.messages.create({
      // Kept in step with ContentGenerationService — a stale default here means
      // brand and catalogue analysis silently fall back while copy generation
      // works, which is hard to spot from the outside.
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      // 1024 was not enough for any caller that returns a list. Image
      // classification asks for 25 objects and the reply was cut off mid-string
      // at position 2097, so `JSON.parse` threw "Unterminated string" and the
      // service silently fell back to heuristics — which label almost everything
      // `product_cutout`, so heroes and lifestyle slots got product shots.
      max_tokens: maxTokens,
      // `temperature` is rejected by current models, and every call here is
      // inside a try/catch that returns a fallback, so passing it turned this
      // into a silent no-op.
      system: `${systemInstruction}\n\nCRITICAL: You MUST output ONLY valid JSON. Do not wrap it in markdown block quotes (e.g. \`\`\`json). Just the raw JSON.`,
      messages: [
        { role: "user", content: userPrompt }
      ]
    });

    // Claude returns an array of content blocks. We expect the first to be text.
    let responseText = msg.content[0].type === "text" ? msg.content[0].text : "";
    
    if (!responseText) {
      throw new Error("Claude returned an empty response.");
    }

    // Clean up potential markdown formatting if Claude disobeys
    responseText = responseText.replace(/^```json/, "").replace(/```$/, "").trim();

    return JSON.parse(responseText) as T;
  } catch (error) {
    console.error("Claude API Error:", error);
    throw new Error("Failed to generate structured JSON from Claude.");
  }
}
