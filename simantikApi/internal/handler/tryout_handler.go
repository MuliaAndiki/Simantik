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

// TryoutHandler exposes HTTP endpoints for the Tryout domain.
type TryoutHandler struct {
	tryoutService service.TryoutService
}

// NewTryoutHandler wires a TryoutHandler to its TryoutService dependency.
func NewTryoutHandler(tryoutService service.TryoutService) *TryoutHandler {
	return &TryoutHandler{tryoutService: tryoutService}
}

// CreateTryout handles POST /api/v1/tryouts.
func (h *TryoutHandler) CreateTryout(c *fiber.Ctx) error {
	var req dto.CreateTryoutRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.tryoutService.CreateTryout(c.UserContext(), req, userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create tryout", err)
	}

	return utils.Created(c, "tryout created successfully", res)
}

// GetTryout handles GET /api/v1/tryouts/:id.
func (h *TryoutHandler) GetTryout(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"
	userID, _ := c.Locals(middleware.LocalsUserID).(uuid.UUID)

	res, err := h.tryoutService.GetTryout(c.UserContext(), id, userID, isAdmin)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch tryout", err)
	}

	return utils.Success(c, "tryout fetched successfully", res)
}

// UpdateTryout handles PATCH /api/v1/tryouts/:id.
func (h *TryoutHandler) UpdateTryout(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	var req dto.UpdateTryoutRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.tryoutService.UpdateTryout(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update tryout", err)
	}

	return utils.Success(c, "tryout updated successfully", res)
}

// UpdateTryoutStatus handles PATCH /api/v1/tryouts/:id/status.
func (h *TryoutHandler) UpdateTryoutStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	var req dto.PublishTryoutRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.tryoutService.UpdateTryoutStatus(c.UserContext(), id, req.Status, userID)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrInsufficientPool) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update tryout status", err)
	}

	return utils.Success(c, "tryout status updated successfully", res)
}

// DeleteTryout handles DELETE /api/v1/tryouts/:id.
func (h *TryoutHandler) DeleteTryout(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	if err := h.tryoutService.DeleteTryout(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrCannotDeletePublishedTryout) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete tryout", err)
	}

	return utils.Success(c, "tryout deleted successfully", nil)
}

// ListTryouts handles GET /api/v1/tryouts.
func (h *TryoutHandler) ListTryouts(c *fiber.Ctx) error {
	var filter dto.ListTryoutFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"
	userID, _ := c.Locals(middleware.LocalsUserID).(uuid.UUID)

	res, err := h.tryoutService.ListTryouts(c.UserContext(), filter, userID, isAdmin)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list tryouts", err)
	}

	return utils.Success(c, "tryouts fetched successfully", res)
}

// AddQuestions handles POST /api/v1/tryouts/:id/questions.
func (h *TryoutHandler) AddQuestions(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	var req dto.AddTryoutQuestionsRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.tryoutService.AddQuestionsToPool(c.UserContext(), id, req)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to add questions", err)
	}

	return utils.Success(c, "questions added to pool successfully", res)
}

// SyncQuestions handles POST /api/v1/tryouts/:id/questions/sync.
func (h *TryoutHandler) SyncQuestions(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	var req dto.SyncTryoutQuestionsRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.tryoutService.SyncQuestions(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to sync questions", err)
	}

	return utils.Success(c, "tryout questions synchronized successfully", res)
}

// RemoveQuestion handles DELETE /api/v1/tryouts/:id/questions/:questionId.
func (h *TryoutHandler) RemoveQuestion(c *fiber.Ctx) error {
	tryoutID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}
	questionID, err := uuid.Parse(c.Params("questionId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	if err := h.tryoutService.RemoveQuestionFromPool(c.UserContext(), tryoutID, questionID); err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to remove question", err)
	}

	return utils.Success(c, "question removed from pool successfully", nil)
}

// GetTryoutResults handles GET /api/v1/tryouts/:id/results.
func (h *TryoutHandler) GetTryoutResults(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	var filter dto.ListTryoutResultFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.tryoutService.GetTryoutPackageResults(c.UserContext(), id, filter)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch tryout results", err)
	}

	return utils.Success(c, "tryout results fetched successfully", res)
}
