import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import {
  fetchAsset,
  parseSectionFile,
  processWithGemini,
} from "../lib/convertflow.server";

/**
 * POST /api/convertflow-extract
 * Body: { themeId, sectionKey }
 * Extracts a section, processes with Gemini, saves to DB.
 */
export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { themeId, sectionKey } = await request.json();

  if (!themeId || !sectionKey) {
    return json({ error: "themeId and sectionKey are required" }, { status: 400 });
  }

  try {
    // 1. Fetch raw asset
    const rawContent = await fetchAsset(admin, themeId, sectionKey);
    if (!rawContent) {
      return json({ error: "Asset not found or empty" }, { status: 404 });
    }

    // 2. Parse into parts
    const { liquid, css, schema } = parseSectionFile(rawContent);

    // 3. Process with Gemini AI
    const processed = await processWithGemini(liquid, css, schema);

    // 4. Upsert shop record
    const shopDomain = session.shop;
    let shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) {
      shop = await prisma.shop.create({
        data: {
          shopDomain,
          accessToken: session.accessToken || "",
        },
      });
    }

    // 5. Save extraction record
    const extraction = await prisma.extraction.create({
      data: {
        shopId: shop.id,
        sectionKey,
        sectionName: sectionKey.replace("sections/", "").replace(".liquid", ""),
        rawLiquid: liquid,
        rawCSS: css,
        rawSchema: schema,
        processedLiquid: processed.processedLiquid,
        processedCSS: processed.processedCSS,
        processedSchema: processed.processedSchema,
        themeCheckerPass: !processed.error,
        errors: processed.error ? JSON.stringify([processed.error]) : null,
      },
    });

    return json({
      extraction: {
        id: extraction.id,
        sectionKey: extraction.sectionKey,
        sectionName: extraction.sectionName,
        rawLiquid: extraction.rawLiquid,
        rawCSS: extraction.rawCSS,
        rawSchema: extraction.rawSchema,
        processedLiquid: extraction.processedLiquid,
        processedCSS: extraction.processedCSS,
        processedSchema: extraction.processedSchema,
        themeCheckerPass: extraction.themeCheckerPass,
        errors: extraction.errors,
      },
    });
  } catch (err) {
    console.error("ConvertFlow extract error:", err.message);
    return json({ error: err.message }, { status: 500 });
  }
};
