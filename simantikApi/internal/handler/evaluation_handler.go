package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/middleware"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

// EvaluationHandler exposes HTTP endpoints for the Evaluation domain.
type EvaluationHandler struct {
	evalService service.EvaluationService
}

// NewEvaluationHandler wires an EvaluationHandler with an EvaluationService.
func NewEvaluationHandler(evalService service.EvaluationService) *EvaluationHandler {
	return &EvaluationHandler{evalService: evalService}
}

// GetEvaluationByID handles GET /api/v1/evaluations/:id.
func (h *EvaluationHandler) GetEvaluationByID(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid evaluation id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.evalService.GetEvaluationByID(c.UserContext(), id, userID)
	if err != nil {
		if errors.Is(err, service.ErrEvaluationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch evaluation", err)
	}

	return utils.Success(c, "evaluation fetched successfully", res)
}

// GetAttemptEvaluation handles GET /api/v1/attempts/:attemptId/evaluation.
func (h *EvaluationHandler) GetAttemptEvaluation(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.evalService.GetAttemptEvaluation(c.UserContext(), attemptID, userID)
	if err != nil {
		if errors.Is(err, service.ErrAttemptNotFound) || errors.Is(err, service.ErrEvaluationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotCompleted) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch attempt evaluation", err)
	}

	return utils.Success(c, "attempt evaluation fetched successfully", res)
}

// GetAttemptReview handles GET /api/v1/attempts/:attemptId/review.
// Strictly reveals explanations and answer keys ONLY for completed attempts.
func (h *EvaluationHandler) GetAttemptReview(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.evalService.GetAttemptReview(c.UserContext(), attemptID, userID)
	if err != nil {
		if errors.Is(err, service.ErrAttemptNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotCompleted) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch attempt review", err)
	}

	return utils.Success(c, "attempt review fetched successfully", res)
}

// ListMyEvaluations handles GET /api/v1/evaluations.
func (h *EvaluationHandler) ListMyEvaluations(c *fiber.Ctx) error {
	var filter dto.ListEvaluationFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.evalService.ListMyEvaluations(c.UserContext(), userID, filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list evaluations", err)
	}

	return utils.Success(c, "evaluations fetched successfully", res)
}

// GetCompetencyProfile handles GET /api/v1/evaluations/profile.
func (h *EvaluationHandler) GetCompetencyProfile(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.evalService.GetStudentCompetencyProfile(c.UserContext(), userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch competency profile", err)
	}

	return utils.Success(c, "competency profile fetched successfully", res)
}
