import { PrismaClient } from "@prisma/client";

let prisma;

const datasourceUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || "";

if (process.env.NODE_ENV !== "production") {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({ datasourceUrl });
  }
  prisma = global.__prisma;
} else {
  prisma = new PrismaClient({ datasourceUrl });
}

export default prisma;
