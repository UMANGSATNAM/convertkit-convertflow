import { PrismaClient } from "@prisma/client";
import { analyzeIndustryPatterns } from "../app/services/learning/pattern-analyzer.server";

const prisma = new PrismaClient();

async function run() {
  console.log("Starting Phase 4.5: Learning Data Simulation...");

  // 1. Simulate 100 conversions for a specific fashion hero component
  const componentId = "hero_fashion_1";
  const industry = "fashion";

  console.log(`\n1. Simulating 100 successful conversions for ${componentId} in ${industry}...`);
  
  await prisma.componentPerformance.upsert({
    where: { componentId },
    update: {
      storesUsed: 100,
      avgConversion: 0.15, // 15% conversion rate (extremely high, definitive winner)
      industry
    },
    create: {
      componentId,
      industry,
      storesUsed: 100,
      avgConversion: 0.15,
      avgTimeOnPage: 120,
      bounceRate: 0.2,
    }
  });

  // Let's create a competing component with terrible performance
  await prisma.componentPerformance.upsert({
    where: { componentId: "hero_fashion_2" },
    update: {
      storesUsed: 50,
      avgConversion: 0.01, // 1% conversion rate (loser)
      industry
    },
    create: {
      componentId: "hero_fashion_2",
      industry,
      storesUsed: 50,
      avgConversion: 0.01,
      avgTimeOnPage: 30,
      bounceRate: 0.8,
    }
  });

  console.log("✅ Telemetry simulation complete.");

  // 2. Run the Pattern Analyzer
  console.log("\n2. Running Pattern Analyzer...");
  await analyzeIndustryPatterns("fashion");
  
  const pattern = await prisma.industryPattern.findUnique({
    where: { industry: "fashion" }
  });

  if (pattern) {
    console.log(`✅ Pattern Analyzer Results for 'fashion':`);
    console.log(`   Best Hero: ${pattern.bestHero}`);
    console.log(`   Best Nav: ${pattern.bestNavigation}`);
    console.log(`   Best Footer: ${pattern.bestFooter}`);
    console.log(`   Confidence: ${pattern.confidence}%`);
  }

  // 3. Verify Recommendation Engine
  console.log("\n3. Testing Recommendation Engine during retrieval...");
  
  const { getRecommendedComponent } = await import("../app/services/learning/recommendation.server");
  const recommendedHero = await getRecommendedComponent("hero", "fashion");
  
  if (recommendedHero === "hero_fashion_1") {
    console.log("🎉 SUCCESS: Recommendation Engine intercepted the request and recommended the proven winner!");
  } else {
    console.log(`❌ FAILURE: Expected hero_fashion_1, but got ${recommendedHero}`);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
