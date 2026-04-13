import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

/**
 * API Route: Inject ConvertFlow section into the active Shopify theme
 * Uses GraphQL Admin API (not REST) since that's what Shopify Remix provides.
 */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // Step 1: Get all themes, find the main/published one
    const themesQuery = await admin.graphql(`
      query {
        themes(first: 10) {
          nodes {
            id
            name
            role
          }
        }
      }
    `);
    const themesData = await themesQuery.json();
    const themes = themesData.data.themes.nodes;
    const mainTheme = themes.find((t) => t.role === "MAIN");

    if (!mainTheme) {
      return json({ success: false, error: "No active theme found" }, { status: 400 });
    }

    // Step 2: Read the current index.json template
    const assetQuery = await admin.graphql(`
      query GetTemplate($themeId: ID!) {
        theme(id: $themeId) {
          id
          name
          files(filenames: ["templates/index.json"], first: 1) {
            nodes {
              filename
              body {
                ... on OnlineStoreThemeFileBodyText {
                  content
                }
              }
            }
          }
        }
      }
    `, { variables: { themeId: mainTheme.id } });

    const assetData = await assetQuery.json();
    let templateContent;

    try {
      const fileNode = assetData.data.theme.files.nodes[0];
      templateContent = JSON.parse(fileNode.body.content);
    } catch (e) {
      // Create a basic template if none exists
      templateContent = {
        sections: {},
        order: [],
      };
    }

    // Step 3: Add our section (if not already present)
    const sectionKey = "convertflow_pilgrim";

    if (!templateContent.sections[sectionKey]) {
      templateContent.sections[sectionKey] = {
        type: "cf-pilgrim-landing",
        settings: {},
      };

      if (!templateContent.order) {
        templateContent.order = Object.keys(templateContent.sections);
      }

      if (!templateContent.order.includes(sectionKey)) {
        templateContent.order.unshift(sectionKey);
      }
    }

    // Step 4: Write it back using themeFilesUpsert
    const upsertMutation = await admin.graphql(`
      mutation ThemeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
        themeFilesUpsert(themeId: $themeId, files: $files) {
          upsertedThemeFiles {
            filename
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        themeId: mainTheme.id,
        files: [
          {
            filename: "templates/index.json",
            body: {
              type: "TEXT",
              value: JSON.stringify(templateContent, null, 2),
            },
          },
        ],
      },
    });

    const upsertData = await upsertMutation.json();
    const errors = upsertData.data?.themeFilesUpsert?.userErrors;

    if (errors && errors.length > 0) {
      return json({ success: false, error: errors.map((e) => e.message).join(", ") }, { status: 400 });
    }

    // Extract numeric theme ID for editor URL
    const numericId = mainTheme.id.split("/").pop();

    // Step 5: Get shop domain
    const shopQuery = await admin.graphql(`query { shop { myshopifyDomain primaryDomain { url } } }`);
    const shopData = await shopQuery.json();
    const shopDomain = shopData.data.shop.myshopifyDomain;

    return json({
      success: true,
      themeName: mainTheme.name,
      editorUrl: `https://${shopDomain}/admin/themes/${numericId}/editor`,
    });
  } catch (error) {
    console.error("Inject error:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
