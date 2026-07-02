export interface ConfigArtifact {
  shopifyPath: string;
  content: string;
}

export class ConfigAssemblyEngine {
  assemble(themeDNA: any): ConfigArtifact[] {
    // Basic settings schema
    const settingsSchema = [
      {
        name: "theme_info",
        theme_name: "StoreForge Premium",
        theme_author: "StoreForge AI",
        theme_version: "1.0.0",
        theme_documentation_url: "https://storeforge.ai"
      },
      {
        name: "Colors",
        settings: [
          {
            type: "color",
            id: "color_primary",
            label: "Primary Color",
            default: themeDNA.settings?.color_primary || "#000000"
          },
          {
            type: "color",
            id: "color_background",
            label: "Background Color",
            default: themeDNA.settings?.color_background || "#ffffff"
          },
          {
            type: "color",
            id: "color_text",
            label: "Text Color",
            default: themeDNA.settings?.color_text || "#333333"
          }
        ]
      },
      {
        name: "Typography",
        settings: [
          {
            type: "font_picker",
            id: "font_heading",
            label: "Heading Font",
            default: "helvetica_n4"
          },
          {
            type: "font_picker",
            id: "font_body",
            label: "Body Font",
            default: "helvetica_n4"
          }
        ]
      }
    ];

    // Basic settings data
    const settingsData = {
      current: {
        color_primary: themeDNA.settings?.color_primary || "#000000",
        color_background: themeDNA.settings?.color_background || "#ffffff",
        color_text: themeDNA.settings?.color_text || "#333333",
        font_heading: themeDNA.settings?.font_heading || "helvetica_n4",
        font_body: themeDNA.settings?.font_body || "helvetica_n4"
      }
    };

    return [
      {
        shopifyPath: "config/settings_schema.json",
        content: JSON.stringify(settingsSchema, null, 2)
      },
      {
        shopifyPath: "config/settings_data.json",
        content: JSON.stringify(settingsData, null, 2)
      }
    ];
  }
}
