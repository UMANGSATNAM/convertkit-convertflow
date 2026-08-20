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

    const comp = COMPOSITIONS.find(c => c.id === 'beauty-clinical-pure-home');
    if (!comp) {
      console.error('beauty-clinical-pure-home composition not found');
      return;
    }

    console.log('=== APPLYING BEAUTY HOME PAGE 4 (PURE WHITE CLINICAL) TO LIVE STORE ===');
    const result = await applyComposition(shop, 'active', comp, {
      palette: {
        background: '#ffffff',
        accent: '#0284c7'
      }
    });

    console.log('Result:', result);
    console.log('✨ BEAUTY HOME PAGE 4 (PURE WHITE CLINICAL) SUCCESSFULLY APPLIED TO LIVE STORE!');
  } catch (err: any) {
    console.error('Error applying beauty home page 4:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
