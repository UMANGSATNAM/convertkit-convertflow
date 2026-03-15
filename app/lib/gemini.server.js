/**
 * Gemini API Server Wrapper
 * Uses @google/generative-ai SDK for AI review generation.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

let genAI = null;

function getClient() {
  if (!genAI && GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Generate an AI-assisted product review draft.
 *
 * @param {Object} params
 * @param {number} params.starRating - 1 to 5
 * @param {string} params.productName
 * @param {string} params.productCategory - e.g. "skincare", "electronics"
 * @param {string[]} params.answers - answers to guided questions
 * @returns {Promise<{ review: string, error?: string }>}
 */
export async function generateReview({
  starRating,
  productName,
  productCategory,
  answers,
}) {
  const client = getClient();
  if (!client) {
    return {
      review: "",
      error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.",
    };
  }

  const systemPrompt = `You are helping a real customer write a product review. The review must sound like a genuine human wrote it. No marketing language. No superlatives like 'amazing' or 'life-changing'. Use simple, conversational language. First person. 40 to 120 words. Do not mention the brand name more than once.`;

  const userPrompt = `Product: ${productName}
Category: ${productCategory || "general"}
Star Rating: ${starRating}/5
Customer's notes: ${answers.join(". ")}

Write a natural-sounding product review based on the above information. The review should be in first person, conversational, and between 40-120 words.`;

  try {
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

    return { review: text.trim() };
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return {
      review: "",
      error: `AI generation failed: ${err.message}`,
    };
  }
}
