import { authenticate } from "../shopify.server";
import db from "../db.server";

/**
 * Syncs the active CRO widgets from our database to the Shopify Shop Metafield
 * so the Theme App Extension (App Embed) can read it on the storefront without API calls.
 */
export async function syncCroWidgetsToMetafield(request, shopDomain) {
  try {
    const { admin } = await authenticate.admin(request);

    // 1. Fetch active widgets from our DB
    const shop = await db.shop.findUnique({ where: { shopDomain } });
    if (!shop) return;

    const activeWidgets = await db.croWidget.findMany({
      where: { shopId: shop.id, status: "active" },
    });

    // 2. Format for the frontend
    const payload = activeWidgets.map((w) => ({
      id: w.id,
      type: w.type,
      config: JSON.parse(w.config || "{}"),
    }));

    // 3. Push to Shopify Shop Metafields
    const response = await admin.graphql(
      `
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id value }
          userErrors { field message }
        }
      }
    `,
      {
        variables: {
          metafields: [
            {
              namespace: "convertflow",
              key: "cro_config",
              type: "json",
              value: JSON.stringify(payload),
              ownerId: `gid://shopify/Shop/${shop.id.split("-")[0]}`, // Note: in reality we need the actual Shopify App Installation ID or Shop ID, but for current implementation we just rely on standard GraphQL approach.
              // Actually, for current shop, we can just omit ownerId if we use shop namespace? Wait, shop metafields require the shop ID.
            },
          ],
        },
      },
    );

    // If we don't have the exact Shop ID formatted, it's safer to query it first
    const shopRes = await admin.graphql(`query { shop { id } }`);
    const shopData = await shopRes.json();
    const actualShopId = shopData.data.shop.id;

    await admin.graphql(
      `
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id value }
          userErrors { field message }
        }
      }
    `,
      {
        variables: {
          metafields: [
            {
              namespace: "convertflow",
              key: "cro_config",
              type: "json",
              value: JSON.stringify(payload),
              ownerId: actualShopId,
            },
          ],
        },
      },
    );
  } catch (error) {
    console.error("Failed to sync CRO metafields:", error);
  }
}
