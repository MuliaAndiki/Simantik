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

// LearningHandler exposes HTTP endpoints for modules, materials, and student progress.
type LearningHandler struct {
	learnService service.LearningService
}

func NewLearningHandler(learnService service.LearningService) *LearningHandler {
	return &LearningHandler{learnService: learnService}
}

// ─── Module Endpoints ────────────────────────────────────────────────────────

// CreateModule handles POST /api/v1/learning-modules.
func (h *LearningHandler) CreateModule(c *fiber.Ctx) error {
	var req dto.CreateLearningModuleRequest
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

	res, err := h.learnService.CreateModule(c.UserContext(), req, userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create module", err)
	}

	return utils.Created(c, "module created successfully", res)
}

// GetModule handles GET /api/v1/learning-modules/:id.
func (h *LearningHandler) GetModule(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid module id", err)
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"
	userID, _ := c.Locals(middleware.LocalsUserID).(uuid.UUID)

	res, err := h.learnService.GetModule(c.UserContext(), id, userID, isAdmin)
	if err != nil {
		if errors.Is(err, service.ErrModuleNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch module", err)
	}

	return utils.Success(c, "module fetched successfully", res)
}

// UpdateModule handles PATCH /api/v1/learning-modules/:id.
func (h *LearningHandler) UpdateModule(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid module id", err)
	}

	var req dto.UpdateLearningModuleRequest
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

	res, err := h.learnService.UpdateModule(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrModuleNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update module", err)
	}

	return utils.Success(c, "module updated successfully", res)
}

// UpdateModuleStatus handles PATCH /api/v1/learning-modules/:id/status.
func (h *LearningHandler) UpdateModuleStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid module id", err)
	}

	type statusReq struct {
		Status string `json:"status" validate:"required,oneof=draft published archived review in_review"`
	}
	var req statusReq
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	status := req.Status
	if status == "in_review" {
		status = "review"
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.learnService.UpdateModuleStatus(c.UserContext(), id, status, userID)
	if err != nil {
		if errors.Is(err, service.ErrModuleNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update module status", err)
	}

	return utils.Success(c, "module status updated successfully", res)
}

// DeleteModule handles DELETE /api/v1/learning-modules/:id.
func (h *LearningHandler) DeleteModule(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid module id", err)
	}

	if err := h.learnService.DeleteModule(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrModuleNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete module", err)
	}

	return utils.Success(c, "module deleted successfully", nil)
}

// ListModules handles GET /api/v1/learning-modules.
func (h *LearningHandler) ListModules(c *fiber.Ctx) error {
	var filter dto.ListModuleFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"
	userID, _ := c.Locals(middleware.LocalsUserID).(uuid.UUID)

	res, err := h.learnService.ListModules(c.UserContext(), filter, userID, isAdmin)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list modules", err)
	}

	return utils.Success(c, "modules fetched successfully", res)
}

// ListModuleLabels handles GET /api/v1/learning-modules/labels.
func (h *LearningHandler) ListModuleLabels(c *fiber.Ctx) error {
	res, err := h.learnService.ListModuleLabels(c.UserContext())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch module labels", err)
	}

	return utils.Success(c, "module labels fetched successfully", res)
}

// ─── Material Endpoints ──────────────────────────────────────────────────────

// CreateMaterial handles POST /api/v1/materials.
func (h *LearningHandler) CreateMaterial(c *fiber.Ctx) error {
	var req dto.CreateMaterialRequest
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

	res, err := h.learnService.CreateMaterial(c.UserContext(), req, userID)
	if err != nil {
		if errors.Is(err, service.ErrModuleNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to create material", err)
	}

	return utils.Created(c, "material created successfully", res)
}

// GetMaterial handles GET /api/v1/materials/:id.
func (h *LearningHandler) GetMaterial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid material id", err)
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"
	userID, _ := c.Locals(middleware.LocalsUserID).(uuid.UUID)

	res, err := h.learnService.GetMaterial(c.UserContext(), id, userID, isAdmin)
	if err != nil {
		if errors.Is(err, service.ErrMaterialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch material", err)
	}

	return utils.Success(c, "material fetched successfully", res)
}

// UpdateMaterial handles PATCH /api/v1/materials/:id.
func (h *LearningHandler) UpdateMaterial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid material id", err)
	}

	var req dto.UpdateMaterialRequest
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

	res, err := h.learnService.UpdateMaterial(c.UserContext(), id, req, userID)
	if err != nil {
		if errors.Is(err, service.ErrMaterialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update material", err)
	}

	return utils.Success(c, "material updated successfully", res)
}

