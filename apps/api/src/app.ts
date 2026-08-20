import { Hono } from "hono";

export const app = new Hono();

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Deno.metrics().ops,
    version: "0.1.0",
  });
});

// Ready check endpoint
app.get("/ready", (c) => {
  return c.json({
    ready: true,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (c) => {
  return c.json({
    name: "Marble API",
    version: "0.1.0",
    docs: "/health",
  });
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      path: c.req.path,
    },
    404
  );
});
