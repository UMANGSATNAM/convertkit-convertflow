import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as mariadb from "mariadb";

// ────────────────────────────────────────────────────────────────────────────
// Railway MySQL — more capable than Hostinger, safe to use a small pool.
// ────────────────────────────────────────────────────────────────────────────

function buildPool() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL environment variable is not set.");

  const url = new URL(raw.replace(/^mysql:\/\//, "mariadb://"));

  return mariadb.createPool({
    host: url.hostname,
    port: url.port ? parseInt(url.port, 10) : 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    acquireTimeout: 30_000,
    connectTimeout: 15_000,
    idleTimeout: 60_000,
    allowPublicKeyRetrieval: true,
  });
}

let prisma;

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
