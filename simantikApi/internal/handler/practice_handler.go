package handler

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/middleware"
	"simantikApi/internal/service"
	"simantikApi/pkg/utils"
)

// PracticeHandler exposes HTTP endpoints for Practice Packages and Practice Attempts.
type PracticeHandler struct {
	practiceService service.PracticeService
}

// NewPracticeHandler wires a PracticeHandler to its PracticeService dependency.
func NewPracticeHandler(practiceService service.PracticeService) *PracticeHandler {
	return &PracticeHandler{practiceService: practiceService}
}

// ─── Management Endpoints (Admin / Content Manager) ──────────────────────────

// CreatePackage handles POST /api/v1/practice-packages.
func (h *PracticeHandler) CreatePackage(c *fiber.Ctx) error {
	var req dto.CreatePracticePackageRequest
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

	res, err := h.practiceService.CreatePackage(c.UserContext(), req, userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create practice package", err)
	}

	return utils.Created(c, "practice package created successfully", res)
}

// GetPackage handles GET /api/v1/practice-packages/:id.
func (h *PracticeHandler) GetPackage(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"

	res, err := h.practiceService.GetPackage(c.UserContext(), id, isAdmin)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get practice package", err)
	}

	return utils.Success(c, "practice package retrieved successfully", res)
}

// UpdatePackage handles PATCH /api/v1/practice-packages/:id and PUT /api/v1/practice-packages/:id.
func (h *PracticeHandler) UpdatePackage(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	var req dto.UpdatePracticePackageRequest
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

	res, err := h.practiceService.UpdatePackage(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update practice package", err)
	}

	return utils.Success(c, "practice package updated successfully", res)
}

// UpdatePackageStatus handles PATCH /api/v1/practice-packages/:id/status.
func (h *PracticeHandler) UpdatePackageStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	var req struct {
		Status string `json:"status" validate:"required,oneof=draft published archived"`
	}
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

	res, err := h.practiceService.UpdatePackageStatus(c.UserContext(), id, req.Status, userID)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeEmptyPackage) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update package status", err)
	}

	return utils.Success(c, "package status updated successfully", res)
}

// DeletePackage handles DELETE /api/v1/practice-packages/:id.
func (h *PracticeHandler) DeletePackage(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	err = h.practiceService.DeletePackage(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrCannotDeletePublishedPractice) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete practice package", err)
	}

	return utils.Success(c, "practice package deleted successfully", nil)
}

// ListPackages handles GET /api/v1/practice-packages (Admin/CM management).
func (h *PracticeHandler) ListPackages(c *fiber.Ctx) error {
	var filter dto.ListPracticePackageFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"

	res, err := h.practiceService.ListPackages(c.UserContext(), filter, isAdmin)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list practice packages", err)
	}

	return utils.Success(c, "practice packages retrieved successfully", res)
}

// AddQuestions handles POST and PUT /api/v1/practice-packages/:id/questions.
func (h *PracticeHandler) AddQuestions(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	var req dto.AddPracticeQuestionsRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.practiceService.AddQuestionsToPackage(c.UserContext(), id, req)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to add questions to package", err)
	}

	return utils.Success(c, "questions added to package successfully", res)
}

// RemoveQuestion handles DELETE /api/v1/practice-packages/:id/questions/:questionId.
func (h *PracticeHandler) RemoveQuestion(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	questionID, err := uuid.Parse(c.Params("questionId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	err = h.practiceService.RemoveQuestionFromPackage(c.UserContext(), id, questionID)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to remove question from package", err)
	}

	return utils.Success(c, "question removed from package successfully", nil)
}

// ─── Student Practice Endpoints ──────────────────────────────────────────────

// ListStudentPractices handles GET /api/v1/practices.
func (h *PracticeHandler) ListStudentPractices(c *fiber.Ctx) error {
	var filter dto.ListPracticePackageFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.practiceService.ListPublishedPackages(c.UserContext(), filter, userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list practice packages", err)
	}

	return utils.Success(c, "practice packages retrieved successfully", res)
}

// GetStudentPractice handles GET /api/v1/practices/:id.
func (h *PracticeHandler) GetStudentPractice(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.practiceService.GetPackageForStudent(c.UserContext(), id, userID)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get practice package", err)
	}

	return utils.Success(c, "practice package retrieved successfully", res)
}

