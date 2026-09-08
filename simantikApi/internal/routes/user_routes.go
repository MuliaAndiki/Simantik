package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// registerUserRoutes mounts /users/* (behind API secret + JWT, with role-gated admin endpoints).
func registerUserRoutes(router fiber.Router, cfg *config.Config, h *handler.UserHandler) {
	users := router.Group("/users", middleware.JWTAuth(cfg.JWTSecret))

	// Authenticated user profile routes
	users.Get("/me", h.Me)
	users.Patch("/me", h.UpdateMe)
	users.Patch("/me/password", h.ChangePassword)
	users.Patch("/me/avatar", h.UpdateAvatar)
	users.Get("/me/roles", h.GetMyRoles)

	// Admin-only management routes
	adminOnly := middleware.RequireRoles("admin")
	users.Get("/", adminOnly, h.List)
	users.Get("/:id", adminOnly, h.GetByID)
	users.Patch("/:id/status", adminOnly, h.UpdateStatus)
}
