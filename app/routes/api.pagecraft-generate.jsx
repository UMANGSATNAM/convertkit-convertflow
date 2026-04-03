import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PAGECRAFT_SYSTEM_PROMPT, buildGenerationPrompt } from "../lib/pagecraft-prompts.server.js";

// Rate limit: track last generation per shop
const lastGeneration = new Map();
const RATE_LIMIT_MS = 15000; // 15 seconds

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Rate limiting
  const lastTime = lastGeneration.get(shopDomain) || 0;
  const now = Date.now();
  if (now - lastTime < RATE_LIMIT_MS) {
    const waitSec = Math.ceil((RATE_LIMIT_MS - (now - lastTime)) / 1000);
    return json({ error: `Please wait ${waitSec} seconds before generating again.` }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { niche, style, storeName, product, whatsapp } = body;

  if (!niche || !style) {
    return json({ error: "niche and style are required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return json({ error: "AI API key not configured. Add GEMINI_API_KEY to .env" }, { status: 500 });
  }

  try {
    lastGeneration.set(shopDomain, now);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = buildGenerationPrompt(niche, style, storeName, product);

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: PAGECRAFT_SYSTEM_PROMPT + "\n\n" + prompt }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();

    let pageData;
    try {
      pageData = JSON.parse(text);
    } catch {
      // Try extracting JSON from possible markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        pageData = JSON.parse(jsonMatch[1]);
      } else {
        // Try finding raw JSON object
        const braceStart = text.indexOf("{");
        const braceEnd = text.lastIndexOf("}");
        if (braceStart !== -1 && braceEnd !== -1) {
          pageData = JSON.parse(text.slice(braceStart, braceEnd + 1));
        } else {
          return json({ error: "AI returned invalid format. Please try again." }, { status: 500 });
        }
      }
    }

    // Validate essential structure
    if (!pageData.sections || !Array.isArray(pageData.sections)) {
      return json({ error: "AI response missing sections array. Please try again." }, { status: 500 });
    }

    // Auto-inject WhatsApp widget section if phone provided
    if (whatsapp && whatsapp.trim()) {
      const hasWA = pageData.sections.some(s => s.type === "whatsapp_widget");
      if (!hasWA) {
        pageData.sections.push({
          type: "whatsapp_widget",
          phone: whatsapp.trim(),
          message: `Hi! I'm interested in your products at ${storeName || "your store"}.`,
          position: "bottom-right",
        });
      }
    }

    // Compute conversion score
    const score = computeConversionScore(pageData.sections);

    return json({
      success: true,
      page: pageData,
      score: score.total,
      scoreBreakdown: score.breakdown,
      improvements: score.improvements,
    });
  } catch (err) {
    console.error("PageCraft generate error:", err);
    lastGeneration.delete(shopDomain);
    return json({ error: "Page generation failed. Please try again." }, { status: 500 });
  }
};

function computeConversionScore(sections) {
  const breakdown = [];
  let total = 0;

  const checks = [
    { name: "Hero Section", test: () => sections.some(s => s.type === "hero"), points: 15 },
    { name: "CTA Above Fold", test: () => { const h = sections.find(s => s.type === "hero"); return h && h.cta_text; }, points: 15 },
    { name: "Trust Badges", test: () => sections.some(s => s.type === "trust_badges"), points: 10 },
    { name: "Social Proof", test: () => sections.some(s => s.type === "social_proof"), points: 10 },
    { name: "FAQ Section", test: () => sections.some(s => s.type === "faq"), points: 10 },
    { name: "Urgency Element", test: () => sections.some(s => s.type === "urgency_bar"), points: 10 },
    { name: "Product Showcase", test: () => sections.some(s => s.type === "product_showcase"), points: 10 },
    { name: "Mobile Responsive", test: () => true, points: 10 }, // PageCraft sections are always responsive
    { name: "Single Primary CTA", test: () => { const ctas = sections.filter(s => s.cta_text); return ctas.length >= 1; }, points: 5 },
    { name: "Footer Present", test: () => sections.some(s => s.type === "footer"), points: 5 },
  ];

  for (const check of checks) {
    const passed = check.test();
    breakdown.push({ name: check.name, passed, points: passed ? check.points : 0, maxPoints: check.points });
    if (passed) total += check.points;
  }

  const fixTypeMap = {
    "Hero Section": "add_hero",
    "Trust Badges": "add_trust",
    "Social Proof": "add_social",
    "FAQ Section": "add_faq",
    "Urgency Element": "add_urgency",
    "WhatsApp Widget": "add_whatsapp",
  };

  const improvements = [];
  for (const item of breakdown) {
    if (!item.passed) {
      improvements.push({
        text: `Add ${item.name.toLowerCase()} — worth +${item.maxPoints} points`,
        fixType: fixTypeMap[item.name] || null,
      });
    }
  }

  return { total, breakdown, improvements };
}
