package routes

import (
	"github.com/gofiber/fiber/v2"

	"simantikApi/config"
	"simantikApi/internal/handler"
	"simantikApi/internal/middleware"
)

func RegisterNotificationRoutes(api fiber.Router, cfg *config.Config, h *handler.NotificationHandler) {
	auth := middleware.JWTAuth(cfg.JWTSecret)
	adminOnly := middleware.RequireRoles("admin")

	// User In-app notifications
	notif := api.Group("/notifications", auth)
	notif.Get("/", h.GetMyNotifications)
	notif.Get("/unread-count", h.GetUnreadCount)
	notif.Patch("/read-all", h.MarkAllAsRead)
	notif.Patch("/:id/read", h.MarkAsRead)

	// Admin Broadcast
	api.Post("/admin/notifications/broadcast", auth, adminOnly, h.BroadcastNotification)
}
