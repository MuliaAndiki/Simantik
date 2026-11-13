package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CompetencyStatus represents whether a competency is actively used.
type CompetencyStatus string

const (
	CompetencyStatusActive   CompetencyStatus = "active"
	CompetencyStatusInactive CompetencyStatus = "inactive"
)

// Competency represents an evaluated learning and assessment domain in SIMANTIK.
// Baseline competencies from PRD:
// 1. Pemahaman Tekstual
// 2. Pemahaman Inferensial
// 3. Evaluasi dan Apresiasi
type Competency struct {
	ID          uuid.UUID        `gorm:"type:uuid;primaryKey" json:"id"`
	Code        string           `gorm:"type:varchar(50);not null;uniqueIndex:idx_competencies_code_active,where:deleted_at IS NULL" json:"code"`
	Name        string           `gorm:"type:varchar(150);not null" json:"name"`
	Description string           `gorm:"type:text" json:"description"`
	Status      CompetencyStatus `gorm:"type:varchar(20);not null;default:'active'" json:"status"`
	CreatedAt   time.Time        `json:"createdAt"`
	UpdatedAt   time.Time        `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt   `gorm:"index" json:"-"`
}

func (c *Competency) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}
