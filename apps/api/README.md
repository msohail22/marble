# Marble API

Deno + Hono REST API server for Marble.

## Getting Started

```bash
# Development with watch mode
deno task dev

# Production start
deno task start

# Type check
deno task check
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check (for monitoring)
- `GET /ready` - Readiness check (for K8s)

## Environment Variables

- `PORT` - Server port (default: 3000)

## Features

- Fast async HTTP server with Hono
- Deno native runtime (TypeScript by default)
- Health & readiness endpoints for Kubernetes
- Error handling with 404 fallback
