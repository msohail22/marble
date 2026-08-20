import { app } from "./app.ts";

const port = parseInt(Deno.env.get("PORT") || "3000");

console.log(`🚀 Marble API running on http://localhost:${port}`);
console.log(`📊 Health check: http://localhost:${port}/health`);

Deno.serve({ port }, app.fetch);
