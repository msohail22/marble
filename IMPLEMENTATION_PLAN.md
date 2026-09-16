# Implementation Plan: Tailwind CSS UI Setup, OpenAPI Schema & Orbit Healthcheck API

This document outlines the architecture and execution strategy for adding Tailwind CSS to `/ui`, establishing OpenAPI as the single source of truth for cross-language schemas (TypeScript types and C++ models), building a high-performance C++ Healthcheck API in `/orbit`, and enforcing CI code-generation check rules.

---

## 1. UI Package (`/ui`) Setup

### 1.1 Tailwind CSS Integration (Completed & Verified)
- **Dependencies**: Installed `tailwindcss` v4 and `@tailwindcss/vite` plugin via `pnpm`.
- **Vite Plugin Configuration (`ui/vite.config.ts`)**: Added `@tailwindcss/vite` plugin to `plugins` array.
- **Global CSS (`ui/src/index.css`)**: Imported Tailwind CSS directives via `@import "tailwindcss";`.
- **Verification**: Executed `pnpm build` (`tsc -b && vite build`) to verify clean CSS output bundling without errors.

### 1.2 Modular React Architecture (Planned)
Organize `ui/src/` into a production-ready structure once OpenAPI generation is active:
```
ui/src/
├── generated/        # OpenAPI generated TypeScript interfaces & client schemas
│   ├── models/       # Generated data models (e.g. HealthStatus)
│   └── index.ts      # Generated types entrypoint
├── components/       # Reusable UI components
├── services/         # API service wrappers consuming generated types
├── hooks/            # Custom React hooks (e.g., useHealthCheck)
├── context/          # React Context providers
├── pages/            # Page layouts and views
├── types/            # App-specific UI types
└── utils/            # Shared formatting helpers
```

---

## 2. OpenAPI as Single Source of Truth & Code Generation

### 2.1 OpenAPI Specification (`openapi/orbit-api.yaml`)
- Maintain OpenAPI 3.1 specification at repository root (`docs/openapi/orbit-api.yaml` or `openapi/orbit-api.yaml`).
- Define the `/health` schema:
  ```yaml
  openapi: 3.1.0
  info:
    title: Orbit API
    version: 1.0.0
  paths:
    /health:
      get:
        summary: Service Healthcheck
        responses:
          '200':
            description: Health status
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/HealthStatus'
  components:
    schemas:
      HealthStatus:
        type: object
        required:
          - status
          - service
          - version
          - uptime_seconds
          - timestamp
        properties:
          status:
            type: string
            enum: [ok, degraded, down]
          service:
            type: string
          version:
            type: string
          uptime_seconds:
            type: integer
          timestamp:
            type: string
            format: date-time
  ```

### 2.2 Automated Code Generation (Build & CI)
- **TypeScript Generation**: Use `openapi-typescript` or `@openapitools/openapi-generator-cli` during `pnpm build` in `/ui` to generate `ui/src/generated/types.ts`.
- **C++ Model Generation**: Use `openapi-generator-cli` or custom Jinja2/Python script during CMake build tree configuration (`CMakeLists.txt`) to generate `orbit/src/generated/models.hpp` struct definitions compatible with `simdjson`.
- **Local Dev vs CI Commit Strategy**:
  - Generated files may be optionally committed for out-of-the-box local development without requiring full generator toolchains on developer machines.
  - **CI Drift Check Rule**: In GitHub Actions CI (`.github/workflows/ci.yml`), run a strict generation check step:
    1. Run OpenAPI model generation for both TS and C++.
    2. Execute `git status --porcelain`.
    3. Fail the CI pipeline with non-zero exit code if generated files differ from committed versions (`git diff --exit-code`).

---

## 3. Orbit Server (`/orbit`) C++ Healthcheck API

### 3.1 C++ Server Implementation
- **HTTP Endpoint**: `GET /health` responding with `200 OK` and JSON schema matching generated C++ `HealthStatus` model.
- **Server Architecture**:
  - `orbit/src/main.cpp`: Entrypoint initializing socket listener on port 8080.
  - `orbit/src/http_server.hpp` / `.cpp`: Non-blocking HTTP connection handler utilizing `llhttp`.
  - `orbit/src/health_controller.hpp` / `.cpp`: Health check handler using `spdlog` and `fmt` for structured JSON output.

### 3.2 CMake & Testing
- Integrate generated models into CMake `orbit` target.
- Add GoogleTest test suite in `orbit/tests/health_test.cpp` validating `/health` endpoint output formatting.

---

## 4. Execution & Git Release Strategy
- **Current Step**: Stage and commit **only** the Tailwind CSS setup files in `/ui` (`package.json`, `pnpm-lock.yaml`, `src/index.css`, `vite.config.ts`) and push directly to `master`.
- **Subsequent Steps**: Implement OpenAPI spec, generator scripts, GitHub Actions CI check, and C++ Orbit server `/health` endpoint.
