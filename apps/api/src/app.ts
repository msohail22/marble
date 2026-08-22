import { Hono } from "hono";
import accountRouter from "./routes/account.ts";
import type {
  HealthResponse,
  ReadyResponse,
  RootInfoResponse,
  ApiErrorResponse,
} from "@marble/types";

export const app = new Hono();

// Account management endpoints
app.route("/account", accountRouter);
app.route("/api/account", accountRouter);

// Health check endpoint
app.get("/health", (c) => {
  const health: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: performance.now(),
    version: "0.1.0",
  };
  return c.json(health);
});

// Ready check endpoint
app.get("/ready", (c) => {
  const ready: ReadyResponse = {
    ready: true,
    timestamp: new Date().toISOString(),
  };
  return c.json(ready);
});

// Root endpoint
app.get("/", (c) => {
  const root: RootInfoResponse = {
    name: "Marble API",
    version: "0.1.0",
    docs: "/health",
  };
  return c.json(root);
});

// 404 handler
app.notFound((c) => {
  const errorResponse: ApiErrorResponse = {
    error: "Not Found",
    path: c.req.path,
  };
  return c.json(errorResponse, 404);
});

