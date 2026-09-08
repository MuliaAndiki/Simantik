package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterReportingRoutes(api fiber.Router, cfg *config.Config, rh *handler.ReportingHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOrCM := middleware.RequireRoles("admin", "content_manager")

	// Student Report Card
	api.Get("/reports/student", auth, rh.GetStudentReportCard)

	// Admin / Content Manager Analytics & Reports
	adminReports := api.Group("/admin/reports", auth, adminOrCM)
	adminReports.Get("/overview", rh.GetAdminOverview)
	adminReports.Get("/tryouts/:id", rh.GetTryoutAnalytics)
	adminReports.Get("/questions/:id", rh.GetQuestionAnalytics)
	adminReports.Get("/competencies", rh.GetCompetenciesAnalytics)
	adminReports.Get("/difficulties", rh.GetDifficultyAnalytics)
}
