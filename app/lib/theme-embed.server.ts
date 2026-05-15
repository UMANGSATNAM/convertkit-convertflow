import type { AdminApiContext } from "@shopify/shopify-app-remix/server";

export async function getThemeEmbedStatus(admin: AdminApiContext) {
  const res = await admin.graphql(`#graphql
    {
      themes(first: 1, roles: [MAIN]) {
        nodes { id name }
      }
    }
  `);
  const data = (await res.json()) as {
    data: { themes: { nodes: { id: string; name: string }[] } };
  };
  const theme = data.data.themes.nodes[0];
  if (!theme) throw new Error("No main theme found");

  const numericId = theme.id.split("/").pop();
  const enableUrl = `shopify://admin/themes/${numericId}/editor?context=apps&activateAppId=${process.env.SHOPIFY_API_KEY}/omni-page`;

  return {
    themeId: numericId,
    themeName: theme.name,
    enableUrl,
  };
}
