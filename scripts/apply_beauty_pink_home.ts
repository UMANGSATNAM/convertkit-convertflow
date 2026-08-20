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
      console.error('No session found');
      return;
    }

    const shop = {
      id: session.id,
      shopDomain: session.shop,
      accessToken: session.accessToken
    };

    const comp = COMPOSITIONS.find(c => c.id === 'beauty-rose-gradient-home');
    if (!comp) {
      console.error('beauty-rose-gradient-home composition not found');
      return;
    }

    console.log('=== APPLYING BEAUTY HOME PAGE 2 (SOFT PINK & WHITE GRADIENT) TO LIVE STORE ===');
    const result = await applyComposition(shop, 'active', comp, {
      palette: {
        background: '#fff5f7',
        accent: '#db2777'
      }
    });

    console.log('Result:', result);
    console.log('🌸 BEAUTY HOME PAGE 2 (PINK & WHITE GRADIENT) SUCCESSFULLY APPLIED TO LIVE STORE!');
  } catch (err: any) {
    console.error('Error applying beauty home page 2:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
