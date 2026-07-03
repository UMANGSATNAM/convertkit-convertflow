import fs from 'fs/promises';
import path from 'path';

export interface RetrievalParams {
  sectionType: string;
  brandArchetype: string;
  catalogIndustry: string;
  catalogStyle: string;
  catalogVisualComplexity: string;
  exclude?: string[];
}

export interface ComponentRankingResult {
  componentId: string;
  score: number;
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

async function loadRegistries() {
  if (registryCache && compatibilityCache && performanceCache) return;

  const basePath = path.resolve(process.cwd(), 'app/data/templates/theme-engine');

  const [regFile, compFile, perfFile] = await Promise.all([
    fs.readFile(path.join(basePath, 'registry.json'), 'utf-8'),
    fs.readFile(path.join(basePath, 'compatibility.json'), 'utf-8').catch(() => '{}'),
    fs.readFile(path.join(basePath, 'performance.json'), 'utf-8').catch(() => '{}')
  ]);

  registryCache = JSON.parse(regFile);
  compatibilityCache = JSON.parse(compFile);
  performanceCache = JSON.parse(perfFile);

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
  };

  const registryType = typeMapping[params.sectionType] || params.sectionType;

  const components = (registryCache.components as any[]).filter(
    (c: any) => c.type === registryType && c.status === 'approved' && (!params.exclude || !params.exclude.includes(c.componentId))
  );

  if (!components || components.length === 0) {
    console.warn(`[Retrieval] No approved components found for sectionType="${params.sectionType}"`);
    return null;
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

    // visualStyle match to catalogStyle (15 pts)
    const visualStyle = (comp.visualStyle || '').toLowerCase();
    const catalogStyle = (params.catalogStyle || '').toLowerCase();
    if (visualStyle === catalogStyle && catalogStyle !== '') {
      compatScore += 15;
    } else if (visualStyle === 'minimal' && ['clean', 'simple', 'organic'].includes(catalogStyle)) {
      compatScore += 8; // Soft match
    } else if (visualStyle === 'luxury' && ['premium', 'editorial'].includes(catalogStyle)) {
      compatScore += 8;
    }

    // ── 2. PERFORMANCE (30 pts max) ────────────────────────────────────────
    // Pull from performance.json first, fallback to inline registry scores
    const croScore = perfData.conversionScore ?? comp.conversionScore ?? 50;
    const mobileScore = perfData.mobileScore ?? comp.mobileScore ?? 50;
    const engagementScore = perfData.engagementScore ?? 50;

    perfScore += (croScore / 100) * 15;       // 15 pts for conversion
    perfScore += (mobileScore / 100) * 10;    // 10 pts for mobile
    perfScore += (engagementScore / 100) * 5; // 5 pts for engagement

    // ── 3. ARCHETYPE MATCH (20 pts) ────────────────────────────────────────
    const compatArchetypes: string[] = (compatData.archetypes || comp.archetypes || [])
      .map((a: string) => a.toLowerCase());

    const targetArchetype = (params.brandArchetype || '').toLowerCase();
    if (targetArchetype !== '' && compatArchetypes.includes(targetArchetype)) {
      archetypeScore = 20;
    } else if (compatArchetypes.includes('*')) {
      archetypeScore = 10; // Universal wildcard partial score
    }

    // ── 4. DIVERSITY BONUS (10 pts) ────────────────────────────────────────
    if (comp.status === 'approved') diversityScore += 5;

    // Visual complexity: prefer richer components for visually complex catalogs
    if (params.catalogVisualComplexity === 'high' && ['editorial', 'magazine', 'carousel', 'luxury'].includes(visualStyle)) {
      diversityScore += 5;
    } else if (params.catalogVisualComplexity === 'low' && ['minimal', 'natural', 'tech'].includes(visualStyle)) {
      diversityScore += 5;
    } else {
      diversityScore += 2; // Neutral bonus
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

  if (!bestComponentId) return null;

  console.log(
    `[Retrieval] Winner for "${params.sectionType}": ${bestComponentId} ` +
    `(total=${Math.round(highestScore)} | compat=${bestBreakdown.compatibility} ` +
    `perf=${bestBreakdown.performance} archetype=${bestBreakdown.archetypeMatch} ` +
    `diversity=${bestBreakdown.diversityBonus})`
  );

  return {
    componentId: bestComponentId,
    score: Math.round(highestScore),
    breakdown: bestBreakdown
  };
}
