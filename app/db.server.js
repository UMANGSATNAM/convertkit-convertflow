import { PrismaClient } from "@prisma/client";

let prisma;

const url = process.env.DATABASE_URL || process.env.MYSQL_URL || "";

if (process.env.NODE_ENV !== "production") {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      datasources: { db: { url } },
    });
  }
  prisma = global.__prisma;
} else {
  prisma = new PrismaClient({
    datasources: { db: { url } },
  });
}

export default prisma;
