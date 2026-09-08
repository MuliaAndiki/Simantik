package dto

import (
	"time"

	"github.com/google/uuid"
)

// NotificationResponse is the JSON representation of an in-app notification.
type NotificationResponse struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"userId"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Type      string    `json:"type"`
	Link      string    `json:"link"`
	IsRead    bool      `json:"isRead"`
	CreatedAt time.Time `json:"createdAt"`
}

// ListNotificationFilter allows filtering notifications by read status and type.
type ListNotificationFilter struct {
	Type   string `query:"type"`
	IsRead *bool  `query:"isRead"`
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}

// PaginatedNotificationsResponse delivers a paginated list of user notifications with total and unread count.
type PaginatedNotificationsResponse struct {
	Notifications []NotificationResponse `json:"notifications"`
	Total         int64                  `json:"total"`
	Limit         int                    `json:"limit"`
	Offset        int                    `json:"offset"`
	UnreadCount   int64                  `json:"unreadCount"`
}

// CreateNotificationRequest is used internally or by admin to dispatch a targeted notification.
type CreateNotificationRequest struct {
	UserID  uuid.UUID `json:"userId" validate:"required"`
	Title   string    `json:"title" validate:"required,min=2,max=255"`
	Message string    `json:"message" validate:"required"`
	Type    string    `json:"type" validate:"omitempty,max=50"`
	Link    string    `json:"link" validate:"omitempty,max=255"`
}

// BroadcastNotificationRequest allows admins to broadcast notifications to groups of users.
type BroadcastNotificationRequest struct {
	Title      string `json:"title" validate:"required,min=2,max=255"`
	Message    string `json:"message" validate:"required"`
	Type       string `json:"type" validate:"omitempty,max=50"`
	Link       string `json:"link" validate:"omitempty,max=255"`
	TargetRole string `json:"targetRole" validate:"omitempty,oneof=all student admin content_manager"`
}

// UnreadCountResponse reports the count of unread notifications for badge rendering.
type UnreadCountResponse struct {
	UnreadCount int64 `json:"unreadCount"`
}
