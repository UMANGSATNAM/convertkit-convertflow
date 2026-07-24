import prisma from './app/db.server.ts';

async function run() {
  const components = await prisma.componentRegistry.findMany({ where: { status: 'PUBLISHED' } });
  console.log('Available components:');
  components.forEach(c => console.log(c.componentId));
  process.exit(0);
}

run().catch(e => { 
  console.error('ERROR:', e.message); 
  process.exit(1); 
});
