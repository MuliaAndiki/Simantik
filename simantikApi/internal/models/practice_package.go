package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PracticePackage defines a non-adaptive, topic/competency-based practice package.
type PracticePackage struct {
	ID             uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Title          string         `gorm:"type:varchar(200);not null" json:"title"`
	Description    string         `gorm:"type:text" json:"description"`
	CompetencyID   *uuid.UUID     `gorm:"type:uuid;index" json:"competencyId"` // optional competency categorization
	Jenjang        SchoolLevel    `gorm:"column:jenjang;type:varchar(20);not null;default:'sma';index" json:"jenjang"`
	TotalQuestions int            `gorm:"not null;default:0" json:"totalQuestions"`
	Status         ContentStatus  `gorm:"type:varchar(20);not null;default:'draft';index" json:"status"`
	CreatedBy      uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	UpdatedBy      *uuid.UUID     `gorm:"type:uuid" json:"updatedBy"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	Competency *Competency `gorm:"foreignKey:CompetencyID;" json:"competency,omitempty"`
	Questions  []Question  `gorm:"many2many:practice_package_questions;foreignKey:ID;joinForeignKey:PackageID;References:ID;joinReferences:QuestionID" json:"questions,omitempty"`
}

func (p *PracticePackage) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// PracticePackageQuestion defines the many-to-many relationship and ordering of questions in a practice package.
type PracticePackageQuestion struct {
	PackageID    uuid.UUID `gorm:"type:uuid;primaryKey" json:"packageId"`
	QuestionID   uuid.UUID `gorm:"type:uuid;primaryKey" json:"questionId"`
	DisplayOrder int       `gorm:"not null;default:0" json:"displayOrder"`
	CreatedAt    time.Time `json:"createdAt"`
}
