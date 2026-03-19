export async function shopifyFetchWithRetry(url, options = {}, maxRetries = 3) {
  let attempt = 0;
  let delayMs = 1000;

  while (attempt <= maxRetries) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      if (attempt === maxRetries) {
        throw new Error(`Shopify API rate limit exceeded after ${maxRetries} retries`);
      }
      const retryAfter = response.headers.get("Retry-After");
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delayMs;
      
      console.warn(`[Shopify API] 429 Rate Limit hit. Retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      attempt++;
      delayMs *= 2; // Exponential backoff for fallback
      continue;
    }

    return response;
  }
}
