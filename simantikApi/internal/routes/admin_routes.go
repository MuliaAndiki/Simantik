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

	// ponytail: guard role per-route, BUKAN di grup /admin.
	// Guard di grup menempel sebagai middleware prefix dan menimpa grup
	// turunan (/admin/reports butuh adminOrCM) sehingga CM selalu 403.
	admin := api.Group("/admin", auth)
	admin.Get("/dashboard", adminOnly, h.GetDashboard)
	admin.Get("/users", adminOnly, h.ListUsers)
	admin.Get("/users/:id", adminOnly, h.GetUserDetail)
	admin.Get("/users/:id/activities", adminOnly, h.GetUserActivities)
	admin.Get("/users/:id/progress", adminOnly, h.GetUserProgress)
	admin.Patch("/users/:id/status", adminOnly, h.UpdateUserStatus)
	admin.Patch("/users/:id/role", adminOnly, h.UpdateUserRole)
}
