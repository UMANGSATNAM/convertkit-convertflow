import { Queue, Worker } from "bullmq";
import { redis } from "./redis.server";

// Generic Background Jobs Queue
export const backgroundJobsQueue = new Queue("background-jobs", {
  connection: redis,
});

// Webhooks Queue
export const webhooksQueue = new Queue("webhooks", {
  connection: redis,
});

// Create workers if needed, though they are usually started in a separate process
// For now, we instantiate them here to ensure they exist in development
const backgroundJobsWorker = new Worker(
  "background-jobs",
  async (job) => {
    console.log(`Processing background job ${job.id} of type ${job.name}`);
    // Implement job processing logic here
  },
  { connection: redis }
);

const webhooksWorker = new Worker(
  "webhooks",
  async (job) => {
    console.log(`Processing webhook job ${job.id} of type ${job.name}`);
    // Implement job processing logic here
  },
  { connection: redis }
);

backgroundJobsWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

backgroundJobsWorker.on("failed", (job, err) => {
  console.error(`${job?.id} has failed with ${err.message}`);
});

webhooksWorker.on("completed", (job) => {
  console.log(`Webhook ${job.id} has completed!`);
});

webhooksWorker.on("failed", (job, err) => {
  console.error(`Webhook ${job?.id} has failed with ${err.message}`);
});
