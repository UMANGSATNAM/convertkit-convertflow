import prisma from "./app/db.server.js";
async function main() {
  const gens = await prisma.storeGeneration.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });
  gens.forEach(g => {
    console.log(`Gen ID: ${g.id}`);
    console.log(`Payload logo: ${(g.aiPayload as any)?.logoBase64?.slice(0, 30)}`);
  });
}
main();
