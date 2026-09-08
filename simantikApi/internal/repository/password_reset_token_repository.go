package repository

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/models"
)

// PasswordResetTokenRepository defines persistence operations for password reset tokens.
type PasswordResetTokenRepository interface {
	Create(ctx context.Context, token *models.PasswordResetToken) error
	FindByTokenHash(ctx context.Context, hash string) (*models.PasswordResetToken, error)
	MarkUsed(ctx context.Context, id uuid.UUID) error
	InvalidateAllForUser(ctx context.Context, userID uuid.UUID) error
}

type passwordResetTokenRepository struct {
	db *gorm.DB
}

// NewPasswordResetTokenRepository builds a GORM-backed PasswordResetTokenRepository.
func NewPasswordResetTokenRepository(db *gorm.DB) PasswordResetTokenRepository {
	return &passwordResetTokenRepository{db: db}
}

func (r *passwordResetTokenRepository) Create(ctx context.Context, token *models.PasswordResetToken) error {
	return r.db.WithContext(ctx).Create(token).Error
}

func (r *passwordResetTokenRepository) FindByTokenHash(ctx context.Context, hash string) (*models.PasswordResetToken, error) {
	var token models.PasswordResetToken
	if err := r.db.WithContext(ctx).
		Where("token_hash = ?", hash).
		First(&token).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &token, nil
}

func (r *passwordResetTokenRepository) MarkUsed(ctx context.Context, id uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&models.PasswordResetToken{}).
		Where("id = ?", id).
		Update("used_at", now).Error
}

func (r *passwordResetTokenRepository) InvalidateAllForUser(ctx context.Context, userID uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&models.PasswordResetToken{}).
		Where("user_id = ? AND used_at IS NULL", userID).
		Update("used_at", now).Error
}
