package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterAdminRoutes(api fiber.Router, cfg *config.Config, h *handler.AdminHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOnly := middleware.RequireRoles("admin")

	admin := api.Group("/admin", auth, adminOnly)
	admin.Get("/dashboard", h.GetDashboard)
	admin.Get("/users", h.ListUsers)
	admin.Get("/users/:id", h.GetUserDetail)
	admin.Patch("/users/:id/status", h.UpdateUserStatus)
	admin.Patch("/users/:id/role", h.UpdateUserRole)
}
