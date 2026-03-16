import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as mariadb from "mariadb";

let prisma;

function buildPool() {
  const raw = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (!raw) throw new Error("DATABASE_URL or MYSQL_URL environment variable is not set.");

  const url = new URL(raw.replace(/^mysql:\/\//, "mariadb://"));

  return mariadb.createPool({
    host: url.hostname,
    port: url.port ? parseInt(url.port, 10) : 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 10,
  });
}

if (process.env.NODE_ENV !== "production") {
  if (!global.__prisma) {
    const pool = buildPool();
    const adapter = new PrismaMariaDb(pool);
    global.__prisma = new PrismaClient({ adapter });
  }
  prisma = global.__prisma;
} else {
  const pool = buildPool();
  const adapter = new PrismaMariaDb(pool);
  prisma = new PrismaClient({ adapter });
}

export default prisma;
