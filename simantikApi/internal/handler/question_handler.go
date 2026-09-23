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

// QuestionHandler exposes HTTP endpoints for the Competency and Question domains.
type QuestionHandler struct {
	qService service.QuestionService
}

// NewQuestionHandler wires a QuestionHandler to its QuestionService.
func NewQuestionHandler(qService service.QuestionService) *QuestionHandler {
	return &QuestionHandler{qService: qService}
}

// ─── Competency Handlers ──────────────────────────────────────────────────────

// CreateCompetency handles POST /api/v1/competencies.
func (h *QuestionHandler) CreateCompetency(c *fiber.Ctx) error {
	var req dto.CreateCompetencyRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.qService.CreateCompetency(c.UserContext(), req, userID)
	if err != nil {
		if errors.Is(err, service.ErrCompetencyCodeExists) {
			return utils.Error(c, fiber.StatusConflict, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create competency", err)
	}

	return utils.Created(c, "competency created successfully", res)
}

// GetCompetency handles GET /api/v1/competencies/:id.
func (h *QuestionHandler) GetCompetency(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid competency id", err)
	}

	res, err := h.qService.GetCompetency(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrCompetencyNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch competency", err)
	}

	return utils.Success(c, "competency fetched successfully", res)
}

// UpdateCompetency handles PATCH /api/v1/competencies/:id.
func (h *QuestionHandler) UpdateCompetency(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid competency id", err)
	}

	var req dto.UpdateCompetencyRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	res, err := h.qService.UpdateCompetency(c.UserContext(), id, req)
	if err != nil {
		if errors.Is(err, service.ErrCompetencyNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update competency", err)
	}

	return utils.Success(c, "competency updated successfully", res)
}

// DeleteCompetency handles DELETE /api/v1/competencies/:id.
func (h *QuestionHandler) DeleteCompetency(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid competency id", err)
	}

	if err := h.qService.DeleteCompetency(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrCompetencyNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete competency", err)
	}

	return utils.Success(c, "competency deleted successfully", nil)
}

// ListCompetencies handles GET /api/v1/competencies.
func (h *QuestionHandler) ListCompetencies(c *fiber.Ctx) error {
	var filter dto.ListCompetencyFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	res, err := h.qService.ListCompetencies(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list competencies", err)
	}

	return utils.Success(c, "competencies fetched successfully", res)
}

// ─── Question Type Handlers ───────────────────────────────────────────────────

// ListQuestionTypes handles GET /api/v1/question-types.
func (h *QuestionHandler) ListQuestionTypes(c *fiber.Ctx) error {
	res, err := h.qService.ListQuestionTypes(c.UserContext())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch question types", err)
	}

	return utils.Success(c, "question types fetched successfully", res)
}

// ─── Question Handlers ────────────────────────────────────────────────────────

// CreateQuestion handles POST /api/v1/questions.
func (h *QuestionHandler) CreateQuestion(c *fiber.Ctx) error {
	var req dto.CreateQuestionRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.qService.CreateQuestion(c.UserContext(), req, userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create question", err)
	}

	return utils.Created(c, "question created successfully", res)
}

// CreateQuestionsBulk handles POST /api/v1/questions/bulk.
func (h *QuestionHandler) CreateQuestionsBulk(c *fiber.Ctx) error {
	var req dto.CreateQuestionsBulkRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.qService.CreateQuestionsBulk(c.UserContext(), req, userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create questions in bulk", err)
	}

	return utils.Created(c, "questions created successfully", res)
}

// GetQuestion handles GET /api/v1/questions/:id.
// Admin/content_manager sees IsCorrect + explanation; students do not.
func (h *QuestionHandler) GetQuestion(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)

	if role == "admin" || role == "content_manager" {
		res, err := h.qService.GetQuestionAdmin(c.UserContext(), id)
		if err != nil {
			if errors.Is(err, service.ErrQuestionNotFound) {
				return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
			}
			return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch question", err)
		}
		return utils.Success(c, "question fetched successfully", res)
	}

	res, err := h.qService.GetQuestionStudent(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrQuestionNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch question", err)
	}
	return utils.Success(c, "question fetched successfully", res)
}

// UpdateQuestion handles PATCH /api/v1/questions/:id.
func (h *QuestionHandler) UpdateQuestion(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	var req dto.UpdateQuestionRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.qService.UpdateQuestion(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrQuestionNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update question", err)
	}

	return utils.Success(c, "question updated successfully", res)
}

// UpdateQuestionStatus handles PATCH /api/v1/questions/:id/status.
func (h *QuestionHandler) UpdateQuestionStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	var req dto.PublishQuestionRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.qService.UpdateQuestionStatus(c.UserContext(), id, req.Status, userID)
	if err != nil {
		if errors.Is(err, service.ErrQuestionNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update question status", err)
	}

	return utils.Success(c, "question status updated successfully", res)
}

// DeleteQuestion handles DELETE /api/v1/questions/:id.
func (h *QuestionHandler) DeleteQuestion(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid question id", err)
	}

	if err := h.qService.DeleteQuestion(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrQuestionNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete question", err)
	}

	return utils.Success(c, "question deleted successfully", nil)
}

// ListQuestions handles GET /api/v1/questions.
func (h *QuestionHandler) ListQuestions(c *fiber.Ctx) error {
	var filter dto.ListQuestionFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	res, err := h.qService.ListQuestionsAdmin(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list questions", err)
	}

	return utils.Success(c, "questions fetched successfully", res)
}
