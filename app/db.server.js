import { PrismaClient } from "@prisma/client";

// In Prisma 7, because `url` was removed from `schema.prisma` config,
// we pass the connection URL directly to the constructor's `datasourceUrl` property.
const prismaClientConfig = {
  datasourceUrl: process.env.DATABASE_URL,
};

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient(prismaClientConfig);
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient(prismaClientConfig);

export default prisma;
