import { type PageComposition } from "./page-compositions";

export const PRODUCT_PAGES_CATALOG: PageComposition[] = [
  {
    id: "pp-1-beauty-dermal",
    name: "PRODUCT PAGE 1: BEAUTY & DERMAL SKINCARE",
    pageType: "product",
    niche: "beauty",
    family: "d2c-cro",
    header: "header_announcement_bar",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_newsletter_focus"
  },
  {
    id: "pp-2-streetwear-heavy",
    name: "PRODUCT PAGE 2: HEAVYWEIGHT STREETWEAR & FIT GUIDE",
    pageType: "product",
    niche: "streetwear",
    family: "d2c-cro",
    header: "header_mega_menu",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "util_size_guide_table" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_multi_column"
  },
  {
    id: "pp-3-jewellery-diamond",
    name: "PRODUCT PAGE 3: LUXURY DIAMONDS & FINE JEWELLERY",
    pageType: "product",
    niche: "jewellery",
    family: "d2c-cro",
    header: "header_classic_logo_center",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "story_materials_showcase" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_social_feed"
  },
  {
    id: "pp-4-tech-cyber",
    name: "PRODUCT PAGE 4: CYBER TECHWEAR & ELECTRONICS",
    pageType: "product",
    niche: "tech",
    family: "d2c-cro",
    header: "header_sidebar_drawer",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-spec-matrix" },
      { componentId: "info_comparison_table" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_multi_column"
  },
  {
    id: "pp-5-denim-heritage",
    name: "PRODUCT PAGE 5: VINTAGE HEAVYWEIGHT DENIM",
    pageType: "product",
    niche: "denim",
    family: "d2c-cro",
    header: "header_mega_menu",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "story_materials_showcase" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_multi_column"
  },
  {
    id: "pp-6-supplements-clinical",
    name: "PRODUCT PAGE 6: CLINICAL WELLNESS & SUPPLEMENTS",
    pageType: "product",
    niche: "health",
    family: "d2c-cro",
    header: "header_announcement_bar",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-spec-matrix" },
      { componentId: "trust_expert_endorsement" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_newsletter_focus"
  },
  {
    id: "pp-7-activewear-apex",
    name: "PRODUCT PAGE 7: ATHLETIC GYM & PERFORMANCE FIT",
    pageType: "product",
    niche: "activewear",
    family: "d2c-cro",
    header: "header_sidebar_drawer",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "util_size_guide_table" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_multi_column"
  },
  {
    id: "pp-8-superfood-organic",
    name: "PRODUCT PAGE 8: NATURAL SUPERFOOD & FARM WELLNESS",
    pageType: "product",
    niche: "food",
    family: "d2c-cro",
    header: "header_classic_logo_center",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_newsletter_focus"
  },
  {
    id: "pp-9-minimal-decor",
    name: "PRODUCT PAGE 9: MODERN INTERIOR FURNITURE & DECOR",
    pageType: "product",
    niche: "decor",
    family: "d2c-cro",
    header: "header_transparent_overlay",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "story_materials_showcase" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_social_feed"
  },
  {
    id: "pp-10-eyewear-luxury",
    name: "PRODUCT PAGE 10: DESIGNER EYEWEAR & SUNGLASSES",
    pageType: "product",
    niche: "eyewear",
    family: "d2c-cro",
    header: "header_classic_logo_center",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_social_feed"
  },
  {
    id: "pp-11-fragrance-parfum",
    name: "PRODUCT PAGE 11: ARTISANAL EAU DE PARFUM",
    pageType: "product",
    niche: "fragrance",
    family: "d2c-cro",
    header: "header_classic_logo_center",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "story_materials_showcase" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_social_feed"
  },
  {
    id: "pp-12-footwear-sole",
    name: "PRODUCT PAGE 12: ERGONOMIC SOLE SNEAKER DROP",
    pageType: "product",
    niche: "footwear",
    family: "d2c-cro",
    header: "header_sidebar_drawer",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "util_size_guide_table" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_multi_column"
  },
  {
    id: "pp-13-baby-organic",
    name: "PRODUCT PAGE 13: CERTIFIED ORGANIC BABY ESSENTIALS",
    pageType: "product",
    niche: "baby",
    family: "d2c-cro",
    header: "header_announcement_bar",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_newsletter_focus"
  },
  {
    id: "pp-14-pet-nutrition",
    name: "PRODUCT PAGE 14: VET APPROVED PET CARE & NUTRITION",
    pageType: "product",
    niche: "pet",
    family: "d2c-cro",
    header: "header_announcement_bar",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_newsletter_focus"
  },
  {
    id: "pp-15-coffee-roastery",
    name: "PRODUCT PAGE 15: SINGLE-ORIGIN ARTISANAL COFFEE",
    pageType: "product",
    niche: "coffee",
    family: "d2c-cro",
    header: "header_classic_logo_center",
    announcement: "util_scrolling_announcement",
    sections: [
      { componentId: "main-product-cro" },
      { componentId: "product-bundle-upsell" },
      { componentId: "product-spec-matrix" },
      { componentId: "product-ugc-reviews" },
      { componentId: "product-sticky-cart" }
    ],
    footer: "footer_newsletter_focus"
  }
];
