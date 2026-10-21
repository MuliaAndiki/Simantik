package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// RegisterStimulusRoutes mounts /stimuli/* (behind API secret + JWT).
// Create/read/update/link: admin + content_manager. Delete + backfill: admin.
func RegisterStimulusRoutes(api fiber.Router, cfg *config.Config, h *handler.StimulusHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOrCM := middleware.RequireRoles("admin", "content_manager")
	adminOnly := middleware.RequireRoles("admin")

	stimuli := api.Group("/stimuli", auth)
	stimuli.Get("/", adminOrCM, h.ListStimuli)
	stimuli.Post("/", adminOrCM, h.CreateStimulus)
	stimuli.Get("/:id", adminOrCM, h.GetStimulus)
	stimuli.Patch("/:id", adminOrCM, h.UpdateStimulus)
	stimuli.Delete("/:id", adminOrCM, h.DeleteStimulus)
	stimuli.Post("/:id/questions", adminOrCM, h.LinkQuestion)
	stimuli.Delete("/questions/:questionId", adminOrCM, h.UnlinkQuestion)

	api.Post("/admin/stimuli/backfill", auth, adminOnly, h.BackfillStimuli)
}
