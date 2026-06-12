import * as Sentry from "@sentry/remix";

export function captureException(error: any, context?: Record<string, any>) {
  console.error("Exception caught:", error);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}

export function captureMessage(message: string, context?: Record<string, any>) {
  console.log("Message captured:", message);
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, {
      extra: context,
    });
  }
}
