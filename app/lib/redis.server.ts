import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis: Redis;

declare global {
  var __redis: Redis | undefined;
}

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

if (process.env.NODE_ENV === "production") {
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
  });
} else {
  if (!global.__redis) {
    global.__redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }
  redis = global.__redis;
}

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export { redis };
