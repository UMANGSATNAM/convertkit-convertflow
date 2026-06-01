import fs from "node:fs";
import path from "node:path";
import express from "express";
import { createRequestHandler } from "@remix-run/express";

import { pathToFileURL } from "node:url";

const BUILD_PATH = path.resolve("build/server/index.js");
const BUILD_URL = pathToFileURL(BUILD_PATH).href;

const initialBuild = await import(BUILD_URL);
let build = initialBuild;

const app = express();
app.set("trust proxy", true); // CRITICAL FOR RAILWAY HTTPS PROXY

app.use(
  "/assets",
  express.static("build/client/assets", { immutable: true, maxAge: "1y" })
);
app.use(express.static("build/client", { maxAge: "1h" }));

app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? createDevRequestHandler()
    : createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

function createDevRequestHandler() {
  return async (req, res, next) => {
    try {
      return createRequestHandler({
        build,
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
