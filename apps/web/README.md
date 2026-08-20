# Marble Web Frontend

React SPA for Marble with Deno + Vite + Tailwind.

## Getting Started

```bash
# Development server
deno task dev

# Build for production
deno task build

# Preview production build
deno task preview

# Type check
deno task check
```

## Development

Dev server runs on `http://localhost:5173`
API proxy configured to forward `/api/*` to `http://localhost:3000/*`

## Structure

- `src/app.tsx` - Main App component
- `src/main.tsx` - Entry point with providers
- `src/index.css` - Global styles + Tailwind
- `src/atoms.ts` - Jotai state management atoms
- `src/i18n/` - Internationalization (English & Hindi)
- `index.html` - HTML template
- `vite.config.ts` - Vite + Tailwind configuration
- `tailwind.config.ts` - Tailwind CSS config

## Features

- **React 18** with TypeScript
- **Vite** for fast development & builds
- **Tailwind CSS** for styling
- **TanStack Query** for data fetching & caching
- **Jotai** for state management
- **i18next** for internationalization (EN, HI)
- Deno native tooling
- API proxy to backend (dev mode)
- Language switcher in header

