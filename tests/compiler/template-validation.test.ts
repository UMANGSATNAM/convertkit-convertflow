import { describe, it, expect } from "vitest";
import { generateTemplates } from "../../app/services/theme-engine/template-generator";
import {
  ValidationError,
  validateProductTemplateBlocks,
  validateCollectionTemplate,
  assertNoForbiddenFilters
} from "../../app/services/theme-engine/validators.server";
import { StoreBlueprintData } from "../../app/services/theme-engine/compiler.server";
import { ComponentRegistry } from "@prisma/client";

const mockComp = (id: string, sectionType?: string): ComponentRegistry => ({
  componentId: id,
  sectionType: sectionType || id,
  category: "section",
  name: id,
  version: "1.0.0",
  liquidPath: `sections/${sectionType || id}.liquid`,
  status: "PUBLISHED",
  schemaHash: "hash123",
  dependencies: [],
  metaJson: {},
  createdAt: new Date(),
  updatedAt: new Date()
} as any);

describe("Stage 3: Dynamic Template Generation & Validation Gates", () => {
  it("Item #1: Valid Blueprint Compilation produces complete JSON template structures with deterministic keys", async () => {
    const filesToUpload: Record<string, string> = {};
    const blueprint: StoreBlueprintData = {
      pages: {
        index: {
          sections: [
            { componentId: "hero-banner-v1", settings: { title: "Welcome" } },
            { componentId: "hero-banner-v1", settings: { title: "Second Hero" } },
            { componentId: "featured-grid-v1", settings: {} }
          ]
        }
      }
    };
    const components = [
      mockComp("hero-banner-v1"),
      mockComp("featured-grid-v1")
    ];

    const used = await generateTemplates(blueprint, filesToUpload, components);
    expect(used).toHaveLength(2);

    const parsed = JSON.parse(filesToUpload["templates/index.json"]);
    expect(parsed.order).toEqual(["hero-banner-v1-1", "hero-banner-v1-2", "featured-grid-v1-1"]);
    expect(parsed.sections["hero-banner-v1-1"].settings.title).toBe("Welcome");
    expect(parsed.sections["hero-banner-v1-2"].settings.title).toBe("Second Hero");
  });

  it("Item #2: Mandatory Primary Sections are preserved or initialized on product and collection pages", async () => {
    const filesToUpload: Record<string, string> = {};
    const blueprint: StoreBlueprintData = {
      pages: {
        product: {
          sections: [{ componentId: "related-products-v1", settings: {} }]
        },
        collection: {
          sections: [{ componentId: "banner-v1", settings: {} }]
        }
      }
    };
    const components = [mockComp("related-products-v1"), mockComp("banner-v1")];

    await generateTemplates(blueprint, filesToUpload, components);

    const productJson = JSON.parse(filesToUpload["templates/product.json"]);
    expect(productJson.order[0]).toBe("main");
    expect(productJson.sections["main"].type).toBe("main-product");
    expect(productJson.sections["main"].block_order).toContain("buy_buttons");

    const collectionJson = JSON.parse(filesToUpload["templates/collection.json"]);
    expect(collectionJson.order[0]).toBe("main");
    expect(collectionJson.sections["main"].type).toBe("main-collection");
  });

  it("Item #3: Unregistered Components throw ValidationError when referenced in blueprint", async () => {
    const filesToUpload: Record<string, string> = {};
    const blueprint: StoreBlueprintData = {
      pages: {
        index: {
          sections: [{ componentId: "ghost-component-v99", settings: {} }]
        }
      }
    };

    await expect(generateTemplates(blueprint, filesToUpload, [])).rejects.toThrow(ValidationError);
    await expect(generateTemplates(blueprint, filesToUpload, [])).rejects.toThrow(/Unregistered component/);
  });

  it("Item #4: Missing Primary Section throws ValidationError in product or collection validator", () => {
    const filesToUpload: Record<string, string> = {
      "templates/product.json": JSON.stringify({
        sections: { "hero": { type: "hero-section" } },
        order: ["hero"]
      }),
      "templates/collection.json": JSON.stringify({
        sections: { "banner": { type: "banner-section" } },
        order: ["banner"]
      })
    };

    expect(() => validateProductTemplateBlocks(filesToUpload)).toThrow(/Primary section 'main-product' is missing/);
    expect(() => validateCollectionTemplate(filesToUpload)).toThrow(/Primary section 'main-collection' is missing/);
  });

  it("Item #5: Missing Buy Buttons in Schema throws ValidationError (Unconditional Buy Button Check part 1)", () => {
    const filesToUpload: Record<string, string> = {
      "templates/product.json": JSON.stringify({
        sections: {
          "main": {
            type: "main-product",
            blocks: { "buy": { type: "buy_buttons" } }
          }
        },
        order: ["main"]
      }),
      "sections/main-product.liquid": `
        <div class="product"></div>
        {% schema %}
        {
          "name": "Product",
          "blocks": [
            { "type": "title" },
            { "type": "price" }
          ]
        }
        {% endschema %}
      `
    };

    expect(() => validateProductTemplateBlocks(filesToUpload)).toThrow(/Unconditional Buy Button check failed: 'buy_buttons' block is NOT defined in schema/);
  });

  it("Item #6: Missing Buy Buttons in Template throws ValidationError (Unconditional Buy Button Check part 2)", () => {
    const filesToUpload: Record<string, string> = {
      "templates/product.json": JSON.stringify({
        sections: {
          "main": {
            type: "main-product",
            blocks: {
              "title-1": { type: "title" },
              "price-1": { type: "price" },
              "picker-1": { type: "variant_picker" }
            }
          }
        },
        order: ["main"]
      }),
      "sections/main-product.liquid": `
        <div class="product"></div>
        {% schema %}
        {
          "name": "Product",
          "blocks": [
            { "type": "title" },
            { "type": "price" },
            { "type": "variant_picker" },
            { "type": "buy_buttons" }
          ]
        }
        {% endschema %}
      `
    };

    expect(() => validateProductTemplateBlocks(filesToUpload)).toThrow(/Unconditional Buy Button check failed: 'buy_buttons' block is NOT configured in product template/);
  });

  it("Item #7: Missing Essential Blocks throw ValidationError when defined in schema but omitted in template", () => {
    const filesToUpload: Record<string, string> = {
      "templates/product.json": JSON.stringify({
        sections: {
          "main": {
            type: "main-product",
            blocks: {
              "title-1": { type: "title" },
              "price-1": { type: "price" },
              "buy-1": { type: "buy_buttons" }
            }
          }
        },
        order: ["main"]
      }),
      "sections/main-product.liquid": `
        {% schema %}
        {
          "blocks": [
            { "type": "title" },
            { "type": "price" },
            { "type": "variant_picker" },
            { "type": "buy_buttons" }
          ]
        }
        {% endschema %}
      `
    };

    expect(() => validateProductTemplateBlocks(filesToUpload)).toThrow(/Essential block 'variant_picker' is defined in schema.*but missing from template/);
  });

  it("Item #8: Undeclared Block Type throws ValidationError when referenced in template without schema declaration", () => {
    const filesToUpload: Record<string, string> = {
      "templates/product.json": JSON.stringify({
        sections: {
          "main": {
            type: "main-product",
            blocks: {
              "title-1": { type: "title" },
              "price-1": { type: "price" },
              "picker-1": { type: "variant_picker" },
              "buy-1": { type: "buy_buttons" },
              "fake-1": { type: "unsupported_widget" }
            }
          }
        },
        order: ["main"]
      }),
      "sections/main-product.liquid": `
        {% schema %}
        {
          "blocks": [
            { "type": "title" },
            { "type": "price" },
            { "type": "variant_picker" },
            { "type": "buy_buttons" }
          ]
        }
        {% endschema %}
      `
    };

    expect(() => validateProductTemplateBlocks(filesToUpload)).toThrow(/references undeclared block type 'unsupported_widget'/);
  });

  it("Item #9: Collection Pagination & Cards enforce {% paginate %} and product card rendering", () => {
    const validCollectionBundle: Record<string, string> = {
      "templates/collection.json": JSON.stringify({
        sections: { "main": { type: "main-collection" } },
        order: ["main"]
      }),
      "sections/main-collection.liquid": `
        {% paginate collection.products by 16 %}
          {% for product in collection.products %}
            {% render 'product-card', product: product %}
          {% endfor %}
        {% endpaginate %}
      `
    };
    expect(() => validateCollectionTemplate(validCollectionBundle)).not.toThrow();

    const missingPaginate: Record<string, string> = {
      ...validCollectionBundle,
      "sections/main-collection.liquid": `
        {% for product in collection.products %}
          {% render 'product-card', product: product %}
        {% endfor %}
      `
    };
    expect(() => validateCollectionTemplate(missingPaginate)).toThrow(/must use '\{% paginate collection\.products/);

    const missingCard: Record<string, string> = {
      ...validCollectionBundle,
      "sections/main-collection.liquid": `
        {% paginate collection.products by 16 %}
          <div>No cards rendered here</div>
        {% endpaginate %}
      `
    };
    expect(() => validateCollectionTemplate(missingCard)).toThrow(/must render product cards/);
  });

  it("Item #10: Forbidden Liquid Filters check detects img_url, ternary, pluralize, color_modify", () => {
    const forbiddenFilters = ["img_url", "ternary", "pluralize", "color_modify"];
    for (const filter of forbiddenFilters) {
      const bundle: Record<string, string> = {
        "sections/test.liquid": `<img src="{{ product.image | ${filter}: '100x' }}">`
      };
      expect(() => assertNoForbiddenFilters(bundle)).toThrow(new RegExp(`uses forbidden Liquid filter '\\| ${filter}'`));
    }

    const cleanBundle: Record<string, string> = {
      "sections/test.liquid": `<img src="{{ product.image | image_url: width: 100 }}">`,
      "templates/index.json": `{"name": "index"}`
    };
    expect(() => assertNoForbiddenFilters(cleanBundle)).not.toThrow();
  });
});
