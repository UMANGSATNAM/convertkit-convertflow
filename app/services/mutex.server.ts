import { redis } from "./redis.server";

const LOCK_EXPIRY_MS = 30000; // 30 seconds
const RETRY_DELAY_MS = 100;
const MAX_LOCK_WAIT_MS = 60000; // Wait up to 1 minute to acquire lock

/**
 * Acquires a distributed lock for a specific key (e.g., a shop domain).
 * Returns a release function.
 */
export async function acquireLock(key: string): Promise<() => Promise<void>> {
  const lockKey = `lock:${key}`;
  const lockValue = Math.random().toString(36).substring(2);
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_LOCK_WAIT_MS) {
    // Attempt to acquire lock
    // NX = Only set if not exists, PX = Expire in milliseconds
    const acquired = await redis.set(lockKey, lockValue, "PX", LOCK_EXPIRY_MS, "NX");

    if (acquired === "OK") {
      // Return a function to release the lock using a Lua script to ensure we only delete OUR lock
      return async () => {
        const script = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        await redis.eval(script, 1, lockKey, lockValue);
      };
    }

    // Wait and try again
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  }

  throw new Error(`Timeout acquiring lock for ${key}`);
}
