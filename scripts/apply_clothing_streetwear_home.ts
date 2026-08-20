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

    const comp = COMPOSITIONS.find(c => c.id === 'clothing-streetwear-home');
    if (!comp) {
      console.error('clothing-streetwear-home composition not found');
      return;
    }

    console.log('=== APPLYING CLOTHING STREETWEAR HOME PAGE 3 TO LIVE STORE ===');
    const result = await applyComposition(shop, 'active', comp, {
      palette: {
        background: '#09090b',
        accent: '#ff5500'
      }
    });

    console.log('Result:', result);
    console.log('🔥 CLOTHING STREETWEAR HOME PAGE 3 (HP-CLOTHING SECTIONS) SUCCESSFULLY APPLIED TO LIVE STORE!');
  } catch (err: any) {
    console.error('Error applying clothing streetwear home:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
