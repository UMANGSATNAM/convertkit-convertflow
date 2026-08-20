import fs from 'fs';
import path from 'path';
import { applyComposition } from '../app/services/page-compositions.server';
import { COMPOSITIONS } from '../app/data/page-compositions';

(async () => {
  const comp = COMPOSITIONS.find(c => c.id === 'jewellery-diamond-home');
  if (!comp) return;

  // Temporarily intercept or print index.json
  const res = await applyComposition('test-shop.myshopify.com', '12345', comp, { dryRun: true });
  console.log('Done dry run test. Sections count:', res.sectionsWritten);
})();
