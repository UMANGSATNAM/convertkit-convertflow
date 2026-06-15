import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ComponentRegistry for Design Systems...");

  const legacyComponents = [
    { componentId: "header_fashion_1", category: "header", industryTags: ["fashion", "apparel", "beauty"], styleTags: ["minimal", "clean"], searchKeywords: ["navigation", "logo center", "transparent header"], croScore: 88.0, mobileScore: 98.0, version: "1.0.0", liquidPath: "components/header_fashion_1.liquid", status: "LEGACY" },
    { componentId: "grid_fashion_1", category: "product_grid", industryTags: ["fashion", "apparel"], styleTags: ["modern", "editorial"], searchKeywords: ["collection", "3 column", "hover effect", "products"], croScore: 94.0, mobileScore: 92.0, version: "1.0.0", liquidPath: "components/grid_fashion_1.liquid", status: "LEGACY" },
    { componentId: "trust_fashion_1", category: "trust", industryTags: ["fashion", "beauty", "home"], styleTags: ["clean", "conversion"], searchKeywords: ["badges", "shipping", "returns", "secure"], croScore: 96.5, mobileScore: 99.0, version: "1.0.0", liquidPath: "components/trust_fashion_1.liquid", status: "LEGACY" },
    { componentId: "footer_fashion_1", category: "footer", industryTags: ["fashion", "apparel"], styleTags: ["minimal", "informative"], searchKeywords: ["newsletter", "links", "social media"], croScore: 85.0, mobileScore: 90.0, version: "1.0.0", liquidPath: "components/footer_fashion_1.liquid", status: "LEGACY" },
    { componentId: "testimonials_fashion_1", category: "testimonials", industryTags: ["fashion"], styleTags: ["modern", "editorial"], searchKeywords: ["reviews", "social proof"], croScore: 95, mobileScore: 96, version: "1.0.0", liquidPath: "components/testimonials_fashion_1.liquid", status: "LEGACY" },
    { componentId: "testimonials_beauty_1", category: "testimonials", industryTags: ["beauty"], styleTags: ["soft"], searchKeywords: ["glow", "customer reviews"], croScore: 96, mobileScore: 97, version: "1.0.0", liquidPath: "components/testimonials_beauty_1.liquid", status: "LEGACY" },
    { componentId: "testimonials_tech_1", category: "testimonials", industryTags: ["electronics"], styleTags: ["modern"], searchKeywords: ["ratings", "tech reviews"], croScore: 94, mobileScore: 95, version: "1.0.0", liquidPath: "components/testimonials_tech_1.liquid", status: "LEGACY" },
    { componentId: "testimonials_generic_1", category: "testimonials", industryTags: ["generic"], styleTags: ["clean"], searchKeywords: ["reviews", "stars"], croScore: 90, mobileScore: 92, version: "1.0.0", liquidPath: "components/testimonials_generic_1.liquid", status: "LEGACY" },
    { componentId: "trust_beauty_1", category: "trust", industryTags: ["beauty"], styleTags: ["soft"], searchKeywords: ["cruelty-free", "organic"], croScore: 98, mobileScore: 98, version: "1.0.0", liquidPath: "components/trust_beauty_1.liquid", status: "LEGACY" },
    { componentId: "trust_tech_1", category: "trust", industryTags: ["electronics"], styleTags: ["modern"], searchKeywords: ["warranty", "secure"], croScore: 97, mobileScore: 97, version: "1.0.0", liquidPath: "components/trust_tech_1.liquid", status: "LEGACY" },
    { componentId: "trust_generic_1", category: "trust", industryTags: ["generic"], styleTags: ["clean"], searchKeywords: ["shipping", "returns"], croScore: 95, mobileScore: 95, version: "1.0.0", liquidPath: "components/trust_generic_1.liquid", status: "LEGACY" },
    { componentId: "faq_fashion_1", category: "faq", industryTags: ["fashion"], styleTags: ["minimal"], searchKeywords: ["sizing", "shipping"], croScore: 91, mobileScore: 94, version: "1.0.0", liquidPath: "components/faq_fashion_1.liquid", status: "LEGACY" },
    { componentId: "faq_tech_1", category: "faq", industryTags: ["electronics"], styleTags: ["modern"], searchKeywords: ["specs", "warranty faq"], croScore: 92, mobileScore: 95, version: "1.0.0", liquidPath: "components/faq_tech_1.liquid", status: "LEGACY" },
    { componentId: "faq_generic_1", category: "faq", industryTags: ["generic"], styleTags: ["clean"], searchKeywords: ["questions", "help"], croScore: 89, mobileScore: 92, version: "1.0.0", liquidPath: "components/faq_generic_1.liquid", status: "LEGACY" },
    { componentId: "grid_beauty_1", category: "product_grid", industryTags: ["beauty"], styleTags: ["soft"], searchKeywords: ["skincare lineup"], croScore: 93, mobileScore: 94, version: "1.0.0", liquidPath: "components/grid_beauty_1.liquid", status: "LEGACY" },
    { componentId: "grid_tech_1", category: "product_grid", industryTags: ["electronics"], styleTags: ["modern", "dark"], searchKeywords: ["gadgets", "devices"], croScore: 92, mobileScore: 93, version: "1.0.0", liquidPath: "components/grid_tech_1.liquid", status: "LEGACY" },
    { componentId: "grid_home_1", category: "product_grid", industryTags: ["home"], styleTags: ["organic"], searchKeywords: ["furniture grid"], croScore: 90, mobileScore: 91, version: "1.0.0", liquidPath: "components/grid_home_1.liquid", status: "LEGACY" },
    { componentId: "grid_jewelry_1", category: "product_grid", industryTags: ["jewelry"], styleTags: ["elegant"], searchKeywords: ["rings", "necklaces"], croScore: 95, mobileScore: 96, version: "1.0.0", liquidPath: "components/grid_jewelry_1.liquid", status: "LEGACY" },
    { componentId: "grid_generic_1", category: "product_grid", industryTags: ["generic"], styleTags: ["clean"], searchKeywords: ["products", "catalog"], croScore: 88, mobileScore: 90, version: "1.0.0", liquidPath: "components/grid_generic_1.liquid", status: "LEGACY" }
  ];

  const publishedComponents = [
    // LUXURY
    { componentId: "hero_luxury_1", category: "hero", industryTags: ["generic"], styleTags: ["luxury"], searchKeywords: ["full-bleed", "premium"], croScore: 92.5, mobileScore: 95.0, version: "1.0.0", liquidPath: "theme-template/sections/heroes/hero_luxury_1.liquid", status: "PUBLISHED" },
    { componentId: "header_luxury_1", category: "header", industryTags: ["generic"], styleTags: ["luxury"], searchKeywords: ["navigation", "premium"], croScore: 90.0, mobileScore: 92.0, version: "1.0.0", liquidPath: "theme-template/sections/headers/header_luxury_1.liquid", status: "PUBLISHED" },
    { componentId: "grid_luxury_1", category: "product_grid", industryTags: ["generic"], styleTags: ["luxury"], searchKeywords: ["curated", "premium"], croScore: 93.0, mobileScore: 94.0, version: "1.0.0", liquidPath: "theme-template/sections/product-grids/grid_luxury_1.liquid", status: "PUBLISHED" },
    { componentId: "trust_luxury_1", category: "trust", industryTags: ["generic"], styleTags: ["luxury"], searchKeywords: ["craftsmanship", "concierge"], croScore: 95.0, mobileScore: 96.0, version: "1.0.0", liquidPath: "theme-template/sections/trust/trust_luxury_1.liquid", status: "PUBLISHED" },
    { componentId: "testimonials_luxury_1", category: "testimonials", industryTags: ["generic"], styleTags: ["luxury"], searchKeywords: ["reviews", "premium"], croScore: 94.0, mobileScore: 95.0, version: "1.0.0", liquidPath: "theme-template/sections/testimonials/testimonials_luxury_1.liquid", status: "PUBLISHED" },
    { componentId: "faq_luxury_1", category: "faq", industryTags: ["generic"], styleTags: ["luxury"], searchKeywords: ["client services", "help"], croScore: 91.0, mobileScore: 92.0, version: "1.0.0", liquidPath: "theme-template/sections/faq/faq_luxury_1.liquid", status: "PUBLISHED" },
    { componentId: "footer_luxury_1", category: "footer", industryTags: ["generic"], styleTags: ["luxury"], searchKeywords: ["links", "premium"], croScore: 89.0, mobileScore: 90.0, version: "1.0.0", liquidPath: "theme-template/sections/footers/footer_luxury_1.liquid", status: "PUBLISHED" },

    // MINIMAL
    { componentId: "hero_minimal_1", category: "hero", industryTags: ["generic"], styleTags: ["minimal", "clean"], searchKeywords: ["whitespace", "simple", "clean"], croScore: 94.0, mobileScore: 96.0, version: "1.0.0", liquidPath: "theme-template/sections/heroes/hero_minimal_1.liquid", status: "PUBLISHED" },
    { componentId: "header_minimal_1", category: "header", industryTags: ["generic"], styleTags: ["minimal"], searchKeywords: ["simple", "clean"], croScore: 92.0, mobileScore: 94.0, version: "1.0.0", liquidPath: "theme-template/sections/headers/header_minimal_1.liquid", status: "PUBLISHED" },
    { componentId: "grid_minimal_1", category: "product_grid", industryTags: ["generic"], styleTags: ["minimal"], searchKeywords: ["clean", "grid"], croScore: 93.0, mobileScore: 95.0, version: "1.0.0", liquidPath: "theme-template/sections/product-grids/grid_minimal_1.liquid", status: "PUBLISHED" },
    { componentId: "trust_minimal_1", category: "trust", industryTags: ["generic"], styleTags: ["minimal"], searchKeywords: ["materials", "carbon neutral"], croScore: 95.0, mobileScore: 96.0, version: "1.0.0", liquidPath: "theme-template/sections/trust/trust_minimal_1.liquid", status: "PUBLISHED" },
    { componentId: "brand_story_minimal_1", category: "brand_story", industryTags: ["generic"], styleTags: ["minimal"], searchKeywords: ["story", "philosophy"], croScore: 90.0, mobileScore: 91.0, version: "1.0.0", liquidPath: "theme-template/sections/brand-story/brand_story_minimal_1.liquid", status: "PUBLISHED" },
    { componentId: "faq_minimal_1", category: "faq", industryTags: ["generic"], styleTags: ["minimal"], searchKeywords: ["questions", "clean"], croScore: 91.0, mobileScore: 92.0, version: "1.0.0", liquidPath: "theme-template/sections/faq/faq_minimal_1.liquid", status: "PUBLISHED" },
    { componentId: "footer_minimal_1", category: "footer", industryTags: ["generic"], styleTags: ["minimal"], searchKeywords: ["links", "simple"], croScore: 89.0, mobileScore: 90.0, version: "1.0.0", liquidPath: "theme-template/sections/footers/footer_minimal_1.liquid", status: "PUBLISHED" },

    // MODERN
    { componentId: "hero_modern_1", category: "hero", industryTags: ["generic"], styleTags: ["modern", "tech"], searchKeywords: ["sleek", "blue", "apple"], croScore: 91.0, mobileScore: 94.0, version: "1.0.0", liquidPath: "theme-template/sections/heroes/hero_modern_1.liquid", status: "PUBLISHED" },
    { componentId: "header_modern_1", category: "header", industryTags: ["generic"], styleTags: ["modern"], searchKeywords: ["dark", "glass"], croScore: 90.0, mobileScore: 92.0, version: "1.0.0", liquidPath: "theme-template/sections/headers/header_modern_1.liquid", status: "PUBLISHED" },
    { componentId: "grid_modern_1", category: "product_grid", industryTags: ["generic"], styleTags: ["modern"], searchKeywords: ["tech", "dark"], croScore: 92.0, mobileScore: 93.0, version: "1.0.0", liquidPath: "theme-template/sections/product-grids/grid_modern_1.liquid", status: "PUBLISHED" },
    { componentId: "trust_modern_1", category: "trust", industryTags: ["generic"], styleTags: ["modern"], searchKeywords: ["warranty", "support"], croScore: 93.0, mobileScore: 94.0, version: "1.0.0", liquidPath: "theme-template/sections/trust/trust_modern_1.liquid", status: "PUBLISHED" },
    { componentId: "testimonials_modern_1", category: "testimonials", industryTags: ["generic"], styleTags: ["modern"], searchKeywords: ["reviews", "tech"], croScore: 91.0, mobileScore: 92.0, version: "1.0.0", liquidPath: "theme-template/sections/testimonials/testimonials_modern_1.liquid", status: "PUBLISHED" },
    { componentId: "feature_comparison_modern_1", category: "feature_comparison", industryTags: ["generic"], styleTags: ["modern"], searchKeywords: ["compare", "specs"], croScore: 94.0, mobileScore: 95.0, version: "1.0.0", liquidPath: "theme-template/sections/feature-comparison/feature_comparison_modern_1.liquid", status: "PUBLISHED" },
    { componentId: "footer_modern_1", category: "footer", industryTags: ["generic"], styleTags: ["modern"], searchKeywords: ["dark", "links"], croScore: 89.0, mobileScore: 90.0, version: "1.0.0", liquidPath: "theme-template/sections/footers/footer_modern_1.liquid", status: "PUBLISHED" },

    // BOLD
    { componentId: "hero_bold_1", category: "hero", industryTags: ["generic"], styleTags: ["bold", "streetwear"], searchKeywords: ["high contrast", "black", "red"], croScore: 95.0, mobileScore: 92.0, version: "1.0.0", liquidPath: "theme-template/sections/heroes/hero_bold_1.liquid", status: "PUBLISHED" },
    { componentId: "header_bold_1", category: "header", industryTags: ["generic"], styleTags: ["bold"], searchKeywords: ["marquee", "street"], croScore: 93.0, mobileScore: 91.0, version: "1.0.0", liquidPath: "theme-template/sections/headers/header_bold_1.liquid", status: "PUBLISHED" },
    { componentId: "grid_bold_1", category: "product_grid", industryTags: ["generic"], styleTags: ["bold"], searchKeywords: ["drops", "hype"], croScore: 96.0, mobileScore: 94.0, version: "1.0.0", liquidPath: "theme-template/sections/product-grids/grid_bold_1.liquid", status: "PUBLISHED" },
    { componentId: "social_hype_bold_1", category: "social_hype", industryTags: ["generic"], styleTags: ["bold"], searchKeywords: ["marquee", "hype"], croScore: 95.0, mobileScore: 93.0, version: "1.0.0", liquidPath: "theme-template/sections/social-hype/social_hype_bold_1.liquid", status: "PUBLISHED" },
    { componentId: "testimonials_bold_1", category: "testimonials", industryTags: ["generic"], styleTags: ["bold"], searchKeywords: ["hypebeast", "street"], croScore: 92.0, mobileScore: 90.0, version: "1.0.0", liquidPath: "theme-template/sections/testimonials/testimonials_bold_1.liquid", status: "PUBLISHED" },
    { componentId: "faq_bold_1", category: "faq", industryTags: ["generic"], styleTags: ["bold"], searchKeywords: ["wtf", "drops"], croScore: 90.0, mobileScore: 89.0, version: "1.0.0", liquidPath: "theme-template/sections/faq/faq_bold_1.liquid", status: "PUBLISHED" },
    { componentId: "footer_bold_1", category: "footer", industryTags: ["generic"], styleTags: ["bold"], searchKeywords: ["links", "street"], croScore: 88.0, mobileScore: 88.0, version: "1.0.0", liquidPath: "theme-template/sections/footers/footer_bold_1.liquid", status: "PUBLISHED" }
  ];

  const components = [...legacyComponents, ...publishedComponents];

  for (const comp of components) {
    await prisma.componentRegistry.upsert({
      where: { componentId: comp.componentId },
      update: comp,
      create: comp
    });
    console.log(`Seeded component: ${comp.componentId}`);
  }

  console.log("ComponentRegistry seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
