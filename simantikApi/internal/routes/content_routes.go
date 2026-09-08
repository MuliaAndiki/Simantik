package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterContentRoutes(api fiber.Router, cfg *config.Config, h *handler.ContentHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOrCM := middleware.RequireRoles("admin", "content_manager")
	adminOnly := middleware.RequireRoles("admin")

	// ─── CMS Endpoints (Admin & Content Manager) ─────────────────────────────
	cms := api.Group("/cms", auth, adminOrCM)

	// News CMS
	cms.Post("/news", h.CreateNews)
	cms.Get("/news", h.ListNewsAdmin)
	cms.Get("/news/:id", h.GetNewsByID)
	cms.Patch("/news/:id", h.UpdateNews)
	cms.Patch("/news/:id/status", h.UpdateNewsStatus)
	cms.Delete("/news/:id", adminOnly, h.DeleteNews)

	// Documentation CMS
	cms.Post("/documentation", h.CreateDocumentation)
	cms.Get("/documentation", h.ListDocumentationAdmin)
	cms.Get("/documentation/:id", h.GetDocumentationByID)
	cms.Patch("/documentation/:id", h.UpdateDocumentation)
	cms.Patch("/documentation/:id/status", h.UpdateDocumentationStatus)
	cms.Delete("/documentation/:id", adminOnly, h.DeleteDocumentation)

	// Testimonials CMS
	cms.Get("/testimonials", h.ListTestimonialsAdmin)
	cms.Patch("/testimonials/:id/status", h.UpdateTestimonialStatus)
	cms.Delete("/testimonials/:id", adminOnly, h.DeleteTestimonial)

	// ─── Public Endpoints ────────────────────────────────────────────────────
	// Public News
	api.Get("/news", h.ListNewsPublic)
	api.Get("/news/:slug", h.GetNewsBySlug)

	// Public Documentation
	api.Get("/documentation", h.ListDocumentationPublic)
	api.Get("/documentation/:slug", h.GetDocumentationBySlug)

	// Public Testimonials
	api.Get("/testimonials", h.ListTestimonialsPublic)
	api.Post("/testimonials", h.CreateTestimonial)
}
