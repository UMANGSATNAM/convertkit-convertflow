import fs from 'fs/promises';
import path from 'path';

export interface RetrievalParams {
  sectionType: string;
  brandArchetype: string;
  catalogIndustry: string;
  catalogStyle: string;
  catalogVisualComplexity: string;
  exclude?: string[];
  /**
   * Style family lock. Once the hero is chosen its design family is passed to
   * every subsequent lookup for that store, so the whole theme reads as one
   * brand rather than a mix of unrelated designs. Falls back to unlocked
   * scoring only when a slot has no candidate in the locked family.
   */
  lockFamily?: string;
  /**
   * Minimum score a component must reach to be accepted. Defaults to 50.
   *
   * The default exists to stop a poor match being forced into a decorative
   * slot — an unconvincing "press" strip is worse than no press strip. But it
   * was also being applied to the header, footer and cart drawer, and a store
   * generated without those is simply broken: one real run produced a theme
   * with no navigation and no footer because the best candidates scored 45.
   *
   * Callers filling a structurally required slot pass 0 as a last resort, after
   * the normally-scored attempts have failed.
   */
  minScore?: number;
}

export interface ComponentRankingResult {
  componentId: string;
  score: number;
  /** Design family of the winner — feed this back as `lockFamily`. */
  family?: string;
  visualStyle?: string;
  breakdown?: {
    compatibility: number;
    performance: number;
    archetypeMatch: number;
    diversityBonus: number;
  };
}

let registryCache: any = null;
let compatibilityCache: any = null;
let performanceCache: any = null;
let playbooksCache: Record<string, any> | null = null;

async function loadRegistries() {
  if (registryCache && compatibilityCache && performanceCache && playbooksCache) return;

  const basePath = path.resolve(process.cwd(), 'app/data/templates/theme-engine');

  const [regFile, compFile, perfFile] = await Promise.all([
    fs.readFile(path.join(basePath, 'registry.json'), 'utf-8'),
    fs.readFile(path.join(basePath, 'compatibility.json'), 'utf-8').catch(() => '{}'),
    fs.readFile(path.join(basePath, 'performance.json'), 'utf-8').catch(() => '{}')
  ]);

  registryCache = JSON.parse(regFile);
  compatibilityCache = JSON.parse(compFile);
  performanceCache = JSON.parse(perfFile);

  playbooksCache = {};
  const playbooksDir = path.join(basePath, 'playbooks');
  try {
    const files = await fs.readdir(playbooksDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const content = await fs.readFile(path.join(playbooksDir, file), 'utf-8');
          const pb = JSON.parse(content);
          const key = `${(pb.niche || "").toLowerCase()}_${(pb.designDirection || "").toLowerCase()}`;
          playbooksCache[key] = pb;
        } catch (e) {
          console.warn(`[Retrieval] Failed to parse playbook ${file}:`, e);
        }
      }
    }
  } catch (e) {
    // Playbooks directory might not exist yet
  }

  // Warn if either data file is empty — ranking will be degraded
  const compatEmpty = Object.keys(compatibilityCache).filter(k => !k.startsWith('_')).length === 0;
  const perfEmpty = Object.keys(performanceCache).filter(k => !k.startsWith('_')).length === 0;
  if (compatEmpty) console.warn('[Retrieval] WARNING: compatibility.json is empty — archetype/industry scoring disabled.');
  if (perfEmpty) console.warn('[Retrieval] WARNING: performance.json is empty — performance scoring disabled.');
}

/** Invalidate caches so next call reloads from disk (useful after seeding/feedback updates) */
export function invalidateRegistryCache() {
  registryCache = null;
  compatibilityCache = null;
  performanceCache = null;
  playbooksCache = null;
}

/**
 * Phase 5: Deterministic Component Ranking Engine
 * AI is FORBIDDEN here. Pure math only — Fast, Cheap, Repeatable.
 *
 * Scoring Formula (max 100 pts):
 *   40% Compatibility  — Industry match (25pts) + visualStyle match (15pts)
 *   30% Performance    — conversionScore (15pts) + mobileScore (10pts) + engagementScore (5pts)
 *   20% Archetype      — Exact archetype match in compatibility.json
 *   10% Diversity      — Status approved bonus + visual complexity match
 */
