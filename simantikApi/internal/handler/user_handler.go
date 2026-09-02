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

// Register handles POST /auth/register.
func (h *UserHandler) Register(c *fiber.Ctx) error {
	var req dto.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.Register(c.UserContext(), req)
	if err != nil {
		if errors.Is(err, service.ErrEmailAlreadyExists) {
			return utils.Error(c, fiber.StatusConflict, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to register user", err)
	}

	return utils.Created(c, "user registered successfully", res)
}

// Login handles POST /auth/login.
func (h *UserHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.Login(c.UserContext(), req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			return utils.Error(c, fiber.StatusUnauthorized, err.Error(), err)
		}
		return utils.Error(c, fiber.StatusInternalServerError, "failed to login", err)
	}

	return utils.Success(c, "login successful", res)
}

// Me handles GET /users/me, returning the authenticated caller's profile.
func (h *UserHandler) Me(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.service.GetByID(c.UserContext(), userID)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "current user fetched successfully", res)
}

// GetByID handles GET /users/:id.
func (h *UserHandler) GetByID(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	res, err := h.service.GetByID(c.UserContext(), id)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "user fetched successfully", res)
}

// List handles GET /users, with optional ?limit=&offset= pagination.
func (h *UserHandler) List(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	offset, _ := strconv.Atoi(c.Query("offset", "0"))
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	res, err := h.service.List(c.UserContext(), limit, offset)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to list users", err)
	}

	return utils.Success(c, "users fetched successfully", res)
}

// Update handles PUT /users/:id.
func (h *UserHandler) Update(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	var req dto.UpdateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if details := utils.ValidateStruct(req); details != nil {
		return utils.ValidationError(c, details)
	}

	res, err := h.service.Update(c.UserContext(), id, req)
	if err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "user updated successfully", res)
}

// Delete handles DELETE /users/:id.
func (h *UserHandler) Delete(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid user id", err)
	}

	if err := h.service.Delete(c.UserContext(), id); err != nil {
		return mapUserServiceError(c, err)
	}

	return utils.Success(c, "user deleted successfully", nil)
}

func mapUserServiceError(c *fiber.Ctx, err error) error {
	if errors.Is(err, service.ErrUserNotFound) {
		return utils.Error(c, fiber.StatusNotFound, err.Error(), err)
	}
	return utils.Error(c, fiber.StatusInternalServerError, "an unexpected error occurred", err)
}
