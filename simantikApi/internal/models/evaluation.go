package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// EvaluationSourceType indicates the origin of an evaluation record.
type EvaluationSourceType string

const (
	EvaluationSourceTryout   EvaluationSourceType = "tryout"
	EvaluationSourcePractice EvaluationSourceType = "practice"
)

// PerformanceLevel categorizes competency mastery.
type PerformanceLevel string

const (
	PerformanceLevelLow    PerformanceLevel = "low"
	PerformanceLevelMedium PerformanceLevel = "medium"
	PerformanceLevelHigh   PerformanceLevel = "high"
)

// RecommendationPriority specifies urgency for recommended learning modules.
type RecommendationPriority string

const (
	RecommendationPriorityHigh   RecommendationPriority = "high"
	RecommendationPriorityMedium RecommendationPriority = "medium"
	RecommendationPriorityLow    RecommendationPriority = "low"
)

// Evaluation stores the assessment outcome and performance metrics snapshot.
type Evaluation struct {
	ID               uuid.UUID            `gorm:"type:uuid;primaryKey" json:"id"`
	UserID           uuid.UUID            `gorm:"type:uuid;not null;index" json:"userId"`
	SourceType       EvaluationSourceType `gorm:"type:varchar(20);not null;index" json:"sourceType"`
	SourceID         uuid.UUID            `gorm:"type:uuid;not null;index" json:"sourceId"`
	TotalQuestions   int                  `gorm:"not null" json:"totalQuestions"`
	CorrectAnswers   int                  `gorm:"not null" json:"correctAnswers"`
	IncorrectAnswers int                  `gorm:"not null" json:"incorrectAnswers"`
	Score            float64              `gorm:"type:numeric(10,2);not null" json:"score"`
	Accuracy         float64              `gorm:"type:numeric(5,2);not null" json:"accuracy"` // e.g. 85.50%
	CreatedAt        time.Time            `json:"createdAt"`

	User                  *User                  `gorm:"foreignKey:UserID;" json:"-"`
	CompetencyEvaluations []CompetencyEvaluation `gorm:"foreignKey:EvaluationID;constraint:OnDelete:CASCADE;" json:"competencyEvaluations,omitempty"`
}

func (e *Evaluation) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}

// CompetencyEvaluation breaks down evaluation scores by specific educational competency.
type CompetencyEvaluation struct {
	ID             uuid.UUID        `gorm:"type:uuid;primaryKey" json:"id"`
	EvaluationID   uuid.UUID        `gorm:"type:uuid;not null;index" json:"evaluationId"`
	UserID         uuid.UUID        `gorm:"type:uuid;not null;index" json:"userId"`
	CompetencyID   uuid.UUID        `gorm:"type:uuid;not null;index" json:"competencyId"`
	TotalQuestions int              `gorm:"not null" json:"totalQuestions"`
	CorrectAnswers int              `gorm:"not null" json:"correctAnswers"`
	Score          float64          `gorm:"type:numeric(10,2);not null" json:"score"`
	Accuracy       float64          `gorm:"type:numeric(5,2);not null" json:"accuracy"`
	Level          PerformanceLevel `gorm:"type:varchar(20);not null" json:"level"` // low, medium, high
	CreatedAt      time.Time        `json:"createdAt"`

	Competency *Competency `gorm:"foreignKey:CompetencyID;" json:"competency,omitempty"`
}

func (ce *CompetencyEvaluation) BeforeCreate(tx *gorm.DB) error {
	if ce.ID == uuid.Nil {
		ce.ID = uuid.New()
	}
	return nil
}

// Recommendation maps weak competencies identified during evaluation to learning materials.
// Closes the learning loop: Learning -> Assessment -> Evaluation -> Recommendation -> Learning.
type Recommendation struct {
	ID                 uuid.UUID              `gorm:"type:uuid;primaryKey" json:"id"`
	UserID             uuid.UUID              `gorm:"type:uuid;not null;index" json:"userId"`
	CompetencyID       uuid.UUID              `gorm:"type:uuid;not null;index" json:"competencyId"`
	EvaluationID       *uuid.UUID             `gorm:"type:uuid;index" json:"evaluationId"`
	MaterialID         *uuid.UUID             `gorm:"type:uuid;index" json:"materialId"`
	RecommendationText string                 `gorm:"type:text;not null" json:"recommendationText"`
	Priority           RecommendationPriority `gorm:"type:varchar(20);not null;default:'medium'" json:"priority"`
	CreatedAt          time.Time              `json:"createdAt"`

	Competency *Competency `gorm:"foreignKey:CompetencyID;" json:"competency,omitempty"`
	Material   *Material   `gorm:"foreignKey:MaterialID;" json:"material,omitempty"`
}

func (r *Recommendation) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}
