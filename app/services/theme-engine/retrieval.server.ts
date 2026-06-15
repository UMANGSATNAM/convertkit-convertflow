import prisma from "../../db.server";
import { ComponentRegistry } from "@prisma/client";
import { getRecommendedComponent } from "../learning/recommendation.server";

export interface RetrievalParams {
  sectionType: string;
  industryTags: string[];
  styleTags: string[];
}

export async function retrieveBestComponent(
  params: RetrievalParams
): Promise<ComponentRegistry | null> {
  const industry = params.industryTags[0] || "generic";
  
  // 1. Ask Recommendation Engine first
  const recommendedId = await getRecommendedComponent(params.sectionType, industry);
  if (recommendedId) {
    const recommended = await prisma.componentRegistry.findUnique({
      where: { componentId: recommendedId }
    });
    if (recommended) return recommended;
  }
  const components = await prisma.componentRegistry.findMany({
    where: { category: params.sectionType }
  });

  if (!components || components.length === 0) return null;

  // Scoring logic
  let bestComponent: ComponentRegistry | null = null;
  let bestScore = -1;

  for (const component of components) {
    let score = 0;
    
    // Parse JSON tags
    const cIndustryTags: string[] = (component.industryTags as string[]) || [];
    const cStyleTags: string[] = (component.styleTags as string[]) || [];

    // Industry match weight = 2
    for (const tag of params.industryTags) {
      if (cIndustryTags.includes(tag)) score += 2;
    }
    // Generic industry gets small bump
    if (cIndustryTags.includes("generic")) score += 0.5;

    // Style match weight = 1
    for (const tag of params.styleTags) {
      if (cStyleTags.includes(tag)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestComponent = component;
    } else if (score === bestScore && bestComponent) {
      // Tie breaker: Mobile score
      if (component.mobileScore > bestComponent.mobileScore) {
        bestComponent = component;
      }
    }
  }

  return bestComponent;
}
