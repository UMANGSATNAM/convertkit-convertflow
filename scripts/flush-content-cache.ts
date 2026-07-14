import { redis } from "../app/services/redis.server.js";

async function flushContentCache() {
  console.log("Checking for content:* keys in Redis...");
  const keys = await redis.keys("content:*");
  if (keys.length === 0) {
    console.log("No content:* keys found in Redis.");
  } else {
    console.log(`Found ${keys.length} content keys:`, keys);
    const deleted = await redis.del(...keys);
    console.log(`Successfully flushed ${deleted} content cache entries from Redis.`);
  }
  process.exit(0);
}

flushContentCache().catch((err) => {
  console.error("Error flushing content cache:", err);
  process.exit(1);
});
