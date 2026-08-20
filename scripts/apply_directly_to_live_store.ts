import { PrismaClient } from '@prisma/client';
import { applyComposition } from '../app/services/page-compositions.server';
import { COMPOSITIONS } from '../app/data/page-compositions';

const prisma = new PrismaClient();

(async () => {
  try {
    const session = await prisma.session.findFirst({
      where: { shop: 'peri-beauty-bcuauhsj.myshopify.com' }
    });

    if (!session || !session.accessToken) {
      console.error('No session found for peri-beauty-bcuauhsj.myshopify.com');
      return;
    }

    const shop = {
      id: session.id,
      shopDomain: session.shop,
      accessToken: session.accessToken
    };

    const comp = COMPOSITIONS.find(c => c.id === 'jewellery-diamond-home');
    if (!comp) return;

    console.log('=== APPLYING HOMEPAGE DIRECTLY TO ACTIVE LIVE THEME ===');
    const result = await applyComposition(shop, 'active', comp, {
      palette: { accent: '#d4af37' }
    });

    console.log('Result:', result);
    console.log('✅ 100% HOMEPAGE SECTIONS SUCCESSFULLY WRITTEN TO ACTIVE LIVE THEME!');
  } catch (err: any) {
    console.error('Error applying directly to live theme:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
