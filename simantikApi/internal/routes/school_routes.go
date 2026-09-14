package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterSchoolRoutes(api fiber.Router, cfg *config.Config, h *handler.SchoolHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOnly := middleware.RequireRoles("admin")

	schools := api.Group("/admin/schools", auth, adminOnly)
	schools.Get("/", h.ListSchools)
	schools.Get("/:id", h.GetSchool)
	schools.Post("/", h.CreateSchool)
	schools.Patch("/:id", h.UpdateSchool)
	schools.Delete("/:id", h.DeleteSchool)


	api.Get("/schools", h.ListSchools)
	api.Get("/schools/:id", h.GetSchool)
}
