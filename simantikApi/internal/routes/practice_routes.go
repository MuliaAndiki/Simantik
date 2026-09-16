package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

// RegisterPracticeRoutes mounts practice package management and student practice execution routes.
func RegisterPracticeRoutes(api fiber.Router, cfg *config.Config, h *handler.PracticeHandler) {
	if h == nil {
		return
	}

	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOrCM := middleware.RequireRoles("admin", "content_manager")
	adminOnly := middleware.RequireRoles("admin")

	// ─── 1. Practice Package Management (/practice-packages) ───────────────────
	pkg := api.Group("/practice-packages", auth)
	pkg.Get("/", h.ListPackages)
	pkg.Post("/", adminOrCM, h.CreatePackage)
	pkg.Get("/:id", h.GetPackage)
	pkg.Put("/:id", adminOrCM, h.UpdatePackage)
	pkg.Patch("/:id", adminOrCM, h.UpdatePackage)
	pkg.Patch("/:id/status", adminOrCM, h.UpdatePackageStatus)
	pkg.Delete("/:id", adminOnly, h.DeletePackage)
	pkg.Post("/:id/questions", adminOrCM, h.AddQuestions)
	pkg.Put("/:id/questions", adminOrCM, h.AddQuestions)
	pkg.Delete("/:id/questions/:questionId", adminOrCM, h.RemoveQuestion)

	// ─── 2. Student Practice (/practices) ──────────────────────────────────────
	practices := api.Group("/practices", auth)
	practices.Get("/", h.ListStudentPractices)
	practices.Get("/:id", h.GetStudentPractice)
	practices.Post("/:id/start", h.StartPractice)

	// ─── 3. Practice Attempts (/practice-attempts) ─────────────────────────────
	attempts := api.Group("/practice-attempts", auth)
	attempts.Get("/", h.ListMyAttempts)
	attempts.Get("/:attemptId", h.GetAttemptState)
	attempts.Post("/:attemptId/answer", h.SubmitAnswer)
	attempts.Post("/:attemptId/submit", h.SubmitPractice)
	attempts.Post("/:attemptId/auto-submit", h.AutoSubmitPractice)
	attempts.Get("/:attemptId/result", h.GetPracticeResult)
}
