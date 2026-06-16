const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const components = await prisma.componentRegistry.findMany();
  console.log(`Total components in DB: ${components.length}`);
  components.forEach(c => {
    console.log(`  [${c.status}] ${c.componentId} | category:${c.category} | liquidPath:${c.liquidPath}`);
  });

  const niches = await prisma.niche.findMany();
  console.log(`\nTotal niches: ${niches.length}`);
  niches.forEach(n => {
    console.log(`  [${n.id}] ${n.name} | demoCatalogUrl:${n.demoCatalogUrl}`);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
