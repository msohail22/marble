# Marble Project Development Guide

A comprehensive guide for developers and AI agents working on the Marble project. This document outlines the project structure, how to make changes, and conventions for working with the frontend and Orbit (C++ control-plane backend).

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
│   ├── orbit/               # CONTROL-PLANE BACKEND (C++)
│   ├── core/                # PROXY CORE (C++)
│   └── ...
│
├── packages/
│   └── types/               # Shared TypeScript types
│
└── docs/
    └── DEVELOPMENT.md       # THIS FILE
```

---

## 🎯 Key Principles

### Separation of Concerns
- **Frontend (`apps/web`)**: Handles UI, user interactions, and client-side logic
- **Backend (`apps/orbit`)**: C++ Orbit control-plane process managing rules, metrics, and persistence, communicating with the Proxy Core over a Unix domain socket

### When to Make Changes
- **Frontend Only**: UI improvements, component refactoring, styling updates
- **Backend (`apps/orbit`) Only**: Rule store updates, Unix domain socket IPC, SQLite persistence, metrics counters
- **Both**: When introducing new management capabilities or API contracts between frontend/orbit backend

### Guidelines for AI Agents
1. Keep changes isolated to their respective folders
2. Update shared types in `packages/types/` when needed
3. Document API and IPC contracts clearly
4. Document UI components in code comments
5. Always verify all active services build and run without errors
6. **Mobile Responsiveness**: ALL web features, pages, and components MUST be fully mobile responsive across mobile, tablet, and desktop viewports (`sm:`, `md:`, `lg:`, `xl:` breakpoints).

---

## 🚀 Quick Start

### Prerequisites
- Deno 1.40+ / Node.js 18+ (for Frontend web app)
- C++20 compatible compiler (GCC/Clang), CMake/Bazel (for C++ Proxy & Orbit Control-Plane Backend)

### Starting Services

**Frontend:**
```bash
cd apps/web
deno task dev
# Dashboard will be available at http://localhost:5173
```

**Frontend Commands:**
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

### Styling
- Use Tailwind CSS utility classes
- Dark theme by default (grays + orange accent)
- Responsive design with `md:`, `lg:` breakpoints

---

## 🔌 marble Control-Plane Backend — Plan

**Architecture**
- Separate process from the proxy core, communicating over a **Unix domain socket** (push rule/config updates, pull live metrics)
- Rewriting from the existing **Hono/Deno** API to C++

**Networking / concurrency**
- **epoll (or io_uring for consistency with the proxy)** — non-blocking I/O
- **Thread-per-core event loops** — each thread owns its own set of connections, no handoff between threads
- **CPU pinning** (`pthread_setaffinity_np`) — keep each thread on one core, avoid cache churn
- ❌ No thread pool + blocking sockets model
- ❌ No DPDK — kernel-bypass networking is overkill for an admin API
- ❌ No NUMA tuning — irrelevant unless running on multi-socket hardware

**HTTP handling**
- **llhttp** — same parser as the proxy core, for consistency
- ❌ No Drogon, Boost.Beast, Pistache, or any full framework — hand-rolled, for learning value

**Data / state**
- **Rules and config kept in RAM** — served from memory, no DB hit on reads
- **DB (SQLite is fine)** — only touched on writes, for persistence across restarts
- **Atomic pointer swap** for the in-memory rule store — build new version, swap pointer, no locks on reads
- **`std::mutex`/`std::atomic`** for other shared state (e.g. metrics counters) where simple locking is fine
- ❌ No ORM

**JSON / serialization**
- **simdjson** — fast parsing for request/response bodies
- (nlohmann/json is an acceptable fallback if simdjson feels like too much setup early on)

**Memory**
- **Preallocated buffers/pools** for request handling — reused per connection, not `new`-ed per request

**Explicitly out of scope for this backend** (belongs on the proxy hot path instead, if anywhere)
- DPDK, full lock-free everything, per-request zero-allocation guarantees, nanosecond-level profiling — this is a control-plane/admin API, not the live traffic path, so it gets a fast-but-reasonable treatment rather than HFT-grade treatment

**Build order**
1. Thread-per-core event loop skeleton (epoll/io_uring accept + read/write)
2. llhttp integration for request parsing
3. In-memory rule/config store with atomic swap
4. Unix socket IPC layer to the proxy process
5. REST endpoints (CRUD for rules, metrics read) using simdjson for (de)serialization
6. SQLite persistence layer wired in on the write path only

---

## 🔍 Debugging

### Frontend
```bash
cd apps/web
deno task dev
# Open DevTools (F12) -> Console/Network tabs
```

### Shared Types
```bash
cd apps/web && deno task check
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

### Orbit (Control-Plane Backend)
Build binary (`apps/orbit`) with C++ build toolchain (CMake/Bazel) and run as a system daemon or lightweight container communicating with proxy core via Unix socket.

---

## 📖 Documentation

- **Frontend README**: `apps/web/README.md`
- **Type Definitions**: `packages/types/mod.ts`
- **Architecture**: `ARCHITECTURE.md`

---

## 🤝 Working with AI Agents

### For Any AI Agent
1. Read this file first
2. Identify what needs to change (frontend / proxy / orbit control-plane backend)
3. Make changes in the appropriate folder
4. Update shared types if needed
5. Verify services build and run without errors
6. Document changes in relevant documentation files

---

## ✅ Checklist for New Features

- [ ] Types defined in `packages/types/mod.ts`
- [ ] Orbit control-plane REST endpoints & IPC handlers implemented in C++ (`apps/orbit`)
- [ ] Frontend component created in `apps/web/src/components/`
- [ ] Integration in main Dashboard / App component
- [ ] Mobile responsive layout verified across mobile, tablet, and desktop screens
- [ ] All services start without errors
- [ ] Documentation updated

---

## 📞 Support

For questions about this structure, refer to:
- **Frontend**: `apps/web/README.md`
- **Architecture**: `ARCHITECTURE.md`
- **Types**: `packages/types/mod.ts`

---

**Last Updated**: August 2026  
**Maintainer**: Marble Development Team
