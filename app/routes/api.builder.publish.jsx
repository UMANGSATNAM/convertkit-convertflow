import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { blockToHtml } from "../lib/block-to-html.server";

// ── Publish a builder page to Shopify ──
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const body = await request.json();
  const { pageId } = body;

  if (!pageId) return json({ error: "pageId required" }, { status: 400 });

  try {
    // Fetch page from DB
    const shopRecord = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
    if (!shopRecord) return json({ error: "Shop not found" }, { status: 404 });

    const page = await prisma.page.findFirst({
      where: { id: pageId, shopId: shopRecord.id },
    });
    if (!page) return json({ error: "Page not found" }, { status: 404 });

    // Parse sections from content
    const sections = page.content ? JSON.parse(page.content) : [];
    const globalStyles = page.globalStyles ? JSON.parse(page.globalStyles) : {};

    // Convert JSON blocks to HTML
    const bodyHtml = blockToHtml(sections, globalStyles);

    // Shopify API — create or update page
    const shopifyPayload = {
      page: {
        title: page.seoTitle || page.title,
        body_html: bodyHtml,
        handle: page.slug,
        published: true,
        metafields: [
          {
            namespace: "convertkit",
            key: "builder_page_id",
            value: page.id,
            type: "single_line_text_field",
          },
        ],
      },
    };

    let shopifyPage;

    if (page.shopifyPageId) {
      // UPDATE existing page
      const res = await fetch(
        `https://${session.shop}/admin/api/2025-01/pages/${page.shopifyPageId}.json`,
        {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shopifyPayload),
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error("Shopify update error:", errText);
        return json({ error: "Failed to update Shopify page" }, { status: 500 });
      }
      shopifyPage = (await res.json()).page;
    } else {
      // CREATE new page
      const res = await fetch(
        `https://${session.shop}/admin/api/2025-01/pages.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shopifyPayload),
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error("Shopify create error:", errText);
        return json({ error: "Failed to create Shopify page" }, { status: 500 });
      }
      shopifyPage = (await res.json()).page;
    }

    // Update local DB with Shopify page ID and status
    await prisma.page.update({
      where: { id: pageId },
      data: {
        shopifyPageId: String(shopifyPage.id),
        status: "published",
        publishedAt: new Date(),
      },
    });

    const pageUrl = `https://${session.shop}/pages/${page.slug}`;

    return json({
      success: true,
      shopifyPageId: shopifyPage.id,
      pageUrl,
      handle: page.slug,
    });
  } catch (err) {
    console.error("Publish error:", err);
    return json({ error: err.message }, { status: 500 });
  }
};
