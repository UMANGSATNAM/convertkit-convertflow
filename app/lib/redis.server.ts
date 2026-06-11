import Redis from "ioredis";

let redis: Redis;

declare global {
  var __redis: Redis | undefined;
}

// Ensure we have a valid URL or fallback to localhost for development
const redisUrl = process.env.REDIS_URL || process.env.REDIS_PRIVATE_URL || "redis://localhost:6379";

if (process.env.NODE_ENV === "production") {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
} else {
  if (!global.__redis) {
    global.__redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }
  redis = global.__redis;
}

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export { redis };
