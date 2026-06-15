import prisma from "../../db.server";

/**
 * Analyzes ComponentPerformance data across all stores
 * and identifies the highest converting components per industry.
 */
export async function analyzeIndustryPatterns(industryFilter?: string) {
  const industries = industryFilter ? [industryFilter] : await getDistinctIndustries();

  for (const industry of industries) {
    const performances = await prisma.componentPerformance.findMany({
      where: { industry }
    });

    if (performances.length === 0) continue;

    // Fetch the component registry details to group by category
    const componentIds = performances.map(p => p.componentId);
    const registry = await prisma.componentRegistry.findMany({
      where: { componentId: { in: componentIds } }
    });

    // Group performances by category
    let bestHero = "";
    let bestHeroScore = -1;
    let bestNav = "";
    let bestNavScore = -1;
    let bestTrust = "";
    let bestTrustScore = -1;
    let bestFooter = "";
    let bestFooterScore = -1;

    for (const perf of performances) {
      const comp = registry.find(c => c.componentId === perf.componentId);
      if (!comp) continue;

      // Scoring metric: We favor high conversion and high volume.
      const score = (perf.avgConversion * 10) + (perf.storesUsed * 0.5);

      if (comp.category === "hero" && score > bestHeroScore) {
        bestHeroScore = score;
        bestHero = comp.componentId;
      }
      if (comp.category === "header" && score > bestNavScore) {
        bestNavScore = score;
        bestNav = comp.componentId;
      }
      if (comp.category === "trust" && score > bestTrustScore) {
        bestTrustScore = score;
        bestTrust = comp.componentId;
      }
      if (comp.category === "footer" && score > bestFooterScore) {
        bestFooterScore = score;
        bestFooter = comp.componentId;
      }
    }

    // Save pattern
    await prisma.industryPattern.upsert({
      where: { industry },
      update: {
        bestHero,
        bestNavigation: bestNav,
        bestTrustSection: bestTrust,
        bestFooter,
        confidence: performances.reduce((acc, p) => acc + p.storesUsed, 0) > 10 ? 95 : 50
      },
      create: {
        industry,
        bestHero,
        bestNavigation: bestNav,
        bestTrustSection: bestTrust,
        bestFooter,
        confidence: performances.reduce((acc, p) => acc + p.storesUsed, 0) > 10 ? 95 : 50
      }
    });
  }
}

async function getDistinctIndustries() {
  const results = await prisma.componentPerformance.findMany({
    select: { industry: true },
    distinct: ['industry']
  });
  return results.map(r => r.industry);
}
