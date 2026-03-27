/**
 * Simple in-memory rate limiter for public API routes.
 * Limits requests per IP (or shop domain) within a sliding window.
 */

const buckets = new Map();
const CLEANUP_INTERVAL = 60_000;

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > bucket.windowMs * 2) {
      buckets.delete(key);
    }
  }
}

/**
 * @param {string} key - Unique key (IP, shop domain, etc.)
 * @param {number} maxRequests - Max requests allowed in the window
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
export function rateLimit(key, maxRequests = 30, windowMs = 60_000) {
  cleanup();
  const now = Date.now();

  if (!buckets.has(key)) {
    buckets.set(key, { count: 1, windowStart: now, windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  const bucket = buckets.get(key);

  if (now - bucket.windowStart > windowMs) {
    bucket.count = 1;
    bucket.windowStart = now;
    return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  bucket.count++;

  if (bucket.count > maxRequests) {
    const retryAfterMs = windowMs - (now - bucket.windowStart);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  return { allowed: true, remaining: maxRequests - bucket.count, retryAfterMs: 0 };
}

/** Max string length validator */
export function truncate(str, maxLen = 500) {
  if (typeof str !== "string") return "";
  return str.length > maxLen ? str.slice(0, maxLen) : str;
}

/** Sanitize string - remove potential script injection */
export function sanitize(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
