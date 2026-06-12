import { PostHog } from 'posthog-node';

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com';

let posthogClient: PostHog | null = null;

if (POSTHOG_API_KEY) {
  posthogClient = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
  });
}

export function trackEvent(distinctId: string, event: string, properties: Record<string, any> = {}) {
  if (!posthogClient) return;

  try {
    posthogClient.capture({
      distinctId,
      event,
      properties,
    });
  } catch (error) {
    console.error("PostHog track event failed", error);
  }
}

export function identifyUser(distinctId: string, properties: Record<string, any> = {}) {
  if (!posthogClient) return;

  try {
    posthogClient.identify({
      distinctId,
      properties,
    });
  } catch (error) {
    console.error("PostHog identify failed", error);
  }
}
