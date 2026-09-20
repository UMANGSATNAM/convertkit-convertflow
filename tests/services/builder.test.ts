// tests/services/builder.test.ts
import { describe, it, expect } from "vitest";
import { DEFAULT_TEMPLATES, ELEMENT_PALETTE } from "../../app/builder/default-templates";
import { compilePageToLiquid } from "../../app/services/builder-publish.server";
import type { PageSchema } from "../../app/builder/types";

describe("PageFly-Style Builder Services", () => {
  it("generates valid schemas for all default templates", () => {
    for (const tpl of DEFAULT_TEMPLATES) {
      const schema = tpl.generate();
      expect(schema.id).toBeDefined();
      expect(schema.title).toBeDefined();
      expect(schema.handle).toBeDefined();
      expect(schema.sections.length).toBeGreaterThan(0);
      for (const sec of schema.sections) {
        expect(sec.columns.length).toBeGreaterThan(0);
      }
    }
  });

  it("compiles default templates to clean Shopify Liquid and CSS", () => {
    for (const tpl of DEFAULT_TEMPLATES) {
      const schema = tpl.generate();
      const { liquid, css } = compilePageToLiquid(schema);

      expect(liquid).toContain("cf-page-wrapper");
      expect(liquid).toContain(schema.handle);
      expect(css).toContain(".cf-page-wrapper");
      expect(css).toContain("@media (max-width: 768px)");
    }
  });

  it("renders all atomic blocks without throwing", () => {
    const testSchema: PageSchema = {
      version: "2.0",
      id: "test_page",
      title: "Test Elements Page",
      handle: "test-elements",
      pageType: "LANDING",
      layoutMode: "FULL_PAGE_NO_CHROME",
      globalStyles: DEFAULT_TEMPLATES[0].generate().globalStyles,
      sections: [
        {
          id: "sec_test",
          title: "All Elements Section",
          styles: { paddingTop: 20, paddingBottom: 20 },
          columns: [
            {
              id: "col_test",
              width: 12,
              blocks: ELEMENT_PALETTE.map((el) => el.defaultBlock()),
            },
          ],
        },
      ],
    };

    const { liquid, css } = compilePageToLiquid(testSchema);
    expect(liquid).toContain("cf-block-heading");
    expect(liquid).toContain("cf-block-paragraph");
    expect(liquid).toContain("cf-block-button");
    expect(liquid).toContain("cf-block-product_title");
    expect(liquid).toContain("cf-block-product_price");
    expect(liquid).toContain("cf-block-countdown_timer");
    expect(liquid).toContain("cf-block-trust_badges");
    expect(liquid).toContain("cf-block-faq_accordion");
    expect(css).toContain("display: none !important"); // FULL_PAGE_NO_CHROME hides theme headers
  });
});
