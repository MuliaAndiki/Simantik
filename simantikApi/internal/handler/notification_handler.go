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

type NotificationHandler struct {
	notifService service.NotificationService
}

func NewNotificationHandler(notifService service.NotificationService) *NotificationHandler {
	return &NotificationHandler{notifService: notifService}
}

// GetMyNotifications handles GET /api/v1/notifications.
func (h *NotificationHandler) GetMyNotifications(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	var filter dto.ListNotificationFilter
	if err := c.QueryParser(&filter); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid query parameters", err)
	}

	res, err := h.notifService.GetMyNotifications(c.UserContext(), userID, filter)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get notifications", err)
	}

	return utils.OK(c, "notifications retrieved successfully", res)
}

// GetUnreadCount handles GET /api/v1/notifications/unread-count.
func (h *NotificationHandler) GetUnreadCount(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	res, err := h.notifService.GetUnreadCount(c.UserContext(), userID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to get unread count", err)
	}

	return utils.OK(c, "unread count retrieved successfully", res)
}

// MarkAsRead handles PATCH /api/v1/notifications/:id/read.
func (h *NotificationHandler) MarkAsRead(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid notification id", err)
	}

	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	if err := h.notifService.MarkAsRead(c.UserContext(), id, userID); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to mark notification as read", err)
	}

	return utils.OK(c, "notification marked as read", nil)
}

// MarkAllAsRead handles PATCH /api/v1/notifications/read-all.
func (h *NotificationHandler) MarkAllAsRead(c *fiber.Ctx) error {
	userID, ok := c.Locals(middleware.LocalsUserID).(uuid.UUID)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "authentication required", errors.New("missing user context"))
	}

	if err := h.notifService.MarkAllAsRead(c.UserContext(), userID); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to mark all notifications as read", err)
	}

	return utils.OK(c, "all notifications marked as read", nil)
}

// BroadcastNotification handles POST /api/v1/admin/notifications/broadcast.
func (h *NotificationHandler) BroadcastNotification(c *fiber.Ctx) error {
	var req dto.BroadcastNotificationRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid request body", err)
	}
	if errs := utils.ValidateStruct(req); errs != nil {
		return utils.ValidationError(c, errs)
	}

	count, err := h.notifService.BroadcastNotification(c.UserContext(), req)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "failed to broadcast notification", err)
	}

	return utils.OK(c, "notification broadcast successfully", fiber.Map{
		"recipients_count": count,
	})
}
