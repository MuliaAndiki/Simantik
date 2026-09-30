package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/models"
)

// ExternalAccountRepository defines persistence operations for third-party OAuth/OIDC accounts.
type ExternalAccountRepository interface {
	Create(ctx context.Context, account *models.ExternalAccount) error
	FindByProviderAndUserID(ctx context.Context, provider, providerUserID string) (*models.ExternalAccount, error)
	FindByUserID(ctx context.Context, userID uuid.UUID) ([]models.ExternalAccount, error)
}

type externalAccountRepository struct {
	db *gorm.DB
}

// NewExternalAccountRepository builds a GORM-backed ExternalAccountRepository.
func NewExternalAccountRepository(db *gorm.DB) ExternalAccountRepository {
	return &externalAccountRepository{db: db}
}

func (r *externalAccountRepository) Create(ctx context.Context, account *models.ExternalAccount) error {
	return r.db.WithContext(ctx).Create(account).Error
}

func (r *externalAccountRepository) FindByProviderAndUserID(ctx context.Context, provider, providerUserID string) (*models.ExternalAccount, error) {
	var account models.ExternalAccount
	if err := r.db.WithContext(ctx).
		Where("provider = ? AND provider_user_id = ?", provider, providerUserID).
		First(&account).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &account, nil
}

func (r *externalAccountRepository) FindByUserID(ctx context.Context, userID uuid.UUID) ([]models.ExternalAccount, error) {
	var accounts []models.ExternalAccount
	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&accounts).Error; err != nil {
		return nil, err
	}
	return accounts, nil
}