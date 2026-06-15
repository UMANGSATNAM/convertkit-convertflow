import { ComponentRegistry } from "@prisma/client";
import { uploadAssetWithCache } from "./asset-cache.server";
import * as fs from "fs/promises";
import * as path from "path";

export interface BlueprintSection {
  componentId: string;
  settings?: Record<string, any>;
  blocks?: Record<string, any>;
}

export interface StoreBlueprint {
  pages: {
    [pageHandle: string]: {
      sections: BlueprintSection[];
    }
  };
  settings: Record<string, any>;
}

/**
 * The Theme Composer takes the Store Blueprint and the matched components from the registry.
 * It does two things:
 * 1. Generates the `index.json` (and other templates).
 * 2. Uploads the necessary `.liquid` files to the Shopify theme.
 */
export async function composeThemeFromBlueprint(
  shop: any,
  themeId: string,
  blueprint: StoreBlueprint,
  components: ComponentRegistry[]
) {
  const templates: Record<string, any> = {};

  // Track which liquid files we need to upload
  const componentsToUpload = new Set<string>();

  for (const [pageHandle, pageData] of Object.entries(blueprint.pages)) {
    const templateJson: any = {
      sections: {},
      order: []
    };

    pageData.sections.forEach((section, index) => {
      // Find the component in the registry
      const component = components.find(c => c.componentId === section.componentId);
      if (!component) {
        console.warn(`Component ${section.componentId} not found in registry. Skipping.`);
        return;
      }

      const sectionKey = `${component.componentId}_${index}`;
      
      templateJson.sections[sectionKey] = {
        type: component.componentId, // This maps to the filename without .liquid
        settings: section.settings || {},
        blocks: section.blocks || {}
      };
      
      templateJson.order.push(sectionKey);
      componentsToUpload.add(component.componentId);
    });

    // Map "index" to "templates/index.json", etc.
    const templatePath = `templates/${pageHandle}.json`;
    templates[templatePath] = templateJson;
  }

  // Upload the required component liquid files
  for (const componentId of componentsToUpload) {
    const component = components.find(c => c.componentId === componentId);
    if (component && component.liquidPath) {
      try {
        // We assume liquidPath is relative to the project root, e.g., "components/hero_fashion_1.liquid"
        const fullPath = path.resolve(process.cwd(), component.liquidPath);
        const liquidContent = await fs.readFile(fullPath, "utf-8");
        
        // Upload to sections/ directory in Shopify theme
        const shopifyAssetKey = `sections/${component.componentId}.liquid`;
        const uploaded = await uploadAssetWithCache(shop, themeId, shopifyAssetKey, liquidContent);
        if (uploaded) {
          console.log(`Uploaded component asset: ${shopifyAssetKey}`);
        }
      } catch (err: any) {
        console.error(`Failed to read/upload component ${component.componentId} from ${component.liquidPath}:`, err.message);
      }
    }
  }

  return { templates, settingsPatch: blueprint.settings };
}
