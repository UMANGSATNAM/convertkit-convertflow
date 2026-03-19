import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { shopifyFetchWithRetry } from "../lib/shopify-fetch.server.js";

/**
 * POST /api/page-publish
 * Creates a Shopify page and pushes the template to the merchant's active theme.
 * Body: { title, slug, templateSlug, themeId }
 */
export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { title, slug, templateSlug, themeId } = await request.json();

  if (!title || !slug || !templateSlug) {
    return json({ error: "title, slug, and templateSlug are required" }, { status: 400 });
  }

  const shopDomain = session.shop;
  const token = session.accessToken;

  try {
    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) return json({ error: "Shop not found" }, { status: 404 });

    // ── Step 1: Build template content ──
    const templateContent = buildPageTemplate(templateSlug);

    // ── Step 2: Push template to theme via Assets API ──
    const templateKey = `templates/page.${slug}.json`;

    const pushUrl = `https://${shopDomain}/admin/api/2025-01/themes/${themeId}/assets.json`;
    const pushResp = await shopifyFetchWithRetry(pushUrl, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: { key: templateKey, value: templateContent },
      }),
    });

    if (!pushResp.ok) {
      const errBody = await pushResp.text();
      throw new Error(`Failed to push template: ${pushResp.status} ${errBody}`);
    }

    // ── Step 3: Create the Shopify page ──
    const pageResp = await admin.graphql(`
      mutation createPage($input: PageInput!) {
        pageCreate(page: $input) {
          page { id title handle }
          userErrors { field message }
        }
      }
    `, {
      variables: {
        input: {
          title,
          handle: slug,
          templateSuffix: slug,
          body: "",
          isPublished: true,
        },
      },
    });

    const pageData = await pageResp.json();
    const page = pageData.data?.pageCreate?.page;
    const userErrors = pageData.data?.pageCreate?.userErrors || [];

    if (userErrors.length > 0) {
      return json({ error: userErrors[0].message, userErrors }, { status: 400 });
    }

    // ── Step 4: Save to DB ──
    await prisma.page.create({
      data: {
        shopId: shop.id,
        slug,
        title,
        content: JSON.stringify({ templateSlug, themeId }),
        publishedAt: new Date(),
      },
    });

    return json({
      success: true,
      page,
      customizeUrl: `https://${shopDomain}/admin/themes/${themeId}/editor?template=page.${slug}`,
    });
  } catch (error) {
    console.error("Page publish error:", error);
    return json({ error: error.message }, { status: 500 });
  }
};

/**
 * Build JSON template content for Online Store 2.0 pages.
 */
function buildPageTemplate(templateSlug) {
  const templates = {
    homepage: {
      name: "ConvertKit Homepage",
      sections: {
        "ck-hero": {
          type: "image-banner",
          settings: { image_overlay_opacity: 40 },
        },
        "ck-trust": {
          type: "apps",
          blocks: { "trust-1": { type: "shopify://apps/convertkit/blocks/trust-badges" } },
        },
        "ck-collection": {
          type: "featured-collection",
          settings: { title: "Featured Products", products_to_show: 8 },
        },
        "ck-faq": {
          type: "apps",
          blocks: { "faq-1": { type: "shopify://apps/convertkit/blocks/faq-accordion" } },
        },
      },
      order: ["ck-hero", "ck-trust", "ck-collection", "ck-faq"],
    },
    "product-launch": {
      name: "Product Launch",
      sections: {
        "ck-countdown": {
          type: "apps",
          blocks: { "cd-1": { type: "shopify://apps/convertkit/blocks/countdown-timer" } },
        },
        "ck-hero": {
          type: "image-banner",
          settings: {},
        },
        "ck-benefits": {
          type: "apps",
          blocks: { "bn-1": { type: "shopify://apps/convertkit/blocks/product-benefits-grid" } },
        },
        "ck-testimonials": {
          type: "apps",
          blocks: { "ts-1": { type: "shopify://apps/convertkit/blocks/testimonials-grid" } },
        },
      },
      order: ["ck-countdown", "ck-hero", "ck-benefits", "ck-testimonials"],
    },
    "about-us": {
      name: "About Us",
      sections: {
        "ck-hero": { type: "image-banner", settings: {} },
        "ck-benefits": {
          type: "apps",
          blocks: { "bn-1": { type: "shopify://apps/convertkit/blocks/product-benefits-grid" } },
        },
        "ck-testimonials": {
          type: "apps",
          blocks: { "ts-1": { type: "shopify://apps/convertkit/blocks/testimonials-grid" } },
        },
      },
      order: ["ck-hero", "ck-benefits", "ck-testimonials"],
    },
    faq: {
      name: "FAQ",
      sections: {
        "ck-faq": {
          type: "apps",
          blocks: { "faq-1": { type: "shopify://apps/convertkit/blocks/faq-accordion" } },
        },
      },
      order: ["ck-faq"],
    },
    contact: {
      name: "Contact",
      sections: {
        "ck-text": { type: "rich-text", settings: { heading: "Contact Us" } },
        "ck-trust": {
          type: "apps",
          blocks: { "trust-1": { type: "shopify://apps/convertkit/blocks/trust-badges" } },
        },
      },
      order: ["ck-text", "ck-trust"],
    },
    "bundle-builder": {
      name: "Bundle Builder",
      sections: {
        "ck-collection": {
          type: "featured-collection",
          settings: { title: "Build Your Bundle", products_to_show: 12 },
        },
        "ck-trust": {
          type: "apps",
          blocks: { "trust-1": { type: "shopify://apps/convertkit/blocks/trust-badges" } },
        },
      },
      order: ["ck-collection", "ck-trust"],
    },
    "post-purchase": {
      name: "Post-Purchase",
      sections: {
        "ck-text": { type: "rich-text", settings: { heading: "Thank You for Your Order!" } },
        "ck-collection": {
          type: "featured-collection",
          settings: { title: "You Might Also Like", products_to_show: 4 },
        },
      },
      order: ["ck-text", "ck-collection"],
    },
    "coming-soon": {
      name: "Coming Soon",
      sections: {
        "ck-countdown": {
          type: "apps",
          blocks: { "cd-1": { type: "shopify://apps/convertkit/blocks/countdown-timer" } },
        },
        "ck-popup": {
          type: "apps",
          blocks: { "ep-1": { type: "shopify://apps/convertkit/blocks/email-popup" } },
        },
      },
      order: ["ck-countdown", "ck-popup"],
    },
  };

  const template = templates[templateSlug] || templates.homepage;
  return JSON.stringify(template, null, 2);
}
