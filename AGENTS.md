# AGENTS.md

Polyglot monorepo for SIMANTIK: Go REST API (`simantikApi/`) and Next.js App Router frontend (`web/`).

## Quick Reference Commands

Always run commands inside the respective subdirectory (`simantikApi/` or `web/`).

### Backend (`simantikApi/`)
- **Run dev**: `air` (live reload) or `go run ./cmd/api`
- **Run all tests**: `go test ./...` or `go test -v -race ./...`
- **Run single test**: `go test -v -run TestAuthService_Register_Success ./tests/service/...`
- **Vet**: `go vet ./...`

### Frontend (`web/`)
Uses **Bun** as runtime and package manager (do not use npm, yarn, or pnpm):
- **Install**: `bun install --frozen-lockfile` (CI) or `bun install`
- **Run dev**: `bun run dev`
- **Lint & format check**: `bun run check` (Biome)
- **Auto-fix lint/formatting**: `bun run check:write`
- **Run all tests**: `bun test`
- **Run single test**: `bun test src/utils/string.format.test.ts`
- **Production build check**: `SKIP_ENV_VALIDATION=true bun run build`

### Full Stack (Docker)
From repo root:
- `docker compose up --build` (Nginx proxy on port 80, 2x API instances on 8080, 2x Web instances on 3000, Jaeger on 16686, PostgreSQL on 5432)

---

## Architecture & Conventions

### Backend (`simantikApi`)
- **Stack**: Go 1.25 + Fiber v2 + GORM + PostgreSQL / Neon.
- **Vertical Slice Pattern**: DTO (`internal/dto/`) -> Model (`internal/models/`) -> Repository (`internal/repository/`) -> Service (`internal/service/`) -> Handler (`internal/handler/`) -> Routes (`internal/routes/`).
- **Response Envelope**: Never construct raw JSON responses in handlers. Use `pkg/utils/response.go` (`utils.Success`, `utils.Created`, `utils.Error`, `utils.ValidationError`).
- **Unit Tests**: Place tests in `tests/`. Use hand-rolled in-memory mock repositories; no live database is needed for unit tests.
- **Database Migrations**:
  - Development: GORM AutoMigrate is active when `DB_AUTO_MIGRATE=true` (runs `config.AutoMigrateDev` + `config.SeedInitialData`).
  - Production: Set `DB_AUTO_MIGRATE=false`; manage schema via `golang-migrate` SQL files in `migrations/` (`*.up.sql` / `*.down.sql`).

### Frontend (`web`)
- **Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Bun + Biome + Tailwind CSS v4.
- **Atomic Design**: `atoms/` -> `molecules/` -> `organisms/` -> `templates/` -> `page/`.
- **Strict Client Boundary**: Only `Container` components (or `_containers/`) may use `'use client'`. UI components (`atoms`, `molecules`, `organisms`, `templates`, `page`) must remain server-compatible presentational components.
- **No Hidden Logic in UI**: Never invoke `useQuery`, `useMutation`, `useRouter`, `fetch`, or services inside presentational components. Containers orchestrate state, mutations, and routing, passing callbacks and data down explicitly via props.
- **Query Keys**: Centralize TanStack Query keys in `src/configs/query-key.ts`.
- **API Communication**: HTTP calls go through `src/services/api/` using `src/api/client/client-http.ts` (client) or `src/api/server/server-fetch.ts` (server).

---

## Key Integration Gotchas

- **Shared Secret Gate**: All `/api/v1/*` routes require `X-Internal-Api-Key` or `X-API-Secret`. Frontend `NEXT_INTERNAL_API_SECRET` must match backend `API_SECRET`.
- **Health Check Exemption**: `/health` is public (no API secret required) for load balancers and Docker health checks.
- **Env Validation**: Frontend uses `@t3-oss/env-nextjs` in `src/configs/env.config.ts`. In CI or minimal test environments, export `SKIP_ENV_VALIDATION=true` or `CI=true`.
- **Nginx Routing**: Reverse proxy routes `/api/` to backend instances and `/` to frontend instances.
