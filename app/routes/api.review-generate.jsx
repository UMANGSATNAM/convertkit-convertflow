import { json } from "@remix-run/node";
import { generateReview } from "../lib/gemini.server.js";
import { rateLimit, truncate } from "../utils/security.server";

/**
 * POST /api/review-generate
 * Generates a polished review using Google Gemini API.
 * Rate limited: 10 requests per minute per IP.
 */
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(`review:${ip}`, 10, 60_000);
  if (!allowed) {
    return json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  try {
    const formData = await request.formData();

    const starRating = parseInt(formData.get("starRating")) || 5;
    const productName = truncate(formData.get("productName") || "", 200);
    const productCategory = truncate(formData.get("productCategory") || "general", 100);
    const answersRaw = truncate(formData.get("answers") || "", 1000);

    if (!productName) {
      return json({ error: "productName is required" }, { status: 400 });
    }

    const answers = answersRaw
      .split("|")
      .map((a) => a.trim())
      .filter(Boolean);

    const result = await generateReview({
      starRating: Math.min(Math.max(starRating, 1), 5),
      productName,
      productCategory,
      answers,
    });

    if (result.error) {
      return json({ error: result.error }, { status: 503 });
    }

    return json({ review: result.review });
  } catch (error) {
    console.error("Review generation error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
