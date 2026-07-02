import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const components = await prisma.componentRegistry.findMany({
    take: 10
  });
  console.log("Sample components from registry:", components.map(c => ({
    componentId: c.componentId,
    category: c.category,
    status: c.status,
    niche: c.niche
  })));
  
  const statusCounts = await prisma.componentRegistry.groupBy({
    by: ['status'],
    _count: {
      componentId: true
    }
  });
  console.log("Registry status counts:", statusCounts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
