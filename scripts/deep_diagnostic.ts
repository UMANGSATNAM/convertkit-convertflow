import { verifyCompositions } from '../app/services/page-compositions.server';

(async () => {
  const { missing } = await verifyCompositions();
  console.log('=== MISSING COMPONENTS LIST ===');
  console.log(missing);
})();
