import { redis } from "./app/services/redis.server.js";

async function flush() {
  console.log("Flushing Redis...");
  await redis.flushdb();
  console.log("Redis flushed.");
  process.exit(0);
}

flush();
