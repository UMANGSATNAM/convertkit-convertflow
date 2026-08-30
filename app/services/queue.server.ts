import { Queue } from "bullmq";
import { redis } from "./redis.server";

// Queues
export const webhookQueue = new Queue("webhooks", {
  connection: redis as any,
});

import "./webhook-worker.server";


