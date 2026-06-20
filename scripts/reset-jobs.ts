import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.storeGeneration.updateMany({
    where: {
      status: { notIn: ["DONE", "FAILED"] }
    },
    data: {
      status: "FAILED",
      error: { message: "Cancelled by admin reset." }
    }
  });
  console.log(`Reset ${result.count} stuck generations to FAILED.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
