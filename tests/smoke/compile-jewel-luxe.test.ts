import { describe, it, expect } from "vitest";
import * as fs from "fs/promises";
import * as path from "path";
import { compileTheme, StoreBlueprintData } from "../../app/services/theme-engine/compiler.server";
import { staticValidate } from "../../app/services/theme-engine/compiler/static-validator";
import { ComponentRegistry } from "../../app/services/theme-engine/registry.server";

describe("Gate 0 Final Sprint: Smoke Compile & Negative Validation Tests", () => {
  it("Item #6: Smoke compile (Jewel-Luxe/Aurelle blueprint -> theme package with zero render errors)", async () => {
    // 1. Load jewel-luxe manifest from app/data/templates/jewel-luxe/manifest.json
    const manifestPath = path.resolve(process.cwd(), "app/data/templates/jewel-luxe/manifest.json");
    const manifestRaw = await fs.readFile(manifestPath, "utf-8");
    const jewelLuxeManifest = JSON.parse(manifestRaw);

    // 2. Load canonical component registry
    const registryPath = path.resolve(process.cwd(), "app/data/templates/theme-engine/registry.json");
    const registryRaw = await fs.readFile(registryPath, "utf-8");
    const registryData = JSON.parse(registryRaw);
    const registry: ComponentRegistry[] = Array.isArray(registryData) ? registryData : (registryData.components || []);

    // 3. Construct StoreBlueprintData mapping jewel-luxe identity to canonical V4 luxury components
    const blueprint: StoreBlueprintData = {
      globalComponents: ["announcement-luxury-v1", "header-luxury-v1", "footer-luxury-v1"],
      pages: {
        index: {
          sections: [
            { componentId: "hero-luxury-v1", settings: { title: jewelLuxeManifest.name } },
            { componentId: "grid-luxury-v1", settings: { title: "Featured Collection" } },
            { componentId: "brand-story-luxury-v1", settings: { title: "Our Heritage" } },
            { componentId: "collection-luxury-v1", settings: { title: "Curated Selections" } },
            { componentId: "testimonials-editorial-v1", settings: { title: "Client Voices" } },
            { componentId: "newsletter-luxury-v1", settings: { title: "Join the VIP Circle" } }
          ]
        },
        collection: {
          sections: [
            { componentId: "collection-luxury-v1", settings: {} },
            { componentId: "grid-luxury-v1", settings: {} }
          ]
        },
        product: {
          sections: [
            { componentId: "grid-luxury-v1", settings: {} },
            { componentId: "testimonials-editorial-v1", settings: {} }
          ]
        }
      },
      settings: {
        merchantId: "merchant_jewel_luxe",
        blueprintId: jewelLuxeManifest.id,
        color_primary: jewelLuxeManifest.colors.primary,
        color_bg: jewelLuxeManifest.colors.background,
        color_text: jewelLuxeManifest.colors.text
      }
    };

    // 4. Execute deterministic compiler
    const artifact = await compileTheme(blueprint, registry, { industry: jewelLuxeManifest.niche });

    // 5. Verify build outputs exist
    expect(artifact).toBeDefined();
    expect(artifact.manifest).toBeDefined();
    expect(artifact.uploadBundle).toBeDefined();
    expect(artifact.validation).toBeDefined();

    // Verify valid manifest, uploadBundle, validation outputs
    expect(artifact.manifest.blueprintId).toBe("jewel-luxe");
    expect(artifact.manifest.niche).toBe("Jewellery");
    const sectionPaths = artifact.uploadBundle.sections.map(f => f.shopifyPath);
    expect(sectionPaths).toContain("sections/hero-luxury-v1.liquid");
    expect(sectionPaths).toContain("sections/grid-luxury-v1.liquid");
    expect(sectionPaths).toContain("sections/brand-story-luxury-v1.liquid");
    expect(sectionPaths).toContain("sections/collection-luxury-v1.liquid");
    expect(sectionPaths).toContain("sections/testimonials-editorial-v1.liquid");
    expect(sectionPaths).toContain("sections/newsletter-luxury-v1.liquid");
    expect(sectionPaths).toContain("sections/announcement-luxury-v1.liquid");
    expect(sectionPaths).toContain("sections/header-luxury-v1.liquid");
    expect(sectionPaths).toContain("sections/footer-luxury-v1.liquid");
    const layoutPaths = artifact.uploadBundle.layout.map(f => f.shopifyPath);
    expect(layoutPaths).toContain("layout/theme.liquid");
    const configPaths = artifact.uploadBundle.config.map(f => f.shopifyPath);
    expect(configPaths).toContain("config/settings_schema.json");

    // Ensure zero errors in compilation and static validation
    expect(artifact.manifest.summary.errors).toHaveLength(0);
    expect(artifact.validation.passed).toBe(true);
    expect(artifact.validation.fatalCount).toBe(0);
  });

  it("Item #7: Negative test (Blueprint referencing missing snippet produces validation error)", async () => {
    // Take a bundle and simulate a section referencing a nonexistent snippet
    const mockBundle = {
      sections: [{ shopifyPath: "sections/test-section.liquid", contentHash: "123", sizeBytes: 100 }],
      snippets: [],
      assets: [],
      locales: [{ shopifyPath: "locales/en.default.json", contentHash: "456", sizeBytes: 50 }],
      config: [],
      templates: [],
      layout: [],
      cssBundle: { shopifyPath: "assets/theme.bundle.css", content: ":root {}", sizeBytes: 10 },
      jsBundle: { shopifyPath: "assets/theme.bundle.js", content: "// js", sizeBytes: 10 },
      stats: {} as any
    };

    const mockManifest = {
      manifestVersion: "1.0",
      css: { composed: {} },
      locales: { translations: {} },
      settings: { settings_data: {} }
    } as any;

    // Provide a custom readFile where test-section renders a missing snippet
    const customReadFile = (filePath: string): string => {
      if (filePath === "sections/test-section.liquid") {
        return `<section>{% render 'nonexistent-missing-snippet-12345' %}</section>`;
      }
      return "";
    };

    const validationReport = await staticValidate(mockBundle, mockManifest, customReadFile);

    expect(validationReport.passed).toBe(false);
    expect(validationReport.fatalCount).toBeGreaterThan(0);
    expect(validationReport.checks.snippetRefs).toBe("fail");
    
    const missingSnippetIssue = validationReport.issues.find(i => i.code === "MISSING_SNIPPET");
    expect(missingSnippetIssue).toBeDefined();
    expect(missingSnippetIssue?.severity).toBe("fatal");
    expect(missingSnippetIssue?.message).toContain("nonexistent-missing-snippet-12345");
  });
});
