import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { generateReview } from "../lib/gemini.server";

/**
 * API Route: /api/review-generate
 * Generates an AI-assisted product review using Gemini API.
 *
 * POST { starRating, productName, productCategory, answers[] }
 *   → returns { review: "..." }
 */

export const action = async ({ request }) => {
  await authenticate.admin(request);

  const formData = await request.formData();
  const starRating = parseInt(formData.get("starRating"), 10) || 5;
  const productName = formData.get("productName") || "Product";
  const productCategory = formData.get("productCategory") || "";
  const answersRaw = formData.get("answers") || "";

  const answers = answersRaw
    .split("|")
    .map((a) => a.trim())
    .filter(Boolean);

  if (!productName) {
    return json({ error: "Product name is required" }, { status: 400 });
  }

  const result = await generateReview({
    starRating,
    productName,
    productCategory,
    answers: answers.length > 0 ? answers : ["I liked this product"],
  });

  if (result.error) {
    return json({ error: result.error, review: result.review }, { status: 422 });
  }

  return json({ review: result.review });
};
