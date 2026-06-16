import { acquireLock } from "./mutex.server";
import { captureException } from "./sentry.server";

// Global Circuit Breaker State (in memory is fine for node process, but could use Redis if needed)
const circuitBreakers = new Map<string, { failures: number, openUntil: number }>();
const MAX_FAILURES = 5;
const CIRCUIT_OPEN_MS = 60000; // 1 minute

export class ShopifyRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyRateLimitError";
  }
}

export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

function checkCircuitBreaker(shopDomain: string) {
  const cb = circuitBreakers.get(shopDomain);
  if (cb && cb.failures >= MAX_FAILURES) {
    if (Date.now() < cb.openUntil) {
      throw new CircuitBreakerOpenError(`Circuit breaker open for ${shopDomain} due to repeated 5xx errors.`);
    } else {
      // Half-open: let one request through
      circuitBreakers.set(shopDomain, { failures: MAX_FAILURES - 1, openUntil: 0 });
    }
  }
}

function recordCircuitFailure(shopDomain: string) {
  const cb = circuitBreakers.get(shopDomain) || { failures: 0, openUntil: 0 };
  cb.failures += 1;
  if (cb.failures >= MAX_FAILURES) {
    cb.openUntil = Date.now() + CIRCUIT_OPEN_MS;
    captureException(new Error(`Circuit breaker triggered for ${shopDomain}`));
  }
  circuitBreakers.set(shopDomain, cb);
}

function recordCircuitSuccess(shopDomain: string) {
  circuitBreakers.delete(shopDomain);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function executeWithRetry(shopDomain: string, requestFn: () => Promise<Response>): Promise<any> {
  const MAX_RETRIES = 10;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    checkCircuitBreaker(shopDomain);

    try {
      const response = await requestFn();
      
      if (response.status >= 500) {
        recordCircuitFailure(shopDomain);
        if (attempt === MAX_RETRIES - 1) throw new Error(`Shopify 5xx Error: ${response.status} ${response.statusText}`);
      } else if (response.status === 429) {
        // Throttled (REST)
        // Backoff with jitter
        const delay = Math.pow(2, attempt) * 500 + Math.random() * 500;
        await sleep(delay);
        attempt++;
        continue;
      } else {
        recordCircuitSuccess(shopDomain);
        
        const data = await response.json();
        
        // Handle GraphQL specific rate limiting
        if (data.errors && Array.isArray(data.errors) && data.errors.some((e: any) => e.extensions?.code === 'THROTTLED')) {
          const delay = Math.pow(2, attempt) * 500 + Math.random() * 500;
          await sleep(delay);
          attempt++;
          continue;
        }

        if (data.errors) {
          const errMsg = Array.isArray(data.errors) ? data.errors[0]?.message : (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors));
          throw new Error(`Shopify API Error: ${errMsg}`);
        }

        return data;
      }
    } catch (error: any) {
      if (error instanceof CircuitBreakerOpenError) throw error;
      if (attempt === MAX_RETRIES - 1) throw error;
    }
    
    // Default backoff for network errors
    const delay = Math.pow(2, attempt) * 500 + Math.random() * 500;
    await sleep(delay);
    attempt++;
  }
}

export async function graphqlRequest(shopDomain: string, accessToken: string, query: string, variables: any = {}, serialize: boolean = false) {
  const url = `https://${shopDomain}/admin/api/2024-10/graphql.json`;
  
  const requestFn = () => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (serialize) {
    const releaseLock = await acquireLock(`graphql:${shopDomain}`);
    try {
      return (await executeWithRetry(shopDomain, requestFn)).data;
    } finally {
      await releaseLock();
    }
  } else {
    return (await executeWithRetry(shopDomain, requestFn)).data;
  }
}

export async function restRequest(shopDomain: string, accessToken: string, method: string, path: string, body?: any, serialize: boolean = false) {
  const url = `https://${shopDomain}/admin/api/2024-10/${path}`;
  
  const requestFn = () => fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (serialize) {
    const releaseLock = await acquireLock(`rest:${shopDomain}`);
    try {
      return await executeWithRetry(shopDomain, requestFn);
    } finally {
      await releaseLock();
    }
  } else {
    return await executeWithRetry(shopDomain, requestFn);
  }
}
