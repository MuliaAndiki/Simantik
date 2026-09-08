package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PasswordResetToken is a short-lived, single-use authorization token
// issued after a successful OTP verification. It allows the holder to
// call resetPassword exactly once within its validity window.
// The plaintext token is NEVER stored — only its SHA-256 hex hash.
type PasswordResetToken struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey"                   json:"-"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null;index"               json:"-"`
	TokenHash string     `gorm:"type:varchar(64);not null;uniqueIndex"  json:"-"`
	ExpiresAt time.Time  `gorm:"not null"                               json:"-"`
	UsedAt    *time.Time `json:"-"`
	CreatedAt time.Time  `json:"-"`
}

// BeforeCreate generates a UUID primary key application-side.
func (p *PasswordResetToken) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// IsValid returns true when the token has not expired and has not been used.
func (p *PasswordResetToken) IsValid() bool {
	return p.UsedAt == nil && time.Now().Before(p.ExpiresAt)
}
