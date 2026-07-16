import { ExtractedStoreData } from "../ai/vision.server";

export function mapAiDataToShopifyTheme(aiData: ExtractedStoreData) {
  // 1. Map to index.json
  const indexJson: any = {
    sections: {},
    order: []
  };

  aiData.sections.forEach((section, index) => {
    const sectionId = `section_${index}_${section.type}`;
    let shopifySectionType = section.type;

    // Basic mapping from generic AI types to standard Dawn section types
    const typeMapping: Record<string, string> = {
      hero_banner: "image-banner",
      image_with_text: "image-with-text",
      featured_collection: "featured-collection",
      rich_text: "rich-text",
      multicolumn: "multicolumn",
      header: "header",
      footer: "footer"
    };

    if (typeMapping[section.type]) {
      shopifySectionType = typeMapping[section.type];
    }

    // Skip header and footer from index.json as they belong in layout/theme.liquid
    if (shopifySectionType === "header" || shopifySectionType === "footer") {
      return;
    }

    indexJson.sections[sectionId] = {
      type: shopifySectionType,
      settings: {},
      blocks: {}
      // Content could be mapped into blocks/settings here depending on AI output
    };
    indexJson.order.push(sectionId);
  });

  // 2. Map to settings_data.json patch
  const settingsPatch = {
    colors_solid_button_labels: aiData.colors.background,
    colors_accent_1: aiData.colors.primary,
    colors_accent_2: aiData.colors.secondary,
    colors_text: aiData.colors.text,
    colors_background_1: aiData.colors.background,
    colors_outline_button_labels: aiData.colors.primary,
    fontHeading: aiData.typography.headingFont,
    fontBody: aiData.typography.bodyFont,
  };

  return { indexJson, settingsPatch };
}
