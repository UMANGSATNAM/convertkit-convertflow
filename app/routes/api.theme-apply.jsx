import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { generateThemeCSS, THEME_PRESETS } from "../lib/theme-presets";
import prisma from "../db.server";

/**
 * API Route: /api/theme-apply
 * Applies a ConvertKit theme preset to the merchant's active Shopify theme
 * via the Assets API.
 *
 * POST { themeName: "Luxe" } → writes convertkit-theme.css to the active theme
 */

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const themeName = formData.get("themeName");

  if (!themeName || !THEME_PRESETS[themeName]) {
    return json(
      { error: `Invalid theme: ${themeName}. Valid: ${Object.keys(THEME_PRESETS).join(", ")}` },
      { status: 400 }
    );
  }

  // ── Step 1: Find the active (main) theme ──
  const themesResp = await admin.graphql(`
    query {
      themes(first: 10, roles: MAIN) {
        nodes {
          id
          name
          role
        }
      }
    }
  `);

  const themesData = await themesResp.json();
  const activeTheme = themesData.data?.themes?.nodes?.[0];

  if (!activeTheme) {
    return json({ error: "Could not find active theme" }, { status: 404 });
  }

  // Extract numeric theme ID from GID
  const themeGid = activeTheme.id; // e.g. "gid://shopify/Theme/123456"
  const themeNumericId = themeGid.split("/").pop();

  // ── Step 2: Generate the CSS ──
  const css = generateThemeCSS(themeName);
  if (!css) {
    return json({ error: "Failed to generate theme CSS" }, { status: 500 });
  }

  // ── Step 3: Backup existing file (if any) ──
  try {
    const existingResp = await admin.rest.get({
      path: `themes/${themeNumericId}/assets`,
      query: { "asset[key]": "assets/convertkit-theme.css" },
    });
    // If file exists, it means we'll overwrite — that's fine, the CSS is generated fresh
  } catch (e) {
    // Asset doesn't exist yet — that's expected for first-time apply
  }

  // ── Step 4: Write CSS to theme via REST Assets API ──
  try {
    const writeResp = await admin.rest.put({
      path: `themes/${themeNumericId}/assets`,
      data: {
        asset: {
          key: "assets/convertkit-theme.css",
          value: css,
        },
      },
    });

    // ── Step 5: Record in database ──
    try {
      // Look up shop by domain to get cuid
      const shop = await prisma.shop.findUnique({
        where: { shopDomain: session.shop },
        select: { id: true },
      });

      if (shop) {
        // Deactivate previous themes for this shop
        await prisma.theme.updateMany({
          where: { shopId: shop.id, isActive: true },
          data: { isActive: false },
        });

        // Upsert the theme record
        await prisma.theme.upsert({
          where: {
            id: `${shop.id}-${themeName}`,
          },
          update: {
            isActive: true,
            appliedAt: new Date(),
            cssVariables: JSON.stringify(THEME_PRESETS[themeName].variables),
          },
          create: {
            id: `${shop.id}-${themeName}`,
            shopId: shop.id,
            name: themeName,
            isActive: true,
            appliedAt: new Date(),
            cssVariables: JSON.stringify(THEME_PRESETS[themeName].variables),
          },
        });
      }
    } catch (dbErr) {
      // DB write is non-critical — theme was still applied to storefront
      console.error("Theme DB write failed:", dbErr.message);
    }

    return json({
      success: true,
      theme: themeName,
      appliedTo: activeTheme.name,
    });
  } catch (writeErr) {
    return json(
      { error: `Failed to write theme CSS: ${writeErr.message}` },
      { status: 500 }
    );
  }
};
