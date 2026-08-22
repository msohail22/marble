# Marble Project Development Guide

A comprehensive guide for developers and AI agents working on the Marble project. This document outlines the project structure, how to make changes, and conventions for working with the frontend and backend.

---

## 📁 Project Structure

```
marble/
├── apps/
│   ├── web/                 # FRONTEND (React + Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── app.tsx      # Main App component
│   │   │   ├── main.tsx     # Entry point
│   │   │   └── index.css    # Global styles
│   │   ├── vite.config.ts   # Vite configuration
│   │   ├── deno.json        # Deno/npm configuration
│   │   └── README.md        # Frontend-specific docs
│   │
│   ├── api/                 # BACKEND (Hono + Deno)
│   │   ├── src/
│   │   │   ├── index.ts     # Server entry point
│   │   │   └── routes/      # API routes
│   │   ├── deno.json        # Deno configuration
│   │   └── README.md        # Backend-specific docs
│   │
│   ├── control-plane/
│   ├── core/
│   └── ...
│
├── packages/
│   └── types/               # Shared TypeScript types
│
└── DEVELOPMENT.md           # THIS FILE
```

---

## 🎯 Key Principles

### Separation of Concerns
- **Frontend (`apps/web`)**: Handles UI, user interactions, and client-side logic
- **Backend (`apps/api`)**: Handles business logic, data persistence, and external integrations

### When to Make Changes
- **Frontend Only**: UI improvements, component refactoring, styling updates
- **Backend Only**: API optimization, database changes, business logic updates
- **Both**: When introducing new features that require both UI and API changes

### Guidelines for AI Agents
1. Keep changes isolated to their respective folders
2. Update shared types in `packages/types/` when needed
3. Document API contracts in `apps/api/README.md`
4. Document UI components in code comments
5. Always verify both services run without errors
6. **Mobile Responsiveness**: ALL web features, pages, and components MUST be fully mobile responsive across mobile, tablet, and desktop viewports (`sm:`, `md:`, `lg:`, `xl:` breakpoints).


---

## 🚀 Quick Start

### Prerequisites
- Deno 1.40+ (https://deno.land)
- Node.js 18+ (for npm packages)

### Starting Both Services

**Terminal 1 - Frontend:**
```bash
cd apps/web
deno task dev
# Dashboard will be available at http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd apps/api
deno task dev
# API will be available at http://localhost:8000
```

### Individual Service Commands

**Frontend (Web)**
```bash
cd apps/web

# Development server with hot reload
deno task dev

# Build for production
deno task build

# Preview production build
deno task preview

# Type checking
deno task check
```

**Backend (API)**
```bash
cd apps/api

# Development server with auto-reload
deno task dev

# Production start
deno task start

# Type checking
deno task check
```

---

## 🎨 Frontend Development

### Location
`apps/web/`

### Technology Stack
- **Framework**: React 18.3
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Data Fetching**: React Query (@tanstack/react-query)
- **Internationalization**: i18next

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── ProxyList.tsx    # Proxy management
│   ├── NanoserviceList.tsx  # Worker management
│   ├── StatCard.tsx     # Metric cards
│   └── index.ts         # Barrel export
├── pages/              # Page-level components
├── app.tsx             # Root component
├── main.tsx            # Entry point
├── atoms.ts            # Jotai state atoms
└── index.css           # Global styles
```

### Making Changes

**Adding a New Component:**
```typescript
// src/components/MyComponent.tsx
import React from "react";

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h1 className="text-white">{title}</h1>
    </div>
  );
}
```

Then export it in `src/components/index.ts`:
```typescript
export { MyComponent } from "./MyComponent";
```

**Making API Calls:**
```typescript
import { useQuery } from "@tanstack/react-query";

export function ProxyList() {
  const { data, isLoading } = useQuery({
    queryKey: ["proxies"],
    queryFn: async () => {
      const res = await fetch("/api/proxies");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{/* render proxies */}</div>;
}
```

### Styling
- Use Tailwind CSS utility classes
- Dark theme by default (grays + orange accent)
- Responsive design with `md:`, `lg:` breakpoints
- Custom colors in `tailwind.config.ts` if needed

### Running Tests/Linting
```bash
cd apps/web

# Type checking
deno task check

# No build-in tests yet, but you can add Jest/Vitest
```

---

## 🔌 Backend Development

### Location
`apps/api/`

### Technology Stack
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Deno
- **Database**: (To be configured)

### API Structure

```
src/
├── index.ts           # Server entry point
└── routes/            # API route handlers
    ├── proxies.ts     # /api/proxies endpoints
    ├── workers.ts     # /api/workers endpoints
    └── metrics.ts     # /api/metrics endpoints
```

### Making Changes

**Adding a New API Route:**
```typescript
// src/routes/proxies.ts
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  // GET /api/proxies
  return c.json({ proxies: [] });
});

app.post("/", async (c) => {
  // POST /api/proxies
  const body = await c.req.json();
  return c.json({ success: true, id: 123 });
});

export default app;
```

**Registering Routes in Main Server:**
```typescript
// src/index.ts
import { Hono } from "hono";
import proxiesRouter from "./routes/proxies.ts";

const app = new Hono();

app.route("/api/proxies", proxiesRouter);

Deno.serve({ port: 8000 }, app.fetch);
```

### API Response Format
```typescript
// Success response
{
  "success": true,
  "data": { /* payload */ }
}

// Error response
{
  "success": false,
  "error": "Error message"
}
```

### Running Tests/Linting
```bash
cd apps/api

# Type checking
deno task check

# No tests yet, but you can add Deno's test framework
```

---

## 🔄 Full Feature Implementation

### Example: Adding a New Feature (Proxy Management)

#### Step 1: Define Types
**File**: `packages/types/mod.ts`
```typescript
export interface Proxy {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  requests: number;
  uptime: string;
}

export interface ProxyCreateRequest {
  name: string;
}
```

#### Step 2: Create Backend API
**File**: `apps/api/src/routes/proxies.ts`
```typescript
import { Hono } from "hono";
import type { Proxy, ProxyCreateRequest } from "@marble/types";

const app = new Hono();

// GET all proxies
app.get("/", async (c) => {
  const proxies: Proxy[] = [
    { id: "1", name: "edge-proxy-1", status: "active", requests: 64, uptime: "99.9%" },
  ];
  return c.json(proxies);
});

// POST create proxy
app.post("/", async (c) => {
  const body: ProxyCreateRequest = await c.req.json();
  const newProxy: Proxy = {
    id: String(Date.now()),
    name: body.name,
    status: "inactive",
    requests: 0,
    uptime: "0%",
  };
  return c.json(newProxy, 201);
});

export default app;
```

#### Step 3: Create Frontend Component
**File**: `apps/web/src/components/ProxyList.tsx`
```typescript
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Proxy } from "@marble/types";

