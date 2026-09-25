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

type AdminHandler struct {
	adminService service.AdminService
}

func NewAdminHandler(adminService service.AdminService) *AdminHandler {
	return &AdminHandler{adminService: adminService}
}

// GetDashboard handles GET /api/v1/admin/dashboard.
func (h *AdminHandler) GetDashboard(c *fiber.Ctx) error {
	stats, err := h.adminService.GetDashboardStats(c.UserContext())
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve dashboard statistics", err)
	}
	return utils.OK(c, "dashboard statistics retrieved successfully", stats)
}

// ListUsers handles GET /api/v1/admin/users.
func (h *AdminHandler) ListUsers(c *fiber.Ctx) error {
	var filter dto.ListAdminUserFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.adminService.ListUsers(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve users", err)
	}

	return utils.OK(c, "users retrieved successfully", res)
}

// GetUserDetail handles GET /api/v1/admin/users/:id.
func (h *AdminHandler) GetUserDetail(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	detail, err := h.adminService.GetUserDetail(c.UserContext(), id)
	if err != nil {
		if errors.Is(err, service.ErrUserNotFound) {
			return utils.Error(c, fiber.StatusNotFound, "user not found", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve user detail", err)
	}

	return utils.OK(c, "user details retrieved successfully", detail)
}

// GetUserActivities handles GET /api/v1/admin/users/:id/activities.
func (h *AdminHandler) GetUserActivities(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	activities, err := h.adminService.GetUserActivities(c.UserContext(), id)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve user activities", err)
	}

	return utils.OK(c, "user activities retrieved successfully", activities)
}

// GetUserProgress handles GET /api/v1/admin/users/:id/progress.
func (h *AdminHandler) GetUserProgress(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	timeframe := c.Query("timeframe", "3m")
	progress, err := h.adminService.GetUserProgress(c.UserContext(), id, timeframe)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to retrieve user progress", err)
	}

	return utils.OK(c, "user progress retrieved successfully", progress)
}

// UpdateUserStatus handles PATCH /api/v1/admin/users/:id/status.
func (h *AdminHandler) UpdateUserStatus(c *fiber.Ctx) error {
	targetID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	var req dto.UpdateUserStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	actorID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	if err := h.adminService.UpdateUserStatus(c.UserContext(), targetID, actorID, req.Status); err != nil {
		if errors.Is(err, service.ErrCannotSelfDeactivate) {
			return utils.Error(c, fiber.StatusBadRequest, "cannot deactivate your own account", err)
		}
		if errors.Is(err, service.ErrInvalidStatus) {
			return utils.Error(c, fiber.StatusBadRequest, "invalid status value", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update user status", err)
	}

	return utils.OK(c, "user status updated successfully", nil)
}

// UpdateUserRole handles PATCH /api/v1/admin/users/:id/role.
func (h *AdminHandler) UpdateUserRole(c *fiber.Ctx) error {
	targetID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	var req dto.UpdateUserRoleRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	actorID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	if err := h.adminService.UpdateUserRole(c.UserContext(), targetID, actorID, req.Role); err != nil {
		if errors.Is(err, service.ErrCannotChangeOwnRole) {
			return utils.Error(c, fiber.StatusBadRequest, "cannot change your own role", err)
		}
		if errors.Is(err, service.ErrInvalidRole) {
			return utils.Error(c, fiber.StatusBadRequest, "invalid role value", err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to update user role", err)
	}

	return utils.OK(c, "user role updated successfully", nil)
}
