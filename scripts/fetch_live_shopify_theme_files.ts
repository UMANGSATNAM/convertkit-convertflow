import { PrismaClient } from '@prisma/client';
import { restRequest } from '../app/services/shopify-api.server';

const prisma = new PrismaClient();

(async () => {
  try {
    const session = await prisma.session.findFirst({
      where: { shop: 'peri-beauty-bcuauhsj.myshopify.com' }
    });

    if (!session || !session.accessToken) {
      console.error('No session or access token found for peri-beauty-bcuauhsj.myshopify.com!');
      // Check any session in DB
      const anySession = await prisma.session.findFirst();
      console.log('Any session found:', anySession?.shop);
      return;
    }

    console.log(`Found session for ${session.shop}`);
    const shopDomain = session.shop;
    const accessToken = session.accessToken;

    // 1. Fetch themes
    const themesData = await restRequest(shopDomain, accessToken, 'GET', 'themes.json');
    console.log('\n=== STORE THEMES ===');
    console.log(themesData.themes.map((t: any) => ({ id: t.id, name: t.name, role: t.role, updated_at: t.updated_at })));

    const activeTheme = themesData.themes.find((t: any) => t.role === 'main') || themesData.themes[0];
    console.log(`\nActive/Target Theme ID: ${activeTheme.id} (${activeTheme.name})`);

    // 2. Fetch layout/theme.liquid
    try {
      const themeLiquidData = await restRequest(shopDomain, accessToken, 'GET', `themes/${activeTheme.id}/assets.json?asset[key]=layout/theme.liquid`);
      console.log('\n=== LAYOUT/THEME.LIQUID (First 60 lines) ===');
      console.log(themeLiquidData.asset.value.split('\n').slice(0, 60).join('\n'));
    } catch (e: any) {
      console.error('Error fetching layout/theme.liquid:', e.message);
    }

    // 3. Fetch templates/index.json
    try {
      const indexJsonData = await restRequest(shopDomain, accessToken, 'GET', `themes/${activeTheme.id}/assets.json?asset[key]=templates/index.json`);
      console.log('\n=== TEMPLATES/INDEX.JSON ===');
      console.log(indexJsonData.asset.value);
    } catch (e: any) {
      console.error('Error fetching templates/index.json:', e.message);
    }

    // 4. Fetch templates/index.liquid
    try {
      const indexLiquidData = await restRequest(shopDomain, accessToken, 'GET', `themes/${activeTheme.id}/assets.json?asset[key]=templates/index.liquid`);
      console.log('\n=== TEMPLATES/INDEX.LIQUID EXISTS! ===');
      console.log(indexLiquidData.asset.value);
    } catch (e: any) {
      console.log('\ntemplates/index.liquid does NOT exist on theme (Good for OS 2.0!).');
    }

  } catch (err: any) {
    console.error('Diagnostic error:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
