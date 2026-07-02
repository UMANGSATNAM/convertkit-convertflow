import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const niches = await prisma.niche.findMany();
  console.log("Niches found:", niches.map(n => ({
    id: n.id,
    name: n.name,
    demoCatalogUrl: n.demoCatalogUrl,
    themeZipUrl: n.themeZipUrl
  })));
  
  const componentCount = await prisma.componentRegistry.count();
  console.log(`Total components in registry: ${componentCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
