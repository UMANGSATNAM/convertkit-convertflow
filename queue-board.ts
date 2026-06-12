import express from "express";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { generatorQueue, healthQueue, aiQueue, webhookQueue } from "./app/services/queue.server.js";

const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(generatorQueue),
    new BullMQAdapter(healthQueue),
    new BullMQAdapter(aiQueue),
    new BullMQAdapter(webhookQueue),
  ],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

const port = 3001;
app.listen(port, () => {
  console.log(`BullMQ Board running on http://localhost:${port}/admin/queues`);
});
