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

  const sessions = await prisma.session.findMany();
  console.log(`\nTotal sessions in DB: ${sessions.length}`);
  sessions.forEach(s => {
    console.log(`  Shop: ${s.shop} | Expires: ${s.expires} | Online: ${s.isOnline}`);
  });

  const shops = await prisma.shop.findMany();
  console.log(`\nTotal shops in DB: ${shops.length}`);
  shops.forEach(sh => {
    console.log(`  ID: ${sh.id} | Domain: ${sh.shopDomain} | plan: ${sh.plan}`);
  });

  const gens = await prisma.storeGeneration.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });
  console.log(`\nLatest 5 generations:`);
  gens.forEach(g => {
    console.log(`  ID: ${g.id} | ShopId: ${g.shopId} | Niche: ${g.nicheId} | Status: ${g.status} | CreatedAt: ${g.createdAt}`);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());

