package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// registerUserRoutes mounts /auth/* (public, behind API secret only) and
// /users/* (behind API secret + JWT, with role-gated admin endpoints).
func registerUserRoutes(router fiber.Router, cfg *config.Config, h *handler.UserHandler) {
	auth := router.Group("/auth")
	auth.Post("/register", h.Register)
	auth.Post("/login", h.Login)

	users := router.Group("/users", middleware.JWTAuth(cfg.JWTSecret))
	users.Get("/me", h.Me)
	users.Get("/", middleware.RequireRoles("admin"), h.List)
	users.Get("/:id", h.GetByID)
	users.Put("/:id", h.Update)
	users.Delete("/:id", middleware.RequireRoles("admin"), h.Delete)
}
