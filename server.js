import path from "node:path";
import express from "express";
import { createRequestHandler } from "@remix-run/express";

import { pathToFileURL } from "node:url";
import { installGlobals } from "@remix-run/node";

const BUILD_PATH = path.resolve("build/server/index.js");
const BUILD_URL = pathToFileURL(BUILD_PATH).href;

const initialBuild = await import(BUILD_URL);
let build = initialBuild;

installGlobals({ nativeFetch: build.future?.v3_singleFetch === true });

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

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Express server listening on port ${port} at 0.0.0.0`);
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
