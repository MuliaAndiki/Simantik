package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"simantikApi/internal/middleware"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

type ReportingHandler struct {
	reportService service.ReportingService
}

func NewReportingHandler(reportService service.ReportingService) *ReportingHandler {
	return &ReportingHandler{reportService: reportService}
}

// GetStudentReportCard handles GET /api/v1/reports/student.
func (h *ReportingHandler) GetStudentReportCard(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	report, err := h.reportService.GetStudentReportCard(c.UserContext(), userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to generate student report card", err)
	}

	return utils.OK(c, "student report card retrieved successfully", report)
}

// GetAdminOverview handles GET /api/v1/admin/reports/overview.
func (h *ReportingHandler) GetAdminOverview(c *fiber.Ctx) error {
	overview, err := h.reportService.GetAdminOverview(c.UserContext())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get admin overview", err)
	}

	return utils.OK(c, "admin overview retrieved successfully", overview)
}

// GetTryoutAnalytics handles GET /api/v1/admin/reports/tryouts/:id.
func (h *ReportingHandler) GetTryoutAnalytics(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	analytics, err := h.reportService.GetTryoutAnalytics(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "tryout not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get tryout analytics", err)
	}

	return utils.OK(c, "tryout analytics retrieved successfully", analytics)
}

// GetQuestionAnalytics handles GET /api/v1/admin/reports/questions/:id.
func (h *ReportingHandler) GetQuestionAnalytics(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	analytics, err := h.reportService.GetQuestionAnalytics(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrQuestionNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "question not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get question analytics", err)
	}

	return utils.OK(c, "question item analysis retrieved successfully", analytics)
}

// GetCompetenciesAnalytics handles GET /api/v1/admin/reports/competencies.
func (h *ReportingHandler) GetCompetenciesAnalytics(c *fiber.Ctx) error {
	analytics, err := h.reportService.GetCompetenciesAnalytics(c.UserContext())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get competency analytics", err)
	}

	return utils.OK(c, "competency analytics retrieved successfully", analytics)
}

// GetDifficultyAnalytics handles GET /api/v1/admin/reports/difficulties.
func (h *ReportingHandler) GetDifficultyAnalytics(c *fiber.Ctx) error {
	analytics, err := h.reportService.GetDifficultyAnalytics(c.UserContext())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get difficulty analytics", err)
	}

	return utils.OK(c, "difficulty level analytics retrieved successfully", analytics)
}
