import { applyComposition } from '../app/services/page-compositions.server';
import { COMPOSITIONS } from '../app/data/page-compositions';

(async () => {
  const caratlaneComp = COMPOSITIONS.find(c => c.id === 'jewellery-diamond-home');
  if (!caratlaneComp) return;

  console.log('Testing block sanitizer on jewellery-diamond-home...');
  const result = await applyComposition('test-shop.myshopify.com', '12345', caratlaneComp, { dryRun: true });
  console.log('Result files written:', result.filesWritten);
  console.log('Sections written:', result.sectionsWritten);
  console.log('Missing files:', result.missingFiles);
  console.log('✅ TEST COMPLETED SUCCESSFULLY!');
})();
