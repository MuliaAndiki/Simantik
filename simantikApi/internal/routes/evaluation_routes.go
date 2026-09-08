package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// RegisterEvaluationRoutes mounts evaluation and attempt review endpoints.
func RegisterEvaluationRoutes(api fiber.Router, cfg *config.Config, eh *handler.EvaluationHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)

	eval := api.Group("/evaluations", auth)
	eval.Get("/profile", eh.GetCompetencyProfile)
	eval.Get("/", eh.ListMyEvaluations)
	eval.Get("/:id", eh.GetEvaluationByID)

	// Attempt evaluation and review endpoints
	attempts := api.Group("/attempts", auth)
	attempts.Get("/:attemptId/evaluation", eh.GetAttemptEvaluation)
	attempts.Get("/:attemptId/review", eh.GetAttemptReview)
}
