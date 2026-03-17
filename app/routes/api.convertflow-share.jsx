import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import crypto from "crypto";

/**
 * POST /api/convertflow-share
 * Body: { libraryItemId }
 * Generates a share token for a library item.
 *
 * GET /api/convertflow-share?token=X
 * Retrieves a shared library item (public, no auth needed).
 */

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return json({ error: "Token is required" }, { status: 400 });
  }

  const item = await prisma.libraryItem.findFirst({
    where: {
      shareToken: token,
      isPublic: true,
    },
  });

  if (!item) {
    return json({ error: "Shared component not found or expired" }, { status: 404 });
  }

  // Check expiration
  if (item.shareExpiresAt && new Date(item.shareExpiresAt) < new Date()) {
    return json({ error: "Share link has expired" }, { status: 410 });
  }

  return json({
    item: {
      name: item.name,
      description: item.description,
      tags: item.tags,
      liquidCode: item.liquidCode,
      cssCode: item.cssCode,
      schemaCode: item.schemaCode,
    },
  });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { libraryItemId } = await request.json();

  if (!libraryItemId) {
    return json({ error: "libraryItemId is required" }, { status: 400 });
  }

  const item = await prisma.libraryItem.findUnique({
    where: { id: libraryItemId },
  });

  if (!item) {
    return json({ error: "Library item not found" }, { status: 404 });
  }

  const shareToken = crypto.randomBytes(24).toString("hex");
  const shareExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.libraryItem.update({
    where: { id: libraryItemId },
    data: {
      shareToken,
      shareExpiresAt,
      isPublic: true,
    },
  });

  return json({ shareToken, shareExpiresAt });
};
