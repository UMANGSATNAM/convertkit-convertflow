import { COMPOSITIONS } from '../app/data/page-compositions';
import { verifyCompositions } from '../app/services/page-compositions.server';

(async () => {
  const { known, missing } = await verifyCompositions();
  const comp = COMPOSITIONS.find(c => c.id === 'jewellery-diamond-home')!;
  
  console.log('=== COMPOSITION VERIFICATION FOR JEWELLERY-DIAMOND-HOME ===');
  console.log('Composition Name:', comp.name);
  console.log('Announcement:', comp.announcement, '-> Registered:', known.has(comp.announcement || ''));
  console.log('Header:', comp.header, '-> Registered:', known.has(comp.header || ''));
  console.log('Footer:', comp.footer, '-> Registered:', known.has(comp.footer || ''));
  
  console.log('\nSections Registered Check:');
  let missingCount = 0;
  for (const s of comp.sections) {
    const isReg = known.has(s.componentId);
    console.log(`  ${s.componentId}: ${isReg ? '✅ OK' : '❌ MISSING'}`);
    if (!isReg) missingCount++;
  }
  console.log('\nTotal Missing Sections:', missingCount);
})();