// StartPractice handles POST /api/v1/practices/:id/start.
func (h *PracticeHandler) StartPractice(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid practice package id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.practiceService.StartPracticeAttempt(c.UserContext(), id, userID)
	if err != nil {
		if errors.Is(err, service.ErrPracticePackageNotFound) || errors.Is(err, service.ErrPracticeNotAvailable) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeEmptyPackage) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to start practice attempt", err)
	}

	return utils.Created(c, "practice attempt started successfully", res)
}

// GetAttemptState handles GET /api/v1/practice-attempts/:attemptId.
func (h *PracticeHandler) GetAttemptState(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.practiceService.GetAttemptState(c.UserContext(), attemptID, userID)
	if err != nil {
		if errors.Is(err, service.ErrPracticeNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get attempt state", err)
	}

	return utils.Success(c, "practice attempt state retrieved successfully", res)
}

// SubmitAnswer handles POST /api/v1/practice-attempts/:attemptId/answer.
func (h *PracticeHandler) SubmitAnswer(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var req dto.SubmitPracticeAnswerRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.practiceService.SubmitAnswer(c.UserContext(), attemptID, userID, req)
	if err != nil {
		if errors.Is(err, service.ErrPracticeNotFound) || errors.Is(err, service.ErrPracticeQuestionNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotActive) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to submit practice answer", err)
	}

	return utils.Success(c, "answer saved successfully", res)
}

// SubmitPractice handles POST /api/v1/practice-attempts/:attemptId/submit.
func (h *PracticeHandler) SubmitPractice(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var req dto.SubmitPracticeRequest
	body := bytes.TrimSpace(c.Body())
	if len(body) > 0 {
		if body[0] == '[' {
			var answers []dto.SubmitPracticeAnswerRequest
			if err := json.Unmarshal(body, &answers); err != nil {
				return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
			}
			req.Answers = answers
		} else {
			if err := c.BodyParser(&req); err != nil {
				return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
			}
		}
	}

	res, err := h.practiceService.CompletePracticeAttempt(c.UserContext(), attemptID, userID, req)
	if err != nil {
		if errors.Is(err, service.ErrPracticeNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotActive) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to submit practice attempt", err)
	}

	return utils.Success(c, "practice attempt submitted and graded successfully", res)
}

// AutoSubmitPractice handles POST /api/v1/practice-attempts/:attemptId/auto-submit.
// Triggered by proctoring anti-cheating engine when the student exceeds maximum violation threshold.
func (h *PracticeHandler) AutoSubmitPractice(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var req dto.AutoSubmitPracticeRequest
	body := bytes.TrimSpace(c.Body())
	if len(body) > 0 {
		if body[0] == '[' {
			var answers []dto.SubmitPracticeAnswerRequest
			if err := json.Unmarshal(body, &answers); err != nil {
				return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
			}
			req.Answers = answers
		} else {
			if err := c.BodyParser(&req); err != nil {
				return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
			}
		}
	}
	if req.Reason == "" {
		req.Reason = "VIOLATION_THRESHOLD_EXCEEDED"
	}

	res, err := h.practiceService.CompletePracticeAttempt(c.UserContext(), attemptID, userID, req)
	if err != nil {
		if errors.Is(err, service.ErrPracticeNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotActive) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to auto-submit practice attempt", err)
	}

	return utils.Success(c, "practice attempt auto-submitted successfully due to violations", res)
}

// GetPracticeResult handles GET /api/v1/practice-attempts/:attemptId/result.
func (h *PracticeHandler) GetPracticeResult(c *fiber.Ctx) error {
	attemptID, err := uuid.Parse(c.Params("attemptId"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid attempt id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.practiceService.GetPracticeResult(c.UserContext(), attemptID, userID)
	if err != nil {
		if errors.Is(err, service.ErrPracticeNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		if errors.Is(err, service.ErrPracticeNotOwner) {
			return utils.Error(c, fiber.StatusForbidden, err.Error(), err)
		}
		if errors.Is(err, service.ErrAttemptNotCompleted) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get practice result", err)
	}

	return utils.Success(c, "practice result retrieved successfully", res)
}

// ListMyAttempts handles GET /api/v1/practice-attempts.
func (h *PracticeHandler) ListMyAttempts(c *fiber.Ctx) error {
	var filter dto.MyPracticesFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.practiceService.ListMyPractices(c.UserContext(), userID, filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list practice attempts", err)
	}

	return utils.Success(c, "practice attempts retrieved successfully", res)
}
