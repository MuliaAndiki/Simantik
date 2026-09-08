package handler

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/middleware"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

// TryoutAttemptHandler exposes HTTP endpoints for the Attempt domain.
type TryoutAttemptHandler struct {
	attemptService service.TryoutAttemptService
}

// NewTryoutAttemptHandler wires a TryoutAttemptHandler to its TryoutAttemptService dependency.
func NewTryoutAttemptHandler(attemptService service.TryoutAttemptService) *TryoutAttemptHandler {
	return &TryoutAttemptHandler{attemptService: attemptService}
}

// StartAttempt handles POST /api/v1/tryouts/:id/attempts.
func (h *TryoutAttemptHandler) StartAttempt(c *fiber.Ctx) error {
	tryoutID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid tryout id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.attemptService.StartAttempt(c.UserContext(), tryoutID, userID)
	if err != nil {
		if errors.Is(err, service.ErrTryoutNotFound) || errors.Is(err, service.ErrTryoutNotAvailable) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptAlreadyActive) || errors.Is(err, service.ErrInsufficientPool) {
			return utils.Error(c, fiber.StatusConflict, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to start attempt", err)
	}

	return utils.Created(c, "attempt started successfully", res)
}

// GetAttemptStatus handles GET /api/v1/attempts/:attemptId.
func (h *TryoutAttemptHandler) GetAttemptStatus(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.attemptService.GetAttemptStatus(c.UserContext(), attemptID, userID)
	if err != nil {
		if errors.Is(err, service.ErrAttemptNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch attempt status", err)
	}

	return utils.Success(c, "attempt status fetched successfully", res)
}

// GetAttemptQuestion handles GET /api/v1/attempts/:attemptId/questions/:number.
func (h *TryoutAttemptHandler) GetAttemptQuestion(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	qNum, err := strconv.Atoi(c.Params("number"))
	if err != nil || qNum < 1 {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question number", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.attemptService.GetAttemptQuestion(c.UserContext(), attemptID, qNum, userID)
	if err != nil {
		if errors.Is(err, service.ErrAttemptNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotActive) || errors.Is(err, service.ErrAttemptExpired) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch question", err)
	}

	return utils.Success(c, "question fetched successfully", res)
}

// SubmitAnswer handles POST /api/v1/attempts/:attemptId/answers.
func (h *TryoutAttemptHandler) SubmitAnswer(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	var req dto.SubmitAnswerRequest
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

	res, err := h.attemptService.SubmitAnswer(c.UserContext(), attemptID, userID, req)
	if err != nil {
		if errors.Is(err, service.ErrAttemptNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotActive) || errors.Is(err, service.ErrAttemptExpired) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to submit answer", err)
	}

	return utils.Success(c, "answer submitted successfully", res)
}

// CompleteAttempt handles POST /api/v1/attempts/:attemptId/complete.
func (h *TryoutAttemptHandler) CompleteAttempt(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.attemptService.CompleteAttempt(c.UserContext(), attemptID, userID)
	if err != nil {
		if errors.Is(err, service.ErrAttemptNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotActive) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to complete attempt", err)
	}

	return utils.Success(c, "attempt completed successfully", res)
}

// ListMyAttempts handles GET /api/v1/attempts.
func (h *TryoutAttemptHandler) ListMyAttempts(c *fiber.Ctx) error {
	var filter dto.MyAttemptsFilter
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

	res, err := h.attemptService.ListMyAttempts(c.UserContext(), userID, filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list attempts", err)
	}

	return utils.Success(c, "attempts fetched successfully", res)
}
