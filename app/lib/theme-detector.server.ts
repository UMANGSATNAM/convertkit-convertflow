export async function detectIsStore20(shopify: any, session: any, themeId: string): Promise<boolean> {
  try {
    const assetsResponse = await shopify.rest.resources.Asset.all({
      session: session,
      theme_id: themeId,
    });
    
    // An Online Store 2.0 theme will have JSON files in the templates directory
    const hasJsonTemplates = assetsResponse.data.some((asset: any) => 
      asset.key.startsWith('templates/') && asset.key.endsWith('.json')
    );
    
    return hasJsonTemplates;
  } catch (error) {
    console.error("Failed to detect theme version:", error);
    return false;
  }
}
