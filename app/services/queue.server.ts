import { Queue, Worker } from "bullmq";
import { redis } from "./redis.server";

// Queues
export const generatorQueue = new Queue("generator", {
  connection: redis as any,
});

export const healthQueue = new Queue("health", {
  connection: redis as any,
});

export const aiQueue = new Queue("ai", {
  connection: redis as any,
});

export const webhookQueue = new Queue("webhooks", {
  connection: redis as any,
});

export const youtubeQueue = new Queue("youtube", {
  connection: redis as any,
});

// We will implement workers inside their respective domain folders,
// e.g. services/generator/pipeline.server.ts will instantiate the generator worker.
import "./generator/pipeline.server";
import "./webhook-worker.server";
import "./youtube/monitor-worker.server";
import "./youtube/process-worker.server";
