package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Role defines an authorization role in SIMANTIK RBAC.
type Role struct {
	ID          uuid.UUID    `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string       `gorm:"type:varchar(50);not null;uniqueIndex" json:"name"` // student, admin, content_manager
	Description string       `gorm:"type:text" json:"description"`
	Permissions []Permission `gorm:"many2many:role_permissions;" json:"permissions,omitempty"`
	CreatedAt   time.Time    `json:"createdAt"`
	UpdatedAt   time.Time    `json:"updatedAt"`
}

func (r *Role) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}

// Permission defines a specific resource and action granted to roles.
type Permission struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(100);not null;uniqueIndex" json:"name"` // e.g. "questions:create"
	Resource    string    `gorm:"type:varchar(50);not null;index" json:"resource"`    // e.g. "questions"
	Action      string    `gorm:"type:varchar(50);not null" json:"action"`            // e.g. "create", "read"
	Description string    `gorm:"type:text" json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func (p *Permission) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// RolePermission is the junction table connecting Roles and Permissions.
type RolePermission struct {
	RoleID       uuid.UUID `gorm:"type:uuid;primaryKey" json:"roleId"`
	PermissionID uuid.UUID `gorm:"type:uuid;primaryKey" json:"permissionId"`
	CreatedAt    time.Time `json:"createdAt"`
}
