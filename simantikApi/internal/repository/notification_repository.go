package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type NotificationRepository interface {
	Create(ctx context.Context, n *models.Notification) error
	BulkCreate(ctx context.Context, notifications []models.Notification) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Notification, error)
	ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.ListNotificationFilter) ([]models.Notification, int64, error)
	CountUnread(ctx context.Context, userID uuid.UUID) (int64, error)
	MarkAsRead(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
	MarkAllAsRead(ctx context.Context, userID uuid.UUID) error
	FindUserIDsByRole(ctx context.Context, role string) ([]uuid.UUID, error)
}

type notificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) NotificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) Create(ctx context.Context, n *models.Notification) error {
	return r.db.WithContext(ctx).Create(n).Error
}

func (r *notificationRepository) BulkCreate(ctx context.Context, notifications []models.Notification) error {
	if len(notifications) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Create(&notifications).Error
}

func (r *notificationRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Notification, error) {
	var n models.Notification
	if err := r.db.WithContext(ctx).First(&n, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

func (r *notificationRepository) ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.ListNotificationFilter) ([]models.Notification, int64, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	query := r.db.WithContext(ctx).Model(&models.Notification{}).Where("user_id = ?", userID)
	if filter.Type != "" {
		query = query.Where("type = ?", filter.Type)
	}
	if filter.IsRead != nil {
		query = query.Where("is_read = ?", *filter.IsRead)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var list []models.Notification
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}

	return list, total, nil
}

func (r *notificationRepository) CountUnread(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Count(&count).Error
	return count, err
}

func (r *notificationRepository) MarkAsRead(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	return r.db.WithContext(ctx).Model(&models.Notification{}).
		Where("id = ? AND user_id = ?", id, userID).
		Update("is_read", true).Error
}

func (r *notificationRepository) MarkAllAsRead(ctx context.Context, userID uuid.UUID) error {
	return r.db.WithContext(ctx).Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Update("is_read", true).Error
}

func (r *notificationRepository) FindUserIDsByRole(ctx context.Context, role string) ([]uuid.UUID, error) {
	var userIDs []uuid.UUID
	query := r.db.WithContext(ctx).Model(&models.User{}).Where("deleted_at IS NULL AND status = ?", models.UserStatusActive)
	if role != "" && role != "all" {
		query = query.Where("role = ?", role)
	}
	err := query.Pluck("id", &userIDs).Error
	return userIDs, err
}
