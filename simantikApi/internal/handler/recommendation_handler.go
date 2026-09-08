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

// RecommendationHandler exposes HTTP endpoints for the Recommendation domain.
type RecommendationHandler struct {
	recService service.RecommendationService
}

// NewRecommendationHandler wires a RecommendationHandler with its service.
func NewRecommendationHandler(recService service.RecommendationService) *RecommendationHandler {
	return &RecommendationHandler{recService: recService}
}

// GenerateRecommendations handles POST /api/v1/recommendations/generate.
func (h *RecommendationHandler) GenerateRecommendations(c *fiber.Ctx) error {
	var req dto.GenerateRecommendationsRequest
	_ = c.BodyParser(&req) // Body is optional

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var res []dto.RecommendationResponse
	var err error

	if req.EvaluationID != nil && *req.EvaluationID != uuid.Nil {
		res, err = h.recService.GenerateRecommendationsForEvaluation(c.UserContext(), *req.EvaluationID, userID)
	} else {
		res, err = h.recService.GenerateRecommendationsFromProfile(c.UserContext(), userID)
	}

	if err != nil {
		if errors.Is(err, service.ErrEvaluationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to generate recommendations", err)
	}

	return utils.Created(c, "recommendations generated successfully", res)
}

// ListRecommendations handles GET /api/v1/recommendations.
func (h *RecommendationHandler) ListRecommendations(c *fiber.Ctx) error {
	var filter dto.ListRecommendationFilter
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

	res, err := h.recService.GetStudentRecommendations(c.UserContext(), userID, filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list recommendations", err)
	}

	return utils.Success(c, "recommendations fetched successfully", res)
}

// DismissRecommendation handles DELETE /api/v1/recommendations/:id.
func (h *RecommendationHandler) DismissRecommendation(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid recommendation id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	if err := h.recService.DismissRecommendation(c.UserContext(), id, userID); err != nil {
		if errors.Is(err, service.ErrRecommendationNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to dismiss recommendation", err)
	}

	return utils.Success(c, "recommendation dismissed successfully", nil)
}
