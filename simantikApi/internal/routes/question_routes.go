package routes

import (
	"github.com/gofiber/fiber/v2"
	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterQuestionRoutes(api fiber.Router, cfg *config.Config, h *handler.QuestionHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOrCM := middleware.RequireRoles("admin", "content_manager")
	adminOnly := middleware.RequireRoles("admin")

	// Competency routes
	comp := api.Group("/competencies", auth)
	comp.Get("/", h.ListCompetencies)
	comp.Post("/", adminOrCM, h.CreateCompetency)
	comp.Get("/:id", h.GetCompetency)
	comp.Patch("/:id", adminOrCM, h.UpdateCompetency)
	comp.Delete("/:id", adminOnly, h.DeleteCompetency)

	// Question types
	api.Get("/question-types", auth, h.ListQuestionTypes)

	// Question routes
	q := api.Group("/questions", auth)
	q.Get("/", h.ListQuestions)
	q.Post("/", adminOrCM, h.CreateQuestion)
	q.Get("/:id", h.GetQuestion)
	q.Patch("/:id", adminOrCM, h.UpdateQuestion)
	q.Patch("/:id/status", adminOrCM, h.UpdateQuestionStatus)
	q.Delete("/:id", adminOnly, h.DeleteQuestion)
}
