import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV !== "production") {
  if (!(global as any).__prisma) {
    (global as any).__prisma = new PrismaClient();
  }
  prisma = (global as any).__prisma;
} else {
  prisma = new PrismaClient();
}

export default prisma;
