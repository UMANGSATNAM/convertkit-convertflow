const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sessions = await prisma.session.findMany();
  console.log('SESSIONS:', sessions.map(s => ({shop: s.shop, scope: s.scope})));
  const shops = await prisma.shop.findMany();
  console.log('SHOPS:', shops);
}
main().catch(console.error).finally(() => prisma.$disconnect());
