import { composeThemeFromBlueprint } from '../app/services/theme-engine/compiler.server.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runAllNichesE2E() {
  console.log("==========================================================");
  console.log("🚀 STARTING COMPREHENSIVE E2E TEST FOR ALL 10 NICHES");
  console.log("==========================================================\n");

  try {
    console.log("📦 Loading components from registry...");
    const components = await prisma.componentRegistry.findMany();
    console.log(`✅ Loaded ${components.length} components from DB.\n`);

    const niches = await prisma.niche.findMany();
    const activeNiches = niches.filter(n => n.id !== 'test-niche');
    console.log(`🎯 Testing ${activeNiches.length} Active Niches: ${activeNiches.map(n => n.id).join(', ')}\n`);

    const shop = { shopDomain: 'test-store.myshopify.com', accessToken: 'mock-token' };
    let passed = 0;
    let failed = 0;
    const resultsTable: any[] = [];

    for (const niche of activeNiches) {
      process.stdout.write(`⏳ Testing Niche [${niche.id.toUpperCase()}]... `);
      
      const startTime = Date.now();
      try {
        // Construct a realistic blueprint for this niche
        const blueprint = {
          pages: {
            index: {
              sections: [
                { componentId: `hero_luxury_1`, settings: {} },
                { componentId: `grid_featured_lookbook`, settings: {} },
                { componentId: `trust_ugc_tiktok_feed`, settings: {} }
              ]
            }
          },
          settings: {
            color_bg: '#0a0a0a'
          },
          tokensFile: `niche-tokens/${niche.id}/premium.css`
        };

        const result = await composeThemeFromBlueprint(shop, `theme-${niche.id}`, blueprint, components, niche.id);
        const duration = Date.now() - startTime;
        
        // Inspect result keys if needed
        const resultKeys = Object.keys(result || {});
        
        passed++;
        console.log(`✅ PASSED (${duration}ms) | Keys: ${resultKeys.join(', ')}`);
        resultsTable.push({
          Niche: niche.name,
          ID: niche.id,
          Status: '✅ PASSED',
          Duration: `${duration}ms`,
          OutputKeys: resultKeys.length
        });
      } catch (err: any) {
        failed++;
        const duration = Date.now() - startTime;
        console.log(`❌ FAILED (${duration}ms) -> ${err.message}`);
        resultsTable.push({
          Niche: niche.name,
          ID: niche.id,
          Status: '❌ FAILED',
          Duration: `${duration}ms`,
          OutputKeys: 0,
          Error: err.message
        });
      }
    }

    console.log("\n==========================================================");
    console.log(`📊 E2E NICHE TEST SUMMARY: ${passed} Passed | ${failed} Failed`);
    console.log("==========================================================");
    console.table(resultsTable);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("Fatal test error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAllNichesE2E();
