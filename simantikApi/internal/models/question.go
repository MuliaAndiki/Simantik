package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// QuestionTypeCode represents supported question formats.
type QuestionTypeCode string

const (
	QuestionTypeMultipleChoice        QuestionTypeCode = "multiple_choice"
	QuestionTypeComplexMultipleChoice QuestionTypeCode = "complex_multiple_choice"
	QuestionTypeTrueFalse             QuestionTypeCode = "true_false"
)

// QuestionType defines formatting and scoring rules for a category of questions.
type QuestionType struct {
	ID          uuid.UUID        `gorm:"type:uuid;primaryKey" json:"id"`
	Code        QuestionTypeCode `gorm:"type:varchar(50);not null;uniqueIndex" json:"code"`
	Name        string           `gorm:"type:varchar(100);not null" json:"name"`
	Description string           `gorm:"type:text" json:"description"`
	CreatedAt   time.Time        `json:"createdAt"`
	UpdatedAt   time.Time        `json:"updatedAt"`
}

func (qt *QuestionType) BeforeCreate(tx *gorm.DB) error {
	if qt.ID == uuid.Nil {
		qt.ID = uuid.New()
	}
	return nil
}

// Question is the core assessment unit in the SIMANTIK question bank.
// DifficultyLevel is 1 to 5, as specified in the PRD for adaptive testing.
type Question struct {
	ID              uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	QuestionTypeID  uuid.UUID      `gorm:"type:uuid;not null;index" json:"questionTypeId"`
	QuestionText    string         `gorm:"type:text;not null" json:"questionText"`
	DifficultyLevel int            `gorm:"not null;default:1;index" json:"difficultyLevel"` // 1 (easiest) to 5 (hardest)
	Status          ContentStatus  `gorm:"type:varchar(20);not null;default:'draft';index" json:"status"`
	CreatedBy       uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	UpdatedBy       *uuid.UUID     `gorm:"type:uuid" json:"updatedBy"`
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	Type         *QuestionType        `gorm:"foreignKey:QuestionTypeID;" json:"type,omitempty"`
	Options      []QuestionOption     `gorm:"foreignKey:QuestionID;constraint:OnDelete:CASCADE;" json:"options,omitempty"`
	Competencies []Competency         `gorm:"many2many:question_competencies;" json:"competencies,omitempty"`
	Explanation  *QuestionExplanation `gorm:"foreignKey:QuestionID;constraint:OnDelete:CASCADE;" json:"explanation,omitempty"`
}

func (q *Question) BeforeCreate(tx *gorm.DB) error {
	if q.ID == uuid.Nil {
		q.ID = uuid.New()
	}
	if q.DifficultyLevel < 1 {
		q.DifficultyLevel = 1
	} else if q.DifficultyLevel > 5 {
		q.DifficultyLevel = 5
	}
	return nil
}

// QuestionOption defines an answer option (e.g., A, B, C, D, E) for a question.
// IsCorrect is persisted in the database, but must be excluded from student-facing DTOs.
type QuestionOption struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	QuestionID   uuid.UUID `gorm:"type:uuid;not null;index" json:"questionId"`
	OptionLabel  string    `gorm:"type:varchar(10);not null" json:"optionLabel"` // e.g. "A", "B", "C", "D", "E"
	OptionText   string    `gorm:"type:text;not null" json:"optionText"`
	IsCorrect    bool      `gorm:"not null;default:false" json:"isCorrect,omitempty"`
	DisplayOrder int       `gorm:"not null;default:0" json:"displayOrder"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

func (qo *QuestionOption) BeforeCreate(tx *gorm.DB) error {
	if qo.ID == uuid.Nil {
		qo.ID = uuid.New()
	}
	return nil
}

// QuestionCompetency is the junction table connecting questions to evaluated competencies.
type QuestionCompetency struct {
	QuestionID   uuid.UUID `gorm:"type:uuid;primaryKey" json:"questionId"`
	CompetencyID uuid.UUID `gorm:"type:uuid;primaryKey" json:"competencyId"`
	CreatedAt    time.Time `json:"createdAt"`
}

// QuestionExplanation provides pedagogical explanations and answering strategies ("tips & trik").
type QuestionExplanation struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	QuestionID    uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"questionId"`
	Explanation   string    `gorm:"type:text;not null" json:"explanation"`
	AnsweringTips string    `gorm:"type:text" json:"answeringTips"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func (qe *QuestionExplanation) BeforeCreate(tx *gorm.DB) error {
	if qe.ID == uuid.Nil {
		qe.ID = uuid.New()
	}
	return nil
}