export function ProxyList() {
  const { data: proxies = [] } = useQuery({
    queryKey: ["proxies"],
    queryFn: async () => {
      const res = await fetch("/api/proxies");
      return res.json() as Promise<Proxy[]>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/proxies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      return res.json() as Promise<Proxy>;
    },
  });

  return (
    <div>
      {proxies.map((proxy) => (
        <div key={proxy.id}>{proxy.name}</div>
      ))}
    </div>
  );
}
```

#### Step 4: Integrate into Dashboard
**File**: `apps/web/src/components/Dashboard.tsx`
```typescript
import { ProxyList } from "./ProxyList";

export function Dashboard() {
  return (
    <div>
      <ProxyList />
    </div>
  );
}
```

---

## 📝 API Endpoints (Current & Planned)

### Proxies
- `GET /api/proxies` - List all proxies
- `POST /api/proxies` - Create new proxy
- `GET /api/proxies/:id` - Get proxy details
- `PUT /api/proxies/:id` - Update proxy
- `DELETE /api/proxies/:id` - Delete proxy

### Nanoservices (Workers)
- `GET /api/workers` - List all workers
- `POST /api/workers` - Deploy new worker
- `GET /api/workers/:id` - Get worker details
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Metrics
- `GET /api/metrics` - Get dashboard metrics
- `GET /api/metrics/proxies` - Proxy-specific metrics
- `GET /api/metrics/workers` - Worker-specific metrics

### Health
- `GET /api/health` - Health check endpoint

---

## 🛠️ Common Tasks

### Adding a New Page
1. Create `src/pages/MyPage.tsx`
2. Import and use in `src/app.tsx`
3. Add routing if using React Router

### Adding a New API Endpoint
1. Create/update route file in `apps/api/src/routes/`
2. Register route in `src/index.ts`
3. Update API endpoint documentation

### Updating Shared Types
1. Modify `packages/types/mod.ts`
2. Update imports in both web and api apps
3. Rebuild/restart services

### Styling
- Tailwind CSS is configured
- Dark theme (grays) with orange accent (#f38020)
- Use responsive classes: `md:`, `lg:`, `xl:`
- Icons from lucide-react available

---

## 🔍 Debugging

### Frontend
```bash
cd apps/web
deno task dev
# Open DevTools (F12) -> Console/Network tabs
```

### Backend
```bash
cd apps/api
deno task dev
# Check terminal output for logs
```

### Shared Types
```bash
# Verify type imports work
deno task check
```

---

## 📚 File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `Dashboard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `httpClient.ts`)
- **Hooks**: `useCamelCase.ts` (e.g., `useProxies.ts`)
- **Types**: `PascalCase.ts` (e.g., `types.ts`)

---

## 🚢 Deployment

### Frontend
```bash
cd apps/web
deno task build
# Output: dist/
```

### Backend
```bash
cd apps/api
# Already run-ready with: deno task start
```

---

## 📖 Documentation

- **Frontend README**: `apps/web/README.md`
- **Backend README**: `apps/api/README.md`
- **Type Definitions**: `packages/types/mod.ts`
- **Architecture**: `ARCHITECTURE.md`

---

## 🤝 Working with AI Agents

### For Any AI Agent
1. Read this file first
2. Identify what needs to change (frontend/backend/both)
3. Make changes in the appropriate folder
4. Update shared types if needed
5. Verify both services run without errors
6. Document changes in relevant README files

### Useful Patterns
```bash
# Check if changes broke anything
cd apps/web && deno task check
cd apps/api && deno task check

# View real-time logs
cd apps/web && deno task dev  # Web logs
cd apps/api && deno task dev  # API logs
```

---

## ✅ Checklist for New Features

- [ ] Types defined in `packages/types/mod.ts`
- [ ] Backend API implemented in `apps/api/src/routes/`
- [ ] Frontend component created in `apps/web/src/components/`
- [ ] Integration in main Dashboard / App component
- [ ] Mobile responsive layout verified across mobile, tablet, and desktop screens
- [ ] Both services start without errors
- [ ] Documentation updated
- [ ] No TypeScript errors (`deno task check`)


---

## 📞 Support

For questions about this structure, refer to:
- **Frontend**: `apps/web/README.md`
- **Backend**: `apps/api/README.md`
- **Architecture**: `ARCHITECTURE.md`
- **Types**: `packages/types/mod.ts`

---

**Last Updated**: August 22, 2026
**Maintainer**: Marble Development Team
