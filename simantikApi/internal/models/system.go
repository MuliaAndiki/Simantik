package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// FileRecord stores metadata for media and documents uploaded to object storage.
type FileRecord struct {
	ID              uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	ObjectKey       string         `gorm:"type:varchar(500);not null;uniqueIndex" json:"objectKey"`
	OriginalName    string         `gorm:"type:varchar(255);not null" json:"originalName"`
	MimeType        string         `gorm:"type:varchar(100);not null" json:"mimeType"`
	SizeBytes       int64          `gorm:"not null" json:"sizeBytes"`
	StorageProvider string         `gorm:"type:varchar(50);not null;default:'s3'" json:"storageProvider"`
	UploadedBy      *uuid.UUID     `gorm:"type:uuid;index" json:"uploadedBy"`
	CreatedAt       time.Time      `json:"createdAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

func (fr *FileRecord) BeforeCreate(tx *gorm.DB) error {
	if fr.ID == uuid.Nil {
		fr.ID = uuid.New()
	}
	return nil
}

// AuditLog tracks administrative and critical domain actions for compliance and system monitoring.
// Sensitive data (passwords, OTPs, raw tokens) must NEVER be written to metadata.
type AuditLog struct {
	ID         uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	UserID     *uuid.UUID `gorm:"type:uuid;index" json:"userId"`
	Action     string     `gorm:"type:varchar(50);not null;index" json:"action"` // e.g. "LOGIN", "ROLE_CHANGE", "SUBMIT_TRYOUT"
	EntityType string     `gorm:"type:varchar(50);not null;index" json:"entityType"`
	EntityID   *uuid.UUID `gorm:"type:uuid;index" json:"entityId"`
	Metadata   string     `gorm:"type:jsonb" json:"metadata"` // JSON structured audit context
	IPAddress  string     `gorm:"type:varchar(45)" json:"ipAddress"`
	UserAgent  string     `gorm:"type:text" json:"userAgent"`
	CreatedAt  time.Time  `gorm:"not null;index" json:"createdAt"`
}

func (al *AuditLog) BeforeCreate(tx *gorm.DB) error {
	if al.ID == uuid.Nil {
		al.ID = uuid.New()
	}
	if al.CreatedAt.IsZero() {
		al.CreatedAt = time.Now()
	}
	return nil
}
