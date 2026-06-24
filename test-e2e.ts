import { composeThemeFromBlueprint } from './app/services/theme-engine/composer.server.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  try {
    console.log("Loading components from registry...");
    const components = await prisma.componentRegistry.findMany();
    console.log(`Loaded ${components.length} components.`);

    const blueprint = {
      pages: {
        index: {
          sections: [
            { componentId: 'hero-editorial-beauty-v1', settings: {} },
            { componentId: 'grid-minimal-beauty-v1', settings: {} },
            { componentId: 'newsletter-minimal-beauty-v1', settings: {} }
          ]
        }
      },
      settings: {
        color_bg: '#ffffff'
      },
      tokensFile: 'niche-tokens/beauty/premium.css'
    };

    const shop = { shopDomain: 'test-store.myshopify.com', accessToken: 'mock-token' };

    console.log("Composing theme...");
    const result = await composeThemeFromBlueprint(shop, 'dummy-theme-id', blueprint, components, 'beauty');
    
    console.log("Composition successful!");
    console.log("Templates generated:", Object.keys(result.templates));
    console.log("Settings patches generated:", Object.keys(result.settingsPatch));
  } catch (error) {
    console.error("Composition failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
