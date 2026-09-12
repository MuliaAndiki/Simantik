// Package handler contains Fiber HTTP handlers (controllers). Handlers
// parse/validate input, delegate to services, and translate results into
// the standardized response envelope — they hold no business logic.
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

// UserHandler exposes HTTP endpoints for the User domain.
type UserHandler struct {
	service service.UserService
}

// NewUserHandler wires a UserHandler to its UserService dependency.
func NewUserHandler(s service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

// Me handles GET /api/v1/users/me.
func (h *UserHandler) Me(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.service.GetMe(c.UserContext(), userID)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "current user profile fetched successfully", res)
}

// UpdateMe handles PATCH /api/v1/users/me.
func (h *UserHandler) UpdateMe(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var req dto.UpdateMeRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.UpdateMe(c.UserContext(), userID, req)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "profile updated successfully", res)
}

// ChangePassword handles PATCH /api/v1/users/me/password.
func (h *UserHandler) ChangePassword(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var req dto.ChangePasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	if err := h.service.ChangePassword(c.UserContext(), userID, req); err != nil {
		if errors.Is(err, service.ErrWrongPassword) {
			return utils.Error(c, fiber.StatusUnauthorized, err.Error(), err)
		}
		if errors.Is(err, service.ErrSamePassword) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		if errors.Is(err, service.ErrGoogleOnlyAccount) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "password changed successfully", nil)
}

// UpdateAvatar handles PATCH /api/v1/users/me/avatar.
func (h *UserHandler) UpdateAvatar(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var req dto.UpdateAvatarRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.UpdateAvatar(c.UserContext(), userID, req)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "avatar updated successfully", res)
}

// UpdateMySchool handles PATCH /api/v1/users/me/school.
func (h *UserHandler) UpdateMySchool(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var req dto.UpdateMySchoolRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.UpdateMySchool(c.UserContext(), userID, req)
	if err != nil {
		if errors.Is(err, service.ErrSchoolNotFound) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		if errors.Is(err, service.ErrInvalidRole) {
			return utils.Error(c, fiber.StatusForbidden, "only students can set a school", err)
		}
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "school updated successfully", res)
}

// GetMyRoles handles GET /api/v1/users/me/roles.
func (h *UserHandler) GetMyRoles(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.service.GetMyRoles(c.UserContext(), userID)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "user roles and permissions fetched successfully", res)
}

// List handles GET /api/v1/users (admin only).
func (h *UserHandler) List(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	offset, _ := strconv.Atoi(c.Query("offset", "0"))
	search := c.Query("search", "")
	status := c.Query("status", "")
	role := c.Query("role", "")

	filter := dto.UserFilter{
		Search: search,
		Status: status,
		Role:   role,
		Limit:  limit,
		Offset: offset,
	}

	res, err := h.service.ListUsers(c.UserContext(), filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list users", err)
	}

	return utils.Success(c, "users fetched successfully", res)
}

// GetByID handles GET /api/v1/users/:id (admin only).
func (h *UserHandler) GetByID(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	res, err := h.service.GetUserByID(c.UserContext(), id)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "user fetched successfully", res)
}

// UpdateStatus handles PATCH /api/v1/users/:id/status (admin only).
func (h *UserHandler) UpdateStatus(c *fiber.Ctx) error {
	currentAdminID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing admin context"))
	}

	targetID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	var req dto.UpdateUserStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.UpdateUserStatus(c.UserContext(), currentAdminID, targetID, req.Status)
	if err != nil {
		if errors.Is(err, service.ErrCannotSelfDeactivate) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		if errors.Is(err, service.ErrInvalidStatus) {
			return utils.Error(c, fiber.StatusBadRequest, err.Error(), err)
		}
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "user status updated successfully", res)
}

func mapUserServiceError(c *fiber.Ctx, err error) error {
	if errors.Is(err, service.ErrUserNotFound) {
		return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
	}
	return utils.Error(c, fiber.StatusInternalServerError, "an unexpected error occurred", err)
}
