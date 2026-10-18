package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Stimulus is a shared reading passage (wacana) that 1-3 questions refer to,
// e.g. "Teks untuk soal nomor 8 s.d. 10". Only the display text is shared;
// scoring stays per question.
type Stimulus struct {
	ID          uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(200);not null" json:"title"`
	Content     string         `gorm:"type:text;not null" json:"content"`
	PackageID   *uuid.UUID     `gorm:"type:uuid;index:idx_stimuli_package_scope,priority:1" json:"packageId,omitempty"`
	PackageKind string         `gorm:"type:varchar(20);index:idx_stimuli_package_scope,priority:2" json:"packageKind,omitempty"` // "tryout" | "practice"
	CreatedBy   uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	Questions []Question `gorm:"foreignKey:StimulusID;" json:"questions,omitempty"`
}

func (s *Stimulus) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}
