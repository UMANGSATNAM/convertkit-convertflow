import { json } from "@remix-run/node";
import { generateReview } from "../lib/gemini.server.js";

/**
 * POST /api/review-generate
 * Generates a polished review using Google Gemini API.
 * Called from app.reviews.jsx via fetcher.submit (FormData).
 */
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();

    const starRating = parseInt(formData.get("starRating")) || 5;
    const productName = formData.get("productName") || "";
    const productCategory = formData.get("productCategory") || "general";
    const answersRaw = formData.get("answers") || "";

    if (!productName) {
      return json({ error: "productName is required" }, { status: 400 });
    }

    // Split answers by pipe delimiter (frontend sends "point1|point2|point3")
    const answers = answersRaw
      .split("|")
      .map((a) => a.trim())
      .filter(Boolean);

    const result = await generateReview({
      starRating,
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
