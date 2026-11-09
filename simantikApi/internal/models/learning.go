package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ContentStatus represents publishing states for learning and management content.
type ContentStatus string

const (
	ContentStatusDraft     ContentStatus = "draft"
	ContentStatusReview    ContentStatus = "review"
	ContentStatusPublished ContentStatus = "published"
	ContentStatusArchived  ContentStatus = "archived"
)

// MaterialType represents the type of content format.
type MaterialType string

const (
	MaterialTypeText     MaterialType = "text"
	MaterialTypeDocument MaterialType = "document"
	MaterialTypeVideo    MaterialType = "video"
)

// LearningModule groups sequential learning materials into structured units.
type LearningModule struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Title        string         `gorm:"type:varchar(200);not null" json:"title"`
	Description  string         `gorm:"type:text" json:"description"`
	Label        string         `gorm:"type:varchar(100);index" json:"label"`
	Jenjang      SchoolLevel    `gorm:"column:jenjang;type:varchar(20);not null;default:'sma';index" json:"jenjang"`
	DisplayOrder int            `gorm:"not null;default:0" json:"displayOrder"`
	Status       ContentStatus  `gorm:"type:varchar(20);not null;default:'draft'" json:"status"`
	CreatedBy    uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	UpdatedBy    *uuid.UUID     `gorm:"type:uuid" json:"updatedBy"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	Materials []Material `gorm:"foreignKey:ModuleID;constraint:OnDelete:CASCADE;" json:"materials,omitempty"`
}

func (lm *LearningModule) BeforeCreate(tx *gorm.DB) error {
	if lm.ID == uuid.Nil {
		lm.ID = uuid.New()
	}
	return nil
}

// Material is an individual learning resource or article within a learning module.
type Material struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	ModuleID     uuid.UUID      `gorm:"type:uuid;not null;index" json:"moduleId"`
	CompetencyID *uuid.UUID     `gorm:"type:uuid;index" json:"competencyId"` // linked competency for recommendation
	Title        string         `gorm:"type:varchar(255);not null" json:"title"`
	Description        string         `gorm:"type:text" json:"description"`
	Content            string         `gorm:"type:text;not null" json:"content"`
	LearningObjectives string         `gorm:"type:jsonb;default:'[]'" json:"learningObjectives"`
	StructureItems     string         `gorm:"type:jsonb;default:'[]'" json:"structureItems"`
	Type               MaterialType   `gorm:"type:varchar(20);not null;default:'text'" json:"type"`
	DisplayOrder int            `gorm:"not null;default:0" json:"displayOrder"`
	Status       ContentStatus  `gorm:"type:varchar(20);not null;default:'draft'" json:"status"`
	CreatedBy    uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	UpdatedBy    *uuid.UUID     `gorm:"type:uuid" json:"updatedBy"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	Module      *LearningModule      `gorm:"foreignKey:ModuleID;" json:"-"`
	Competency  *Competency          `gorm:"foreignKey:CompetencyID;" json:"competency,omitempty"`
	Attachments []MaterialAttachment `gorm:"foreignKey:MaterialID;constraint:OnDelete:CASCADE;" json:"attachments,omitempty"`
}

func (m *Material) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}

// MaterialAttachment associates uploaded documents or media files with a learning material.
type MaterialAttachment struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	MaterialID   uuid.UUID `gorm:"type:uuid;not null;index" json:"materialId"`
	FileID       uuid.UUID `gorm:"type:uuid;not null;index" json:"fileId"`
	DisplayOrder int       `gorm:"not null;default:0" json:"displayOrder"`
	CreatedAt    time.Time `json:"createdAt"`

	Material *Material   `gorm:"foreignKey:MaterialID;" json:"-"`
	File     *FileRecord `gorm:"foreignKey:FileID;" json:"file,omitempty"`
}

func (ma *MaterialAttachment) BeforeCreate(tx *gorm.DB) error {
	if ma.ID == uuid.Nil {
		ma.ID = uuid.New()
	}
	return nil
}

// LearningProgress tracks a student's completion of individual materials and overall modules.
type LearningProgress struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	UserID      uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_learning_progress_user_material" json:"userId"`
	MaterialID  uuid.UUID  `gorm:"type:uuid;not null;uniqueIndex:idx_learning_progress_user_material" json:"materialId"`
	IsCompleted bool       `gorm:"not null;default:false" json:"isCompleted"`
	CompletedAt *time.Time `json:"completedAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`

	User     *User     `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"-"`
	Material *Material `gorm:"foreignKey:MaterialID;constraint:OnDelete:CASCADE;" json:"material,omitempty"`
}

func (lp *LearningProgress) BeforeCreate(tx *gorm.DB) error {
	if lp.ID == uuid.Nil {
		lp.ID = uuid.New()
	}
	return nil
}