// UpdateMaterialStatus handles PATCH /api/v1/materials/:id/status.
func (h *LearningHandler) UpdateMaterialStatus(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid material id", err)
	}

	type statusReq struct {
		Status string `json:"status" validate:"required,oneof=draft published archived review in_review"`
	}
	var req statusReq
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	status := req.Status
	if status == "in_review" {
		status = "review"
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.learnService.UpdateMaterialStatus(c.UserContext(), id, status, userID)
	if err != nil {
		if errors.Is(err, service.ErrMaterialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update material status", err)
	}

	return utils.Success(c, "material status updated successfully", res)
}

// DeleteMaterial handles DELETE /api/v1/materials/:id.
func (h *LearningHandler) DeleteMaterial(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid material id", err)
	}

	if err := h.learnService.DeleteMaterial(c.UserContext(), id); err != nil {
		if errors.Is(err, service.ErrMaterialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to delete material", err)
	}

	return utils.Success(c, "material deleted successfully", nil)
}

// ListMaterials handles GET /api/v1/materials.
func (h *LearningHandler) ListMaterials(c *fiber.Ctx) error {
	var filter dto.ListMaterialFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}
	if filter.Limit <= 0 || filter.Limit > 100 {
		filter.Limit = 20
	}

	role, _ := c.Locals(middleware.LocalsRole).(string)
	isAdmin := role == "admin" || role == "content_manager"
	userID, _ := c.Locals(middleware.LocalsUserID).(uuid.UUID)

	res, err := h.learnService.ListMaterials(c.UserContext(), filter, userID, isAdmin)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list materials", err)
	}

	return utils.Success(c, "materials fetched successfully", res)
}

// GetMaterialStudentActivities handles GET /api/v1/materials/:id/activities.
func (h *LearningHandler) GetMaterialStudentActivities(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid material id", err)
	}

	var filter dto.ListMaterialActivityFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.learnService.GetMaterialStudentActivities(c.UserContext(), id, filter)
	if err != nil {
		if errors.Is(err, service.ErrMaterialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve student activities", err)
	}

	return utils.Success(c, "student activities retrieved successfully", res)
}

// ─── Progress Endpoints ──────────────────────────────────────────────────────

// MarkMaterialProgress handles POST /api/v1/materials/:id/progress.
func (h *LearningHandler) MarkMaterialProgress(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid material id", err)
	}

	var req dto.UpdateProgressRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.learnService.MarkMaterialCompleted(c.UserContext(), id, userID, req.IsCompleted)
	if err != nil {
		if errors.Is(err, service.ErrMaterialNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update progress", err)
	}

	return utils.Success(c, "progress updated successfully", res)
}

// GetModuleProgress handles GET /api/v1/learning-modules/:id/progress.
func (h *LearningHandler) GetModuleProgress(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid module id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.learnService.GetModuleProgress(c.UserContext(), id, userID)
	if err != nil {
		if errors.Is(err, service.ErrModuleNotFound) {
			return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to fetch module progress", err)
	}

	return utils.Success(c, "module progress fetched successfully", res)
}

// ListMyProgress handles GET /api/v1/learning-progress.
func (h *LearningHandler) ListMyProgress(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.learnService.ListMyProgress(c.UserContext(), userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list learning progress", err)
	}

	return utils.Success(c, "learning progress fetched successfully", res)
}
