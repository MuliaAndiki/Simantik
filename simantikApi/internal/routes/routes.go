// Package routes wires Fiber route groups to handlers and middlewares.
package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// Handlers aggregates every domain handler the router needs. Add new
// domains here as the service grows.
type Handlers struct {
	User *handler.UserHandler
}

// Register mounts every route group under /api/v1, applying the API-secret
// gate to the whole API and JWT/role checks where needed.
func Register(app *fiber.App, cfg *config.Config, h *Handlers) {
	api := app.Group("/api/v1", middleware.APISecret(cfg.APISecret))

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"success": true, "message": "ok"})
	})

	registerUserRoutes(api, cfg, h.User)
}
