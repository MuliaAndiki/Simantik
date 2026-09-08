package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
	"simantikApi/internal/repository"
	"simantikApi/pkg/utils"
)

type NotificationService interface {
	GetMyNotifications(ctx context.Context, userID uuid.UUID, filter dto.ListNotificationFilter) (*dto.PaginatedNotificationsResponse, error)
	GetUnreadCount(ctx context.Context, userID uuid.UUID) (*dto.UnreadCountResponse, error)
	MarkAsRead(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
	MarkAllAsRead(ctx context.Context, userID uuid.UUID) error
	CreateNotification(ctx context.Context, req dto.CreateNotificationRequest) (*dto.NotificationResponse, error)
	BroadcastNotification(ctx context.Context, req dto.BroadcastNotificationRequest) (int, error)
	SendTryoutResultNotification(ctx context.Context, userID uuid.UUID, studentName, studentEmail, tryoutTitle string, score, accuracy float64, attemptID uuid.UUID)
}

type notificationService struct {
	notifRepo   repository.NotificationRepository
	emailSender utils.EmailSender
}

func NewNotificationService(notifRepo repository.NotificationRepository, emailSender utils.EmailSender) NotificationService {
	return &notificationService{
		notifRepo:   notifRepo,
		emailSender: emailSender,
	}
}

func (s *notificationService) GetMyNotifications(ctx context.Context, userID uuid.UUID, filter dto.ListNotificationFilter) (*dto.PaginatedNotificationsResponse, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	list, total, err := s.notifRepo.ListByUserID(ctx, userID, filter)
	if err != nil {
		return nil, err
	}

	unreadCount, _ := s.notifRepo.CountUnread(ctx, userID)

	items := make([]dto.NotificationResponse, len(list))
	for i, n := range list {
		items[i] = dto.NotificationResponse{
			ID:        n.ID,
			UserID:    n.UserID,
			Title:     n.Title,
			Message:   n.Message,
			Type:      n.Type,
			Link:      n.Link,
			IsRead:    n.IsRead,
			CreatedAt: n.CreatedAt,
		}
	}

	return &dto.PaginatedNotificationsResponse{
		Notifications: items,
		Total:         total,
		Limit:         limit,
		Offset:        offset,
		UnreadCount:   unreadCount,
	}, nil
}

func (s *notificationService) GetUnreadCount(ctx context.Context, userID uuid.UUID) (*dto.UnreadCountResponse, error) {
	count, err := s.notifRepo.CountUnread(ctx, userID)
	if err != nil {
		return nil, err
	}
	return &dto.UnreadCountResponse{UnreadCount: count}, nil
}

func (s *notificationService) MarkAsRead(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	return s.notifRepo.MarkAsRead(ctx, id, userID)
}

func (s *notificationService) MarkAllAsRead(ctx context.Context, userID uuid.UUID) error {
	return s.notifRepo.MarkAllAsRead(ctx, userID)
}

func (s *notificationService) CreateNotification(ctx context.Context, req dto.CreateNotificationRequest) (*dto.NotificationResponse, error) {
	notifType := req.Type
	if notifType == "" {
		notifType = "system"
	}

	n := &models.Notification{
		UserID:    req.UserID,
		Title:     req.Title,
		Message:   req.Message,
		Type:      notifType,
		Link:      req.Link,
		IsRead:    false,
		CreatedAt: time.Now(),
	}

	if err := s.notifRepo.Create(ctx, n); err != nil {
		return nil, err
	}

	return &dto.NotificationResponse{
		ID:        n.ID,
		UserID:    n.UserID,
		Title:     n.Title,
		Message:   n.Message,
		Type:      n.Type,
		Link:      n.Link,
		IsRead:    n.IsRead,
		CreatedAt: n.CreatedAt,
	}, nil
}

func (s *notificationService) BroadcastNotification(ctx context.Context, req dto.BroadcastNotificationRequest) (int, error) {
	role := req.TargetRole
	if role == "" {
		role = "all"
	}

	userIDs, err := s.notifRepo.FindUserIDsByRole(ctx, role)
	if err != nil {
		return 0, err
	}
	if len(userIDs) == 0 {
		return 0, nil
	}

	notifType := req.Type
	if notifType == "" {
		notifType = "announcement"
	}

	now := time.Now()
	notifications := make([]models.Notification, len(userIDs))
	for i, uid := range userIDs {
		notifications[i] = models.Notification{
			ID:        uuid.New(),
			UserID:    uid,
			Title:     req.Title,
			Message:   req.Message,
			Type:      notifType,
			Link:      req.Link,
			IsRead:    false,
			CreatedAt: now,
		}
	}

	if err := s.notifRepo.BulkCreate(ctx, notifications); err != nil {
		return 0, err
	}

	return len(notifications), nil
}

func (s *notificationService) SendTryoutResultNotification(
	ctx context.Context,
	userID uuid.UUID,
	studentName, studentEmail, tryoutTitle string,
	score, accuracy float64,
	attemptID uuid.UUID,
) {
	// 1. Create In-app Notification
	link := fmt.Sprintf("/tryouts/evaluations/%s", attemptID.String())
	title := fmt.Sprintf("Hasil Tryout: %s", tryoutTitle)
	msg := fmt.Sprintf("Selamat, Anda telah menyelesaikan %s dengan skor %.1f dan akurasi %.1f%%.", tryoutTitle, score, accuracy)

	_, _ = s.CreateNotification(ctx, dto.CreateNotificationRequest{
		UserID:  userID,
		Title:   title,
		Message: msg,
		Type:    "tryout_result",
		Link:    link,
	})

	// 2. Dispatch Email Asynchronously
	if s.emailSender != nil && studentEmail != "" {
		go func() {
			bgCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()
			if err := s.emailSender.SendTryoutResult(bgCtx, studentEmail, studentName, tryoutTitle, score, accuracy); err != nil {
				log.Printf("failed to send tryout result email to %s: %v", studentEmail, err)
			}
		}()
	}
}
