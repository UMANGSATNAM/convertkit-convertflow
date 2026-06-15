/* eslint-disable import/first */
// worker.ts
import dotenv from "dotenv";
dotenv.config();

// Initialize DB and Redis via imports
import prisma from "./app/db.server.js";
import { redis } from "./app/services/redis.server.js";

// Import all workers so they start processing jobs
import "./app/services/generator/pipeline.server.js"; // Needs to be compiled or run with tsx

console.log("Worker process started...");

// A simple loop to keep the process alive, or relying on BullMQ's active handles
process.on("SIGTERM", async () => {
  console.log("Shutting down worker process...");
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});
