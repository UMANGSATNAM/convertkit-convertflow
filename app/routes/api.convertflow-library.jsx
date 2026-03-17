import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * GET  /api/convertflow-library         — list all library items
 * POST /api/convertflow-library         — save a new library item
 * DELETE /api/convertflow-library       — delete by id
 */

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  const shop = await prisma.shop.findUnique({ where: { shopDomain } });
  if (!shop) return json({ items: [] });

  const items = await prisma.libraryItem.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });

  return json({ items });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const method = request.method;

  let shop = await prisma.shop.findUnique({ where: { shopDomain } });
  if (!shop) {
    shop = await prisma.shop.create({
      data: { shopDomain, accessToken: session.accessToken || "" },
    });
  }

  if (method === "POST") {
    const body = await request.json();
    const { name, description, tags, liquidCode, cssCode, schemaCode } = body;

    if (!name) {
      return json({ error: "Name is required" }, { status: 400 });
    }

    const item = await prisma.libraryItem.create({
      data: {
        shopId: shop.id,
        name,
        description: description || "",
        tags: tags || "",
        liquidCode: liquidCode || "",
        cssCode: cssCode || "",
        schemaCode: schemaCode || "",
      },
    });

    return json({ item });
  }

  if (method === "DELETE") {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return json({ error: "id is required" }, { status: 400 });
    }

    await prisma.libraryItem.delete({ where: { id } });
    return json({ success: true });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
