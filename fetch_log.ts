import prisma from './app/db.server.js';
async function main() {
  const g = await prisma.storeGeneration.findFirst({ where: { status: { in: ['DONE', 'FAILED'] } }, orderBy: { createdAt: 'desc' }});
  if (!g) { console.log('No finished jobs found'); return; }
  console.log('ID:', g.id);
  console.log('Status:', g.status);
  console.log('Theme:', g.themeId);
  const logStrings = (g.log || []).map(l => typeof l === 'string' ? l : JSON.stringify(l));
  console.log('--- BrandExtractionService logs ---');
  logStrings.filter(l => l.includes('[VisualAnalyzer]')).forEach(l => console.log(l));
  console.log('--- baseSettings logs ---');
  logStrings.filter(l => l.includes('baseSettings') || l.includes('colors_background')).forEach(l => console.log(l));
  console.log('--- Color Guard logs ---');
  logStrings.filter(l => l.includes('[Color Guard]')).forEach(l => console.log(l));
  process.exit(0);
}
main().catch(console.error);
