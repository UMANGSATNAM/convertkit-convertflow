import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as mariadb from "mariadb";

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace("mysql://", "mariadb://") : undefined;
const pool = mariadb.createPool(connectionString);
const adapter = new PrismaMariaDb(pool);

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient({ adapter });
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient({ adapter });

export default prisma;
