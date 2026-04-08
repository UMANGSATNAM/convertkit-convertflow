import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// ── CRUD API for Builder Pages ──
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Find or create shop record
  let shopRecord = await prisma.shop.findUnique({ where: { shopDomain: shop } });
  if (!shopRecord) {
    shopRecord = await prisma.shop.create({
      data: { shopDomain: shop, accessToken: session.accessToken || "" },
    });
  }

  const method = request.method;

  // ── CREATE ──
  if (method === "POST") {
    const body = await request.json();
    const { title, slug, pageType, templateId, content, globalStyles, seoTitle, seoDescription } = body;

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    try {
      const page = await prisma.page.create({
        data: {
          shopId: shopRecord.id,
          title: title || "Untitled Page",
          slug: finalSlug,
          pageType: pageType || "landing",
          templateId: templateId || null,
          content: content ? JSON.stringify(content) : null,
          globalStyles: globalStyles ? JSON.stringify(globalStyles) : null,
          seoTitle: seoTitle || title || "",
          seoDescription: seoDescription || "",
          status: "draft",
        },
      });
      return json({ success: true, page });
    } catch (err) {
      if (err.code === "P2002") {
        return json({ error: "A page with this slug already exists" }, { status: 409 });
      }
      console.error("Create page error:", err);
      return json({ error: err.message }, { status: 500 });
    }
  }

  // ── UPDATE (PUT) ──
  if (method === "PUT") {
    const body = await request.json();
    const { pageId, ...updates } = body;

    if (!pageId) return json({ error: "pageId required" }, { status: 400 });

    const data = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.slug !== undefined) data.slug = updates.slug;
    if (updates.pageType !== undefined) data.pageType = updates.pageType;
    if (updates.content !== undefined) data.content = JSON.stringify(updates.content);
    if (updates.globalStyles !== undefined) data.globalStyles = JSON.stringify(updates.globalStyles);
    if (updates.seoTitle !== undefined) data.seoTitle = updates.seoTitle;
    if (updates.seoDescription !== undefined) data.seoDescription = updates.seoDescription;
    if (updates.status !== undefined) data.status = updates.status;

    try {
      const page = await prisma.page.update({ where: { id: pageId }, data });
      return json({ success: true, page });
    } catch (err) {
      console.error("Update page error:", err);
      return json({ error: err.message }, { status: 500 });
    }
  }

  // ── DELETE ──
  if (method === "DELETE") {
    const body = await request.json();
    const { pageId } = body;

    if (!pageId) return json({ error: "pageId required" }, { status: 400 });

    try {
      await prisma.page.delete({ where: { id: pageId } });
      return json({ success: true });
    } catch (err) {
      console.error("Delete page error:", err);
      return json({ error: err.message }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};

// ── LIST (GET) ──
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const shopRecord = await prisma.shop.findUnique({ where: { shopDomain: shop } });
  if (!shopRecord) return json({ pages: [] });

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const pageType = url.searchParams.get("pageType");

  const where = { shopId: shopRecord.id };
  if (status && status !== "all") where.status = status;
  if (pageType && pageType !== "all") where.pageType = pageType;

  const pages = await prisma.page.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      pageType: true,
      templateId: true,
      status: true,
      shopifyPageId: true,
      seoTitle: true,
      publishedAt: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return json({ pages });
};
