import { json } from "@remix-run/node";
import prisma from "../db.server";

/**
 * POST /api/review-generate
 * Generates a polished review using Claude API based on customer answers.
 * Public route — called from the review form page (no admin auth needed).
 */
export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { rating, productName, productCategory, q1Answer, q2Answer, q3Answer, reviewRequestId } = await request.json();

    if (!rating || !productName) {
      return json({ error: "rating and productName are required" }, { status: 400 });
    }

    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return json({ error: "AI service not configured" }, { status: 503 });
    }

    // Build the prompt based on customer answers
    const customerContext = [
      q1Answer ? `What they liked most: ${q1Answer}` : null,
      q2Answer ? `How they use it: ${q2Answer}` : null,
      q3Answer ? `Who they'd recommend it to: ${q3Answer}` : null,
    ].filter(Boolean).join("\n");

    const systemPrompt = `You are a helpful assistant that writes authentic-sounding product reviews based on a customer's brief answers. The review should:
1. Sound natural and genuine — like a real customer wrote it
2. Be 2-4 sentences long
3. Mention specific details from the customer's answers
4. Match the star rating tone (5 stars = enthusiastic, 3 stars = balanced, 1 star = disappointed)
5. Never use marketing language or hyperbole
6. Never mention being AI-generated
Return ONLY the review text, nothing else.`;

    const userPrompt = `Product: ${productName}${productCategory ? ` (${productCategory})` : ''}
Rating: ${rating}/5 stars
Customer feedback:
${customerContext || 'No specific feedback provided'}

Write a natural product review based on this:`;

    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 256,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!claudeResp.ok) {
      const errText = await claudeResp.text();
      console.error("Claude API error:", claudeResp.status, errText);

      // Handle rate limiting
      if (claudeResp.status === 429) {
        return json({ error: "AI service is busy. Please try again in a moment." }, { status: 429 });
      }
      return json({ error: "Failed to generate review" }, { status: 500 });
    }

    const claudeData = await claudeResp.json();
    const reviewText = claudeData?.content?.[0]?.text?.trim() || "";

    if (!reviewText) {
      return json({ error: "AI returned empty response" }, { status: 500 });
    }

    // If a reviewRequestId was provided, update the review request record
    if (reviewRequestId) {
      try {
        await prisma.reviewRequest.update({
          where: { id: reviewRequestId },
          data: {
            generatedReview: reviewText,
            status: "completed",
            completedAt: new Date(),
          },
        });
      } catch (dbErr) {
        console.error("Failed to update review request:", dbErr);
        // Don't fail the request if DB update fails
      }
    }

    return json({ review: reviewText });
  } catch (error) {
    console.error("Review generation error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
