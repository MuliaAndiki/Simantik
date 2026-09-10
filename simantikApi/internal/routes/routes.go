// Package routes wires Fiber route groups to handlers and middlewares.
package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// Handlers aggregates every domain handler the router needs.
type Handlers struct {
	Auth           *handler.AuthHandler
	User           *handler.UserHandler
	Question       *handler.QuestionHandler
	Tryout         *handler.TryoutHandler
	TryoutAttempt  *handler.TryoutAttemptHandler
	Evaluation     *handler.EvaluationHandler
	Recommendation *handler.RecommendationHandler
	Learning       *handler.LearningHandler
	Admin          *handler.AdminHandler
	Content        *handler.ContentHandler
	Notification   *handler.NotificationHandler
	Reporting      *handler.ReportingHandler
	System         *handler.SystemHandler
}

// Register mounts every route group under /api/v1, applying the API-secret
// gate to the whole API and JWT/role checks where needed.
func Register(app *fiber.App, cfg *config.Config, h *Handlers) {
	// Public health check for Load Balancer and Docker healthcheck (no X-API-SECRET required)
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "healthy",
			"service": cfg.OtelServiceName,
			"env":     cfg.AppEnv,
		})
	})

	api := app.Group("/api/v1", middleware.APISecret(cfg.APISecret))

	// Health check & Observability
	if h.System != nil {
		api.Get("/health", h.System.Health)
		auth := middleware.JWTAuth(cfg.JWTSecret)
		adminOnly := middleware.RequireRoles("admin")
		api.Get("/system/info", auth, adminOnly, h.System.SystemInfo)
	} else {
		api.Get("/health", func(c *fiber.Ctx) error {
			return c.JSON(fiber.Map{"success": true, "message": "ok"})
		})
	}

	registerAuthRoutes(api, cfg, h.Auth)
	registerUserRoutes(api, cfg, h.User)
	RegisterQuestionRoutes(api, cfg, h.Question)
	RegisterTryoutRoutes(api, cfg, h.Tryout)
	RegisterAttemptRoutes(api, cfg, h.TryoutAttempt)
	RegisterEvaluationRoutes(api, cfg, h.Evaluation)
	RegisterRecommendationRoutes(api, cfg, h.Recommendation)
	RegisterLearningRoutes(api, cfg, h.Learning)
	RegisterAdminRoutes(api, cfg, h.Admin)
	RegisterContentRoutes(api, cfg, h.Content)
	RegisterNotificationRoutes(api, cfg, h.Notification)
	if h.Reporting != nil {
		RegisterReportingRoutes(api, cfg, h.Reporting)
	}
}
