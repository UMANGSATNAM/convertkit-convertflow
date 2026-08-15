import { describe, it, expect } from "vitest";
import {
  extractBlueprintSectionInstances,
  buildDynamicZodSchema,
  getNicheFallbackContent,
  ContentGenerationService,
  SectionInstance
} from "../../../app/services/core/ContentGenerationService";

describe("ContentGenerationService Architecture", () => {
  it("getNicheFallbackContent correctly maps subheading before heading without collision", () => {
    const instances: SectionInstance[] = [
      {
        sectionKey: "index:0:hero-editorial-v1",
        pageName: "index",
        sectionIndex: 0,
        componentId: "hero-editorial-v1",
        settingsSchema: [
          { id: "heading", type: "text", label: "Heading" },
          { id: "subheading", type: "text", label: "Subheading" },
          { id: "button_label", type: "text", label: "Button Label" }
        ]
      }
    ];

    const fallback = getNicheFallbackContent(instances, "jewellery");
    const copy = fallback["index:0:hero-editorial-v1"];

    expect(copy.heading).toContain("Handcrafted Heritage");
    expect(copy.subheading).toContain("Timeless craftsmanship");
    expect(copy.button_label).toBe("Explore Jewels");
  });

  it("injectContentIntoBlueprint injects section-instance keyed content into exact blueprint sections", async () => {
    const mockBlueprint = {
      pages: {
        index: {
          sections: [
            { componentId: "hero-editorial-v1", settings: { existing: "val" } },
            { componentId: "grid-luxury-v1", settings: {} }
          ]
        }
      }
    };

    const generatedContent = {
      "index:0:hero-editorial-v1": {
        heading: "Hero Jewellery Title",
        subheading: "Hero Subtitle",
        button_label: "Shop Now"
      },
      "index:1:grid-luxury-v1": {
        title: "Collection Title"
      }
    };

    const updated = await ContentGenerationService.injectContentIntoBlueprint(mockBlueprint, generatedContent);

    expect(updated.pages.index.sections[0].settings).toEqual({
      existing: "val",
      heading: "Hero Jewellery Title",
      subheading: "Hero Subtitle",
      button_label: "Shop Now"
    });
    expect(updated.pages.index.sections[1].settings).toEqual({
      title: "Collection Title"
    });
  });

  it("generateStoreContent successfully uses llmCaller and returns schema-validated JSON with isFallback=false", async () => {
    const mockBlueprint = {
      pages: {
        index: {
          sections: [
            { componentId: "hero-editorial-v1", settings: {} }
          ]
        }
      }
    };

    const mockLlmCaller = async () => JSON.stringify({
      "index:0:hero-editorial-v1": {
        heading: "Bespoke Royal Kundan Heritage",
        subheading: "Handcrafted heirloom Indian jewellery designed for eternal celebrations.",
        button_label: "Explore Collection"
      }
    });

    const result = await ContentGenerationService.generateStoreContent(
      {
        shopDomain: "test-llm.myshopify.com",
        storeName: "Royal Kundan",
        industry: "jewellery",
        blueprint: mockBlueprint,
        catalogSummary: {
          totalProducts: 12,
          topCategories: ["Necklaces", "Rings"]
        }
      },
      mockLlmCaller
    );

    expect(result.isFallback).toBe(false);
    expect(result.content["index:0:hero-editorial-v1"].heading).toBe("Bespoke Royal Kundan Heritage");
  });

  it("generateStoreContent retries on malformed JSON and falls back to niche dictionary when all attempts fail", async () => {
    const mockBlueprint = {
      pages: {
        index: {
          sections: [
            { componentId: "hero-editorial-v1", settings: {} }
          ]
        }
      }
    };

    const failingCaller = async () => "NOT VALID JSON";

    const result = await ContentGenerationService.generateStoreContent(
      {
        shopDomain: "test-fallback.myshopify.com",
        storeName: "Test Store",
        industry: "jewellery",
        blueprint: mockBlueprint,
        catalogSummary: {
          totalProducts: 5,
          topCategories: ["Earrings"]
        }
      },
      failingCaller
    );

    expect(result.isFallback).toBe(true);
    expect(result.content["index:0:hero-editorial-v1"].heading).toContain("Handcrafted Heritage");
  });
});

