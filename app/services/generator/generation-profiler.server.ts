/**
 * Generation Profile Logger
 * Captures the full intelligence pipeline output for every store generation.
 * This is the E2E debugging goldmine — every generation gets a structured profile saved to DB + console.
 *
 * Stored in StoreGeneration.stepState.generationProfile
 */

export interface ComponentSelection {
  sectionType: string;
  componentId: string;
  score: number;
  breakdown?: {
    compatibility: number;
    performance: number;
    archetypeMatch: number;
    diversityBonus: number;
  };
}

export interface GenerationProfile {
  generationId: string;
  shopDomain: string;
  startedAt: string;

  // Phase 1: Catalog
  catalogProfile: {
    industry: string;
    positioning: string;
    style: string;
    price_band: string;
    catalog_strength: number;
    product_count: number;
    collection_count: number;
    dominant_categories: string[];
    catalog_depth: string;
    visual_complexity: string;
    hero_product_type: string;
    avgPrice: number;
    imageUrlsCollected: number;
  } | null;

  // Phase 1.5: Visual
  visualProfile: {
    image_style: string;
    brightness: string;
    background_type: string;
    visual_quality: string;
    people_present: boolean;
    image_quality_score: number;
  } | null;

  // Phase 2+3: Brand
  brandProfile: {
    brand_archetype: string;
    tone: string;
    visual_direction: string;
    trust_level: string;
    colors: { primary: string; secondary: string; accent: string };
    typography: { heading: string; body: string };
    theme_tokens: {
      button_style: string;
      card_style: string;
      section_density: string;
      image_ratio: string;
      animation_level: string;
    };
  } | null;

  // Phase 8: CRO
  croProfile: {
    trustLevel: string;
    socialProofNeeded: boolean;
    faqNeeded: boolean;
    injectedSections: string[];
  } | null;

  // Phase 4+5: Blueprint + Component Selection
  blueprint: {
    sectionTypesBeforeCRO: string[];
    sectionTypesAfterCRO: string[];
    selectedComponents: ComponentSelection[];
  } | null;

  // Phase 9+10: Validation + Repair
  validation: {
    passed: boolean;
    repairAttempts: number;
    repairApplied: boolean;
    errors: string[];
  };

  // Phase 11: Result
  result: {
    themeId: string | null;
    previewUrl: string | null;
    healthScore: number | null;
    completedAt: string | null;
    success: boolean;
    failureReason: string | null;
  };

  // Perf
  durationMs: number | null;
}

/** Creates a fresh empty profile for a generation run */
export function createGenerationProfile(generationId: string, shopDomain: string): GenerationProfile {
  return {
    generationId,
    shopDomain,
    startedAt: new Date().toISOString(),
    catalogProfile: null,
    visualProfile: null,
    brandProfile: null,
    croProfile: null,
    blueprint: null,
    validation: { passed: false, repairAttempts: 0, repairApplied: false, errors: [] },
    result: { themeId: null, previewUrl: null, healthScore: null, completedAt: null, success: false, failureReason: null },
    durationMs: null
  };
}

/** Logs the profile to console in a clean structured format */
export function logGenerationProfile(profile: GenerationProfile): void {
  const separator = '═'.repeat(70);
  console.log(`\n${separator}`);
  console.log(`🏪 GENERATION PROFILE — ${profile.shopDomain}`);
  console.log(`   ID: ${profile.generationId} | Started: ${profile.startedAt}`);
  console.log(separator);

  if (profile.catalogProfile) {
    console.log(`📦 CATALOG: industry=${profile.catalogProfile.industry} | positioning=${profile.catalogProfile.positioning} | style=${profile.catalogProfile.style}`);
    console.log(`   price_band=${profile.catalogProfile.price_band} | strength=${profile.catalogProfile.catalog_strength} | products=${profile.catalogProfile.product_count} | collections=${profile.catalogProfile.collection_count}`);
    console.log(`   categories=${profile.catalogProfile.dominant_categories.join(', ')} | hero_product=${profile.catalogProfile.hero_product_type}`);
    console.log(`   imageUrls collected: ${profile.catalogProfile.imageUrlsCollected}`);
  }

  if (profile.visualProfile) {
    console.log(`🎨 VISUAL: style=${profile.visualProfile.image_style} | brightness=${profile.visualProfile.brightness} | bg=${profile.visualProfile.background_type}`);
    console.log(`   quality=${profile.visualProfile.visual_quality} | people=${profile.visualProfile.people_present} | quality_score=${profile.visualProfile.image_quality_score}`);
  }

  if (profile.brandProfile) {
    console.log(`🏷️  BRAND: archetype=${profile.brandProfile.brand_archetype} | tone=${profile.brandProfile.tone} | direction=${profile.brandProfile.visual_direction}`);
    console.log(`   colors: primary=${profile.brandProfile.colors.primary} secondary=${profile.brandProfile.colors.secondary} accent=${profile.brandProfile.colors.accent}`);
    console.log(`   fonts: heading=${profile.brandProfile.typography.heading} body=${profile.brandProfile.typography.body}`);
    console.log(`   tokens: button=${profile.brandProfile.theme_tokens.button_style} card=${profile.brandProfile.theme_tokens.card_style} density=${profile.brandProfile.theme_tokens.section_density}`);
  }

  if (profile.croProfile) {
    console.log(`📈 CRO: trustLevel=${profile.croProfile.trustLevel} | socialProof=${profile.croProfile.socialProofNeeded} | faq=${profile.croProfile.faqNeeded}`);
    if (profile.croProfile.injectedSections.length > 0) {
      console.log(`   ✅ Auto-injected: ${profile.croProfile.injectedSections.join(', ')}`);
    }
  }

  if (profile.blueprint) {
    console.log(`🧩 BLUEPRINT: ${profile.blueprint.sectionTypesAfterCRO.length} sections`);
    console.log(`   ${profile.blueprint.sectionTypesAfterCRO.join(' → ')}`);
    console.log(`   SELECTED COMPONENTS:`);
    profile.blueprint.selectedComponents.forEach(c => {
      const bd = c.breakdown;
      const breakdown = bd ? ` [compat=${bd.compatibility} perf=${bd.performance.toFixed(0)} archetype=${bd.archetypeMatch} diversity=${bd.diversityBonus}]` : '';
      console.log(`   • ${c.sectionType.padEnd(20)} → ${c.componentId.padEnd(35)} score=${c.score}${breakdown}`);
    });
  }

  console.log(`✅ VALIDATION: passed=${profile.validation.passed} | repairs=${profile.validation.repairAttempts} | repairApplied=${profile.validation.repairApplied}`);
  if (profile.validation.errors.length > 0) {
    console.log(`   Errors: ${profile.validation.errors.join('; ')}`);
  }

  const r = profile.result;
  if (r.success) {
    console.log(`🚀 RESULT: ✅ SUCCESS | themeId=${r.themeId} | health=${r.healthScore} | ${profile.durationMs}ms`);
    console.log(`   Preview: ${r.previewUrl}`);
  } else {
    console.log(`💥 RESULT: ❌ FAILED | reason=${r.failureReason} | ${profile.durationMs}ms`);
  }
  console.log(`${separator}\n`);
}
