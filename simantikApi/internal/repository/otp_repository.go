package repository

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/models"
)

// OTPRepository defines persistence operations for OTP codes.
type OTPRepository interface {
	Create(ctx context.Context, otp *models.OTPCode) error
	// FindLatestValid returns the most recent non-expired, non-used OTP
	// for the given user and purpose. Returns ErrNotFound if none exists.
	FindLatestValid(ctx context.Context, userID uuid.UUID, purpose models.OTPPurpose) (*models.OTPCode, error)
	// IncrementAttempts atomically bumps the attempt counter for the given OTP.
	IncrementAttempts(ctx context.Context, id uuid.UUID) error
	// MarkVerified sets verified_at to now for the given OTP.
	MarkVerified(ctx context.Context, id uuid.UUID) error
	// InvalidatePrevious sets expires_at = now on all unverified OTPs
	// for the given user+purpose, so only the newest OTP is usable.
	InvalidatePrevious(ctx context.Context, userID uuid.UUID, purpose models.OTPPurpose) error
}

type otpRepository struct {
	db *gorm.DB
}

// NewOTPRepository builds a GORM-backed OTPRepository.
func NewOTPRepository(db *gorm.DB) OTPRepository {
	return &otpRepository{db: db}
}

func (r *otpRepository) Create(ctx context.Context, otp *models.OTPCode) error {
	return r.db.WithContext(ctx).Create(otp).Error
}

func (r *otpRepository) FindLatestValid(ctx context.Context, userID uuid.UUID, purpose models.OTPPurpose) (*models.OTPCode, error) {
	var otp models.OTPCode
	if err := r.db.WithContext(ctx).
		Where("user_id = ? AND purpose = ? AND expires_at > ? AND verified_at IS NULL",
			userID, purpose, time.Now()).
		Order("created_at DESC").
		First(&otp).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &otp, nil
}

func (r *otpRepository) IncrementAttempts(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&models.OTPCode{}).
		Where("id = ?", id).
		UpdateColumn("attempts", gorm.Expr("attempts + 1")).Error
}

func (r *otpRepository) MarkVerified(ctx context.Context, id uuid.UUID) error {
	now := time.Now()
	return r.db.WithContext(ctx).
		Model(&models.OTPCode{}).
		Where("id = ?", id).
		Update("verified_at", now).Error
}

func (r *otpRepository) InvalidatePrevious(ctx context.Context, userID uuid.UUID, purpose models.OTPPurpose) error {
	// Set expires_at to the past so FindLatestValid won't pick them up.
	return r.db.WithContext(ctx).
		Model(&models.OTPCode{}).
		Where("user_id = ? AND purpose = ? AND verified_at IS NULL AND expires_at > ?",
			userID, purpose, time.Now()).
		Update("expires_at", time.Now().Add(-1*time.Second)).Error
}
