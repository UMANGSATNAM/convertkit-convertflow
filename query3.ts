import prisma from './app/db.server.js'; 
async function main() { 
  const g = await prisma.storeGeneration.findFirst({ orderBy: { createdAt: 'desc' } }); 
  console.log(JSON.stringify(g, null, 2)); 
} 
main().catch(console.error);
