import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as mariadb from "mariadb";

// ────────────────────────────────────────────────────────────────────────────
// Hostinger shared MySQL has strict connection limits (~500/hour, low pool).
// We MUST cap at 1 connection and use a long pool_timeout so requests queue
// instead of failing instantly.  Do NOT use the default (10 connections).
// ────────────────────────────────────────────────────────────────────────────

function buildPool() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL environment variable is not set.");

  // Convert mysql:// → mariadb:// for the mariadb driver, then strip any
  // query-string params (mariadb.createPool uses its own options object).
  const url = new URL(raw.replace(/^mysql:\/\//, "mariadb://"));

  return mariadb.createPool({
    host: url.hostname,
    port: url.port ? parseInt(url.port, 10) : 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 1,        // Never open more than 1 connection — Hostinger limit
    acquireTimeout: 60_000,    // Wait up to 60 s for a connection before error
    connectTimeout: 30_000,    // TCP connect timeout
    idleTimeout: 60_000,       // Close idle connections after 60 s
    allowPublicKeyRetrieval: true,
    ssl: false,                // Hostinger shared MySQL — no SSL on port 3306
  });
}

let prisma;

if (process.env.NODE_ENV !== "production") {
  // In dev, reuse the single global instance across hot-reloads
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
