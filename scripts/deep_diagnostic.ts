import fs from 'fs';
import path from 'path';
import { COMPOSITIONS } from '../app/data/page-compositions';
import { verifyCompositions } from '../app/services/page-compositions.server';

(async () => {
  const { known } = await verifyCompositions();
  const caratlane = COMPOSITIONS.find(c => c.id === 'jewellery-diamond-home')!;
  
  console.log('=== CARATLANE COMPOSITION DIAGNOSTIC ===');
  console.log('Announcement:', caratlane.announcement, '-> Liquid:', known.get(caratlane.announcement || ''));
  console.log('Header:', caratlane.header, '-> Liquid:', known.get(caratlane.header || ''));
  console.log('Footer:', caratlane.footer, '-> Liquid:', known.get(caratlane.footer || ''));
  
  console.log('\nSections List:');
  for (const s of caratlane.sections) {
    const p = known.get(s.componentId);
    console.log(`  ${s.componentId} -> ${p ? 'FOUND (' + p + ')' : 'MISSING ❌'}`);
  }
})();
