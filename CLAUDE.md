# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 + TypeScript frontend for a backend management system. Uses Rsbuild as the build tool (migrated from vue-cli, some vue-cli devDependencies remain). Element Plus components are auto-imported via unplugin-auto-import and unplugin-vue-components.

always use pnpm, not npm

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (port 8080)
pnpm run build        # Production build
pnpm run lint         # Lint with @antfu/eslint-config
pnpm run preview      # Preview production build
```

### Module-specific dev servers

The project supports selective module compilation for faster dev startup:

```bash
pnpm run serve:service     # Dev with only service module
pnpm run serve:product    # Dev with only product module
pnpm run serve:knowledge  # Dev with only knowledge module
pnpm run serve:expense    # Dev with only expenseType module
pnpm run serve:accounting # Dev with only accounting module
pnpm run serve:demo       # Dev with only demo module
```

Set `VUE_APP_DEV_MODULE` env var to choose which module to compile. Other modules are physically excluded via Rsbuild's null-loader.

## Architecture

### Tech Stack
- **Framework**: Vue 3 (Composition API) + TypeScript
- **Build**: Rsbuild (@rsbuild/core)
- **State**: Pinia
- **Router**: Vue Router 4 with lazy-loaded routes
- **UI**: Element Plus (auto-imported, no manual imports needed)
- **HTTP**: Axios with interceptors (token injection, error handling)
- **Linting**: ESLint 9 + @antfu/eslint-config (flat config at `eslint.config.mjs`)

### Directory Structure

```
src/
├── api/           # API definitions (auth, expenseType, upload, etc.)
├── components/    # Shared Vue components
├── router/        # Vue Router configuration (lazy-loaded business routes)
├── store/         # Pinia stores (user store with auth state + tabs)
├── utils/         # Utilities: axios wrapper (request.ts), validators
├── views/         # Page components, organized by business module
│   ├── Layout.vue # Main layout with tabs
│   ├── Login.vue  # Login page
│   ├── service/   # Service module
│   ├── product/   # Product module (list + edit)
│   ├── employee/  # Employee roster (list, add, edit)
│   ├── department/# Department management
│   └── ...
└── permission.ts   # Router guard (auth check)
```

### API Layer

`src/utils/request.ts` exports an axios wrapper with:
- `Authorization: Bearer <token>` injection from sessionStorage
- Response interceptor that checks `res.code === 200`
- HTTP status code handling (401 → login redirect, 403, 404, 500)
- Exported methods: `get`, `post`, `put`, `patch`, `delete`, `upload`

### Auth Flow

- Token stored in `sessionStorage` under key `token`
- `src/permission.ts` router guard checks token before non-login routes
- User store (`src/store/index.ts`) persists user info to sessionStorage

### Key Patterns

- Element Plus components are auto-imported - no need to import them in components
- `@/` alias maps to `src/`
- Routes use webpack chunk naming comments for code splitting
- Dev proxy: `/api` → `http://127.0.0.1:3000`
