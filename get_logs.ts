import prisma from "./app/db.server.js";
async function main() {
  const g = await prisma.storeGeneration.findUnique({ where: { id: "cmri7b77g0001vkx4phep8dhb" } });
  console.log(JSON.stringify(g?.log, null, 2));
}
main();
