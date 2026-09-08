package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// RegisterRecommendationRoutes mounts recommendation endpoints.
func RegisterRecommendationRoutes(api fiber.Router, cfg *config.Config, rh *handler.RecommendationHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)

	r := api.Group("/recommendations", auth)
	r.Post("/generate", rh.GenerateRecommendations)
	r.Get("/", rh.ListRecommendations)
	r.Delete("/:id", rh.DismissRecommendation)
}
