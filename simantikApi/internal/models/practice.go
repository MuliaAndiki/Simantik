package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Practice represents a student self-study practice attempt (non-adaptive, untimed).
type Practice struct {
	ID             uuid.UUID     `gorm:"type:uuid;primaryKey" json:"id"`
	UserID         uuid.UUID     `gorm:"type:uuid;not null;index" json:"userId"`
	PackageID      *uuid.UUID    `gorm:"type:uuid;index" json:"packageId"`      // practice package reference
	CompetencyID   *uuid.UUID    `gorm:"type:uuid;index" json:"competencyId"`   // optional competency focus
	Status           AttemptStatus `gorm:"type:varchar(20);not null;default:'in_progress';index" json:"status"`
	Score            *float64      `gorm:"type:numeric(5,2)" json:"score"`
	TotalQuestions   int           `gorm:"not null;default:0" json:"totalQuestions"`
	CorrectAnswers   int           `gorm:"not null;default:0" json:"correctAnswers"`
	IsAutoSubmitted  bool          `gorm:"not null;default:false" json:"isAutoSubmitted"`
	AutoSubmitReason string        `gorm:"type:varchar(100)" json:"autoSubmitReason,omitempty"`
	StartedAt        time.Time     `gorm:"not null" json:"startedAt"`
	CompletedAt    *time.Time    `json:"completedAt"`
	CreatedAt      time.Time     `json:"createdAt"`
	UpdatedAt      time.Time     `json:"updatedAt"`

	User       *User            `gorm:"foreignKey:UserID;" json:"-"`
	Package    *PracticePackage `gorm:"foreignKey:PackageID;" json:"package,omitempty"`
	Competency *Competency      `gorm:"foreignKey:CompetencyID;" json:"competency,omitempty"`
	Answers    []PracticeAnswer `gorm:"foreignKey:PracticeID;constraint:OnDelete:CASCADE;" json:"answers,omitempty"`
}

func (p *Practice) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	if p.StartedAt.IsZero() {
		p.StartedAt = time.Now()
	}
	return nil
}

// PracticeAnswer records a student's answer during a self-study practice session.
type PracticeAnswer struct {
	ID               uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	PracticeID       uuid.UUID  `gorm:"type:uuid;not null;index" json:"practiceId"`
	QuestionID       uuid.UUID  `gorm:"type:uuid;not null;index" json:"questionId"`
	SelectedOptionID *uuid.UUID `gorm:"type:uuid" json:"selectedOptionId"`
	AnswerData       string     `gorm:"type:jsonb" json:"answerData"`
	IsCorrect        *bool      `json:"isCorrect"`
	Score            *float64   `gorm:"type:numeric(5,2)" json:"score"`
	AnsweredAt       time.Time  `gorm:"not null" json:"answeredAt"`
	CreatedAt        time.Time  `json:"createdAt"`

	Question       *Question       `gorm:"foreignKey:QuestionID;" json:"question,omitempty"`
	SelectedOption *QuestionOption `gorm:"foreignKey:SelectedOptionID;" json:"selectedOption,omitempty"`
}

func (pa *PracticeAnswer) BeforeCreate(tx *gorm.DB) error {
	if pa.ID == uuid.Nil {
		pa.ID = uuid.New()
	}
	if pa.AnsweredAt.IsZero() {
		pa.AnsweredAt = time.Now()
	}
	return nil
}
