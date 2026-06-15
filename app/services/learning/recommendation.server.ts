import prisma from "../../db.server";

/**
 * The Recommendation Engine intercepts the AI's blueprint request
 * and overrides naive conceptual selections with statistically
 * proven, high-converting components based on telemetry data.
 */
export async function getRecommendedComponent(category: string, industry: string): Promise<string | null> {
  const pattern = await prisma.industryPattern.findUnique({
    where: { industry }
  });

  if (!pattern) return null;

  // If we have high confidence, we override
  if (pattern.confidence > 75) {
    if (category === "hero") return pattern.bestHero;
    if (category === "header") return pattern.bestNavigation;
    if (category === "trust") return pattern.bestTrustSection;
    if (category === "footer") return pattern.bestFooter;
  }

  return null;
}