export async function retrieveBestComponent(params: RetrievalParams): Promise<ComponentRankingResult | null> {
  await loadRegistries();

  const typeMapping: Record<string, string> = {
    "featured-collection": "product-grid",
    "featured-product": "hero",
    "collection-list": "collection",
    "logo-list": "trust",
    "usp-bar": "trust",
    "image-banner": "hero",
    "image-with-text": "brand-story",
    "rich-text": "brand-story",
    "craftsmanship": "brand-story",
    "process": "brand-story",
    "brand_story": "brand-story",
    "product_grid": "product-grid",
    "lookbook": "product-grid",
    "trust_pillars": "trust",
    "trust-pillars": "trust",
    "press_mentions": "trust",
    "press-mentions": "trust",
    "press": "trust",
    "testimonials_marquee": "testimonials",
    "featured": "product-grid",

    // page-level layouts synced from dev-theme-peri
    "product-page": "product-page",
    "product_page": "product-page",
    "pdp": "product-page",
    "collection-page": "collection-page",
    "collection_page": "collection-page",

    // overlays and chrome
    "cart-drawer": "cart-drawer",
    "cart_drawer": "cart-drawer",
    "popup": "popup",

    // social proof / media
    "ugc": "ugc",
    "ugc-reels": "ugc",
    "instagram": "ugc",
    "gallery": "ugc",

    // commerce extras
    "bundle": "bundle-builder",
    "bundle-builder": "bundle-builder",
    "blog": "blog",
    "contact": "contact"
  };

  const registryType = typeMapping[params.sectionType] || params.sectionType;

  // Stage 0: Playbook Resolution (Curated taste pins over math scoring)
  if (playbooksCache) {
    const nicheKey = (params.catalogIndustry || "").toLowerCase();
    const styleKey = (params.catalogStyle || "").toLowerCase();
    const playbookKey = `${nicheKey}_${styleKey}`;
    const playbook = playbooksCache[playbookKey];

    if (playbook && playbook.slots) {
      const pinnedId = playbook.slots[params.sectionType] || playbook.slots[registryType];
      if (pinnedId && (!params.exclude || !params.exclude.includes(pinnedId))) {
        const pinnedComp = (registryCache.components as any[]).find((c: any) => c.componentId === pinnedId && c.status === 'approved');
        if (pinnedComp) {
          console.log(`[Retrieval:Playbook] Curated resolution for [${params.sectionType}] -> ${pinnedId} (${playbookKey})`);
          return {
            componentId: pinnedId,
            score: 100.0,
            breakdown: {
              compatibility: 40,
              performance: 30,
              archetypeMatch: 20,
              diversityBonus: 10
            }
          };
        }
      }
    }
  }

  const eligible = (registryCache.components as any[]).filter(
    (c: any) =>
      (c.category === registryType || c.sectionType === registryType) &&
      (c.status === 'approved' || c.status === 'production' || c.status === 'PUBLISHED') &&
      (!params.exclude || !params.exclude.includes(c.componentId))
  );

  if (!eligible || eligible.length === 0) {
    console.warn(`[Retrieval] No approved components found for sectionType="${params.sectionType}"`);
    return null;
  }

  // ── Style family lock ────────────────────────────────────────────────────
  // Prefer candidates from the locked family. This is a hard filter, not a
  // score bonus — a bold footer under a luxury hero looks broken no matter how
  // well it scores on the other axes. Relax only if the family has nothing for
  // this slot, so a locked family can never leave a section empty.
  let components = eligible;
  if (params.lockFamily) {
    const inFamily = eligible.filter(
      (c: any) => String(c.family || '').toLowerCase() === params.lockFamily!.toLowerCase()
    );
    if (inFamily.length > 0) {
      components = inFamily;
    } else {
      console.warn(
        `[Retrieval] Family "${params.lockFamily}" has no ${registryType} component — falling back to unlocked scoring for this slot.`
      );
    }
  }

  let bestComponentId: string | null = null;
  let highestScore = -1;
  let bestBreakdown = { compatibility: 0, performance: 0, archetypeMatch: 0, diversityBonus: 0 };

  for (const comp of components) {
    const compId: string = comp.componentId;
    const compatData = compatibilityCache[compId] || {};
    const perfData = performanceCache[compId] || {};

    let compatScore = 0;
    let perfScore = 0;
    let archetypeScore = 0;
    let diversityScore = 0;

    // ── 1. COMPATIBILITY (40 pts max) ──────────────────────────────────────
    // Industry match via compatibility.json industries[] (25 pts)
    const compatIndustries: string[] = (compatData.industries || []).map((i: string) => i.toLowerCase());
    const registryFamilies: string[] = (Array.isArray(comp.family) ? comp.family : [comp.family || ''])
      .map((f: string) => f.toLowerCase());

    const industryKey = (params.catalogIndustry || '').toLowerCase();
    if (compatIndustries.includes(industryKey)) {
      compatScore += 25; // Exact match in compatibility matrix
    } else if (registryFamilies.some(f => f === industryKey || f === 'universal')) {
      compatScore += 15; // Registry family match fallback
    } else if (compatIndustries.length === 0 && registryFamilies.includes('universal')) {
      compatScore += 10; // Universal component
    }

    // designDirection match to catalogStyle (15 pts) — Bug 1 fix (separate from layoutVariant)
    const designDirection = (comp.designDirection || comp.visualStyle || '').toLowerCase();
    const catalogStyle = (params.catalogStyle || '').toLowerCase();
    if (designDirection === catalogStyle && catalogStyle !== '') {
      compatScore += 15;
    } else if (designDirection === 'minimal' && ['clean', 'simple', 'organic'].includes(catalogStyle)) {
      compatScore += 8; // Soft match
    } else if (designDirection === 'luxury' && ['premium', 'editorial'].includes(catalogStyle)) {
      compatScore += 8;
    } else if (designDirection === 'editorial' && ['luxury', 'premium'].includes(catalogStyle)) {
      compatScore += 8; // Editorial and luxury share strong affinity
    }

    // ── 2. PERFORMANCE (30 pts max) ────────────────────────────────────────
    // Pull from performance.json first, fallback to inline registry scores
    const croScore = perfData.conversionScore ?? comp.conversionScore ?? 50;
    const mobileScore = perfData.mobileScore ?? comp.mobileScore ?? 50;
    const engagementScore = perfData.engagementScore ?? 50;

    perfScore += (croScore / 100) * 15;       // 15 pts for conversion
    perfScore += (mobileScore / 100) * 10;    // 10 pts for mobile
    perfScore += (engagementScore / 100) * 5; // 5 pts for engagement

    // ── 3. ARCHETYPE MATCH (20 pts max) ────────────────────────────────────
    // Make archetype functional by checking exact primary specialization vs secondary or wildcard (Bug 4 fix)
    const compatArchetypes: string[] = (compatData.archetypes || comp.archetypes || [])
      .map((a: string) => a.toLowerCase());
    const targetArchetype = (params.brandArchetype || '').toLowerCase();
    if (targetArchetype !== '') {
      if (compatArchetypes[0] === targetArchetype) {
        archetypeScore = 20; // Primary archetype exact specialization
      } else if (compatArchetypes.includes(targetArchetype)) {
        archetypeScore = 12; // Secondary archetype match
      } else if (compatArchetypes.includes('*') || compatArchetypes.includes('universal')) {
        archetypeScore = 6;  // Universal wildcard partial score
      }
    } else if (compatArchetypes.includes('*') || compatArchetypes.includes('universal')) {
      archetypeScore = 6;
    }

    // ── 4. DIVERSITY & COMPLEXITY BONUS (10 pts max) ────────────────────────
    // Make diversity functional based on layoutVariant richness vs catalog complexity requirement (Bug 4 fix)
    const layoutVariant = (comp.layoutVariant || comp.visualStyle || 'standard').toLowerCase();
    const richVariants = ['mega', 'marquee', 'lookbook', 'carousel', 'split', 'overlay', 'transparent-overlay', 'magazine', 'product-spotlight', 'editorial', 'drawer', 'wheel'];
    const cleanVariants = ['minimal', 'simple', 'clean', 'standard', 'grid', 'accordion', 'card', 'badges', 'stats'];

    if (params.catalogVisualComplexity === 'high') {
      if (richVariants.includes(layoutVariant)) {
        diversityScore = 10;
      } else if (cleanVariants.includes(layoutVariant)) {
        diversityScore = 4;
      } else {
        diversityScore = 7;
      }
    } else if (params.catalogVisualComplexity === 'low') {
      if (cleanVariants.includes(layoutVariant)) {
        diversityScore = 10;
      } else if (richVariants.includes(layoutVariant)) {
        diversityScore = 4;
      } else {
        diversityScore = 7;
      }
    } else {
      diversityScore = 7; // Neutral complexity
    }

    const totalScore = compatScore + perfScore + archetypeScore + diversityScore;

    if (totalScore > highestScore) {
      highestScore = totalScore;
      bestComponentId = compId;
      bestBreakdown = {
        compatibility: Math.round(compatScore),
        performance: Math.round(perfScore),
        archetypeMatch: archetypeScore,
        diversityBonus: diversityScore
      };
    }
  }

  const minScore = params.minScore ?? 50;
  if (!bestComponentId || highestScore < minScore) {
    console.warn(
      `[Retrieval] Skipping slot for "${params.sectionType}" - best component ${bestComponentId || 'none'} ` +
      `scored ${Math.round(highestScore)}, which is below threshold (${minScore})`
    );
    return null;
  }

  const winner = components.find((c: any) => c.componentId === bestComponentId) || {};

  console.log(
    `[Retrieval] Winner for "${params.sectionType}": ${bestComponentId} ` +
    `(total=${Math.round(highestScore)} | compat=${bestBreakdown.compatibility} ` +
    `perf=${bestBreakdown.performance} archetype=${bestBreakdown.archetypeMatch} ` +
    `diversity=${bestBreakdown.diversityBonus})` +
    (params.lockFamily ? ` [family: ${params.lockFamily}]` : ` [family: ${winner.family || '?'}]`)
  );

  return {
    componentId: bestComponentId,
    score: Math.round(highestScore),
    family: winner.family,
    visualStyle: winner.visualStyle,
    breakdown: bestBreakdown
  };
}
