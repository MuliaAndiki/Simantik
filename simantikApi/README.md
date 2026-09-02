# boilerpad-go-service

Reusable Go REST API boilerplate: Fiber v2 + GORM + PostgreSQL (Neon-ready),
built for cloning into new microservices.

## Stack

- Go 1.25, [Fiber v2](https://github.com/gofiber/fiber)
- [GORM](https://gorm.io) + `gorm.io/driver/postgres` (pgx)
- [go-playground/validator](https://github.com/go-playground/validator)
- JWT via `golang-jwt/jwt/v5`, passwords via `bcrypt`
- [Air](https://github.com/air-verse/air) for live reload
- Docker multi-stage build

## Project layout

```
cmd/api          entry point (main.go): DI wiring, graceful shutdown
config           env config + GORM/PostgreSQL connection (Neon-tuned pool)
internal/middleware   API-secret, JWT, role middlewares
internal/models       GORM entities
internal/dto           request/response structs with validator tags
internal/repository    interface-driven DB access (GORM)
internal/service       business logic
internal/handler       Fiber HTTP handlers
internal/routes        route registration
pkg/utils        response envelope, validation, JWT, bcrypt helpers
migrations       stub for golang-migrate SQL migrations
```

## Getting started

```bash
cp .env.example .env
# fill in DATABASE_URL (Neon) or the local DB_* vars, API_SECRET, JWT_SECRET

go mod download
air              # live reload, or: go run ./cmd/api
```

## Docker

```bash
docker compose up --build
```

`docker-compose.yml` includes an optional local Postgres service for
development without Neon. Point `DATABASE_URL` at Neon and drop the
`postgres` service once you no longer need it locally.

## Auth model

Every route under `/api/v1` requires the `X-API-SECRET` header to match
`API_SECRET`. Routes under `/api/v1/users` additionally require a JWT
(`Authorization: Bearer <token>`, issued by `/api/v1/auth/login`), and some
are further gated by role via `middleware.RequireRoles("admin")`.

## Response envelope

Every handler responds with:

```json
{ "success": true, "message": "string", "data": {}, "error": null }
```

via `utils.Success` / `utils.Created` / `utils.Error` / `utils.ValidationError`
in `pkg/utils/response.go` — handlers never build JSON manually.

## Adding a new domain

Mirror the `User` vertical slice: DTO -> model -> repository interface +
GORM impl -> service interface + impl -> handler -> route file, then
register the handler in `internal/routes/routes.go`.

## Production notes

- Set `DB_AUTO_MIGRATE=false` and manage schema via `golang-migrate` using
  SQL files under `/migrations` (see `migrations/.gitkeep`).
- Rotate `API_SECRET`/`JWT_SECRET` via your secret manager; never commit
  `.env`.
