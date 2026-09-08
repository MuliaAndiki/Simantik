package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// RefreshToken represents a persistent login session linked to a user.
// The plaintext token is NEVER stored — only its SHA-256 hex hash is persisted.
// Multiple active sessions per user are supported (multi-device login).
type RefreshToken struct {
	ID         uuid.UUID  `gorm:"type:uuid;primaryKey"                   json:"-"`
	UserID     uuid.UUID  `gorm:"type:uuid;not null;index"               json:"-"`
	TokenHash  string     `gorm:"type:varchar(64);not null;uniqueIndex"  json:"-"`
	ExpiresAt  time.Time  `gorm:"not null;index"                         json:"-"`
	RevokedAt  *time.Time `json:"-"`
	LastUsedAt *time.Time `json:"-"`
	UserAgent  string     `gorm:"type:text"                              json:"-"`
	IPAddress  string     `gorm:"type:varchar(45)"                       json:"-"`
	CreatedAt  time.Time  `json:"-"`
}

// BeforeCreate generates a UUID primary key application-side.
func (rt *RefreshToken) BeforeCreate(tx *gorm.DB) error {
	if rt.ID == uuid.Nil {
		rt.ID = uuid.New()
	}
	return nil
}

// IsValid returns true when the token has not expired and has not been revoked.
func (rt *RefreshToken) IsValid() bool {
	return rt.RevokedAt == nil && time.Now().Before(rt.ExpiresAt)
}
