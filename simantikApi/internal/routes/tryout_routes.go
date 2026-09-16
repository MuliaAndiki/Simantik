package routes

import (
	"github.com/gofiber/fiber/v2"
	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterTryoutRoutes(api fiber.Router, cfg *config.Config, th *handler.TryoutHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOrCM := middleware.RequireRoles("admin", "content_manager")
	adminOnly := middleware.RequireRoles("admin")

	t := api.Group("/tryouts", auth)
	t.Get("/", th.ListTryouts)
	t.Post("/", adminOrCM, th.CreateTryout)
	t.Get("/:id", th.GetTryout)
	t.Patch("/:id", adminOrCM, th.UpdateTryout)
	t.Patch("/:id/status", adminOrCM, th.UpdateTryoutStatus)
	t.Delete("/:id", adminOnly, th.DeleteTryout)
	t.Post("/:id/questions", adminOrCM, th.AddQuestions)
	t.Delete("/:id/questions/:questionId", adminOrCM, th.RemoveQuestion)
}

func RegisterAttemptRoutes(api fiber.Router, cfg *config.Config, ah *handler.TryoutAttemptHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)

	// Nested under tryout for starting
	api.Post("/tryouts/auto/attempts", auth, ah.StartAttempt)
	api.Post("/tryouts/:id/attempts", auth, ah.StartAttempt)

	// Flat attempt endpoints
	a := api.Group("/attempts", auth)
	a.Get("/", ah.ListMyAttempts)
	a.Get("/:attemptId", ah.GetAttemptStatus)
	a.Get("/:attemptId/questions/:number", ah.GetAttemptQuestion)
	a.Post("/:attemptId/answers", ah.SubmitAnswer)
	a.Post("/:attemptId/complete", ah.CompleteAttempt)
	a.Post("/:attemptId/auto-submit", ah.AutoSubmitAttempt)
}
