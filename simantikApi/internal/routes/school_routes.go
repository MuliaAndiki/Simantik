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
	schools.Patch("/:id/verify", h.VerifySchool)
	schools.Patch("/:id/reject", h.RejectSchool)
	schools.Delete("/:id", h.DeleteSchool)

	api.Get("/schools", h.ListPublicSchools)
	api.Get("/schools/submissions/me", auth, h.ListMySubmissions)
	api.Post("/schools/submissions", auth, h.ProposeSchool)
	api.Get("/schools/:id", h.GetPublicSchool)
}
