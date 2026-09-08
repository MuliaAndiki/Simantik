package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ExternalAccount links a SIMANTIK user to an external OAuth/OIDC identity.
// Using a separate table (rather than google_id on users) keeps the User model
// clean and allows future providers (GitHub, Microsoft, etc.) without schema changes.
type ExternalAccount struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey"                    json:"-"`
	UserID         uuid.UUID `gorm:"type:uuid;not null;index"                json:"-"`
	Provider       string    `gorm:"type:varchar(30);not null"               json:"-"` // e.g. "google"
	ProviderUserID string    `gorm:"type:varchar(255);not null"              json:"-"` // e.g. Google "sub"
	Email          string    `gorm:"type:varchar(255)"                       json:"-"` // cached from provider
	CreatedAt      time.Time `json:"-"`
	UpdatedAt      time.Time `json:"-"`
}

// BeforeCreate generates a UUID primary key application-side.
func (ea *ExternalAccount) BeforeCreate(tx *gorm.DB) error {
	if ea.ID == uuid.Nil {
		ea.ID = uuid.New()
	}
	return nil
}
