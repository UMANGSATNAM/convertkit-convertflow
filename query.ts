import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.storeGeneration.findUnique({ where: { id: 'cmrglhgbw0001vkm4558l8yt3' } }).then(job => {
  console.log(job);
  prisma.$disconnect();
});
