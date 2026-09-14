package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UserStatus represents the lifecycle state of a user account.
type UserStatus string

const (
	UserStatusActive    UserStatus = "active"
	UserStatusPending   UserStatus = "pending"
	UserStatusInactive  UserStatus = "inactive"
	UserStatusSuspended UserStatus = "suspended"
)

// UserRole represents the RBAC role assigned to a user.
type UserRole string

const (
	UserRoleStudent        UserRole = "student"
	UserRoleAdmin          UserRole = "admin"
	UserRoleContentManager UserRole = "content_manager"
)

// User is the core identity and authentication entity for SIMANTIK.
// FullName replaces the earlier scaffold Name field.
// PasswordHash is intentionally empty for users who only authenticate via Google.
type User struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey"                   json:"id"`
	FullName     string         `gorm:"type:varchar(150);not null"              json:"fullName"`
	Email        string         `gorm:"type:varchar(255);uniqueIndex;not null"  json:"email"`
	PasswordHash string         `gorm:"type:varchar(255);not null;default:''"   json:"-"`
	AvatarURL    *string        `gorm:"type:varchar(500)"                       json:"avatarURL"`
	Role         UserRole       `gorm:"type:varchar(30);not null;default:'student'" json:"role"`
	Status       UserStatus     `gorm:"type:varchar(20);not null;default:'active'"  json:"status"`
	LastLoginAt  *time.Time     `json:"lastLoginAt"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index"                                   json:"-"`

	StudentProfile *StudentProfile `gorm:"foreignKey:UserID" json:"studentProfile,omitempty"`
}

// BeforeCreate generates a UUID primary key application-side, avoiding a
// dependency on database-level UUID extensions.
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// IsActive returns true when the account is permitted to authenticate.
func (u *User) IsActive() bool {
	return u.Status == UserStatusActive
}
