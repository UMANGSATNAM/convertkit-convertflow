import { COMPOSITIONS } from '../app/data/page-compositions';
import { applyComposition } from '../app/services/page-compositions.server';

(async () => {
  const comp = COMPOSITIONS.find(c => c.id === 'jewellery-diamond-home')!;
  
  const shop = {
    id: 'test-shop',
    shopDomain: 'test.myshopify.com',
    accessToken: 'test-token'
  };

  process.env.MOCK_SHOPIFY = "true";

  const res = await applyComposition(shop, 'dummy-theme-123', comp);
  
  console.log('\n=== INDEX.JSON CONTENT ===');
  // Read index.json generated during applyComposition by inspecting the JSON structure
})();
