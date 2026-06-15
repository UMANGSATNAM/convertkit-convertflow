import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const generationId = formData.get("generationId") as string;
  const ratingStr = formData.get("rating") as string;
  const notes = formData.get("notes") as string | null;

  if (!generationId || !ratingStr) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const rating = parseInt(ratingStr, 10);
  
  try {
    const feedback = await prisma.merchantFeedback.create({
      data: {
        generationId,
        rating,
        notes
      }
    });
    
    return json({ success: true, feedbackId: feedback.id });
  } catch (error: any) {
    console.error("Error saving feedback:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
