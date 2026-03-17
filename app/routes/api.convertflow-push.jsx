import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { fetchAsset, pushToTheme } from "../lib/convertflow.server";

/**
 * POST /api/convertflow-push
 * Body: { libraryItemId, themeId }
 * Pushes a library component to a Shopify theme.
 */
export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { libraryItemId, themeId } = await request.json();

  if (!libraryItemId || !themeId) {
    return json(
      { error: "libraryItemId and themeId are required" },
      { status: 400 }
    );
  }

  try {
    const shopDomain = session.shop;
    const shop = await prisma.shop.findUnique({ where: { shopDomain } });
    if (!shop) return json({ error: "Shop not found" }, { status: 404 });

    const item = await prisma.libraryItem.findUnique({
      where: { id: libraryItemId },
    });
    if (!item) return json({ error: "Library item not found" }, { status: 404 });

    // Build section key
    const sectionKey = `sections/${item.name.toLowerCase().replace(/\s+/g, "-")}.liquid`;

    // Backup existing content
    let backupLiquid = "";
    try {
      backupLiquid = await fetchAsset(admin, themeId, sectionKey);
    } catch {
      // File doesn't exist yet, no backup needed
    }

    // Push to theme
    await pushToTheme(
      admin,
      themeId,
      sectionKey,
      item.liquidCode || "",
      item.cssCode || "",
      item.schemaCode || ""
    );

    // Record push history
    const pushRecord = await prisma.pushHistory.create({
      data: {
        shopId: shop.id,
        libraryItemId: item.id,
        targetThemeId: String(themeId),
        status: "success",
        backupLiquid: backupLiquid || null,
      },
    });

    // Increment usage count
    await prisma.libraryItem.update({
      where: { id: item.id },
      data: { usageCount: { increment: 1 } },
    });

    return json({ success: true, pushRecord });
  } catch (err) {
    console.error("ConvertFlow push error:", err.message);

    // Record failed push
    try {
      const shop = await prisma.shop.findUnique({
        where: { shopDomain: session.shop },
      });
      if (shop) {
        await prisma.pushHistory.create({
          data: {
            shopId: shop.id,
            libraryItemId,
            targetThemeId: String(themeId),
            status: "failed",
            errorMessage: err.message,
          },
        });
      }
    } catch {}

    return json({ error: err.message }, { status: 500 });
  }
};
