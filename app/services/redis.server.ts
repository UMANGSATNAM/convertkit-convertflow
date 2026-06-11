import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis: Redis;

declare global {
  var __redis: Redis | undefined;
}

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisOptions = {
  maxRetriesPerRequest: null,
  family: 4, // Force IPv4 (fixes many cloud proxy ECONNRESET issues)
  enableReadyCheck: false,
  retryStrategy(times: number) {
    // Exponential backoff to prevent log spamming on failure
    return Math.min(times * 50, 2000);
  },
  // Add TLS options if the URL uses rediss://
  ...(REDIS_URL.startsWith("rediss://") && {
    tls: { rejectUnauthorized: false }
  })
};

if (process.env.NODE_ENV === "production") {
  redis = new Redis(REDIS_URL, redisOptions);
} else {
  if (!global.__redis) {
    global.__redis = new Redis(REDIS_URL, redisOptions);
  }
  redis = global.__redis;
}

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export { redis };
