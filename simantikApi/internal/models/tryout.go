package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AttemptStatus represents the lifecycle state of an assessment attempt.
type AttemptStatus string

const (
	AttemptStatusInProgress AttemptStatus = "in_progress"
	AttemptStatusCompleted  AttemptStatus = "completed"
	AttemptStatusAbandoned  AttemptStatus = "abandoned"
	AttemptStatusExpired    AttemptStatus = "expired"
)

// Tryout defines a timed simulation examination package.
type Tryout struct {
	ID              uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Title           string         `gorm:"type:varchar(200);not null" json:"title"`
	Description     string         `gorm:"type:text" json:"description"`
	Jenjang         SchoolLevel    `gorm:"column:jenjang;type:varchar(20);not null;default:'sma';index" json:"jenjang"`
	DurationSeconds int            `gorm:"not null;default:4500" json:"durationSeconds"` // e.g. 75 mins = 4500s
	Status          ContentStatus  `gorm:"type:varchar(20);not null;default:'draft';index" json:"status"`
	StartAt         *time.Time     `json:"startAt"`
	EndAt           *time.Time     `json:"endAt"`
	CreatedBy       uuid.UUID      `gorm:"type:uuid;not null;index" json:"createdBy"`
	UpdatedBy       *uuid.UUID     `gorm:"type:uuid" json:"updatedBy"`
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	Questions []Question `gorm:"many2many:tryout_questions;" json:"questions,omitempty"`
}

func (t *Tryout) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}

// TryoutQuestion assigns a question pool to a tryout with optional display order and score weight.
type TryoutQuestion struct {
	TryoutID     uuid.UUID `gorm:"type:uuid;primaryKey" json:"tryoutId"`
	QuestionID   uuid.UUID `gorm:"type:uuid;primaryKey" json:"questionId"`
	DisplayOrder int       `gorm:"not null;default:0" json:"displayOrder"`
	ScoreWeight  float64   `gorm:"type:numeric(5,2);not null;default:1.0" json:"scoreWeight"`
	CreatedAt    time.Time `json:"createdAt"`
}

// TryoutAttempt represents an individual student's timed execution of a tryout.
// It tracks adaptive state transitions (CurrentDifficultyLevel, CorrectStreak).
type TryoutAttempt struct {
	ID                     uuid.UUID     `gorm:"type:uuid;primaryKey" json:"id"`
	TryoutID               uuid.UUID     `gorm:"type:uuid;not null;index" json:"tryoutId"`
	UserID                 uuid.UUID     `gorm:"type:uuid;not null;index" json:"userId"`
	Status                 AttemptStatus `gorm:"type:varchar(20);not null;default:'in_progress';index" json:"status"`
	CurrentQuestionNumber  int           `gorm:"not null;default:1" json:"currentQuestionNumber"`
	CurrentDifficultyLevel int           `gorm:"not null;default:1" json:"currentDifficultyLevel"` // 1 to 5
	TargetStreak           int           `gorm:"not null;default:2" json:"targetStreak"`           // dynamic window (1 to 3)
	WindowCorrect          int           `gorm:"not null;default:0" json:"windowCorrect"`          // correct answers in current window
	WindowIncorrect        int           `gorm:"not null;default:0" json:"windowIncorrect"`        // incorrect answers in current window
	IsTieBreaker           bool          `gorm:"not null;default:false" json:"isTieBreaker"`       // true if resolving a tie
	CorrectStreak          int           `gorm:"not null;default:0" json:"correctStreak"`
	IsAutoSubmitted        bool          `gorm:"not null;default:false" json:"isAutoSubmitted"`
	AutoSubmitReason       string        `gorm:"type:varchar(100)" json:"autoSubmitReason,omitempty"`
	Score                  *float64      `gorm:"type:numeric(10,2)" json:"score"`
	StartedAt              time.Time     `gorm:"not null" json:"startedAt"`
	SubmittedAt            *time.Time    `json:"submittedAt"`
	CreatedAt              time.Time     `json:"createdAt"`
	UpdatedAt              time.Time     `json:"updatedAt"`

	Tryout           *Tryout           `gorm:"foreignKey:TryoutID;" json:"tryout,omitempty"`
	User             *User             `gorm:"foreignKey:UserID;" json:"-"`
	AttemptQuestions []AttemptQuestion `gorm:"foreignKey:AttemptID;constraint:OnDelete:CASCADE;" json:"attemptQuestions,omitempty"`
	Answers          []StudentAnswer   `gorm:"foreignKey:AttemptID;constraint:OnDelete:CASCADE;" json:"answers,omitempty"`
}

func (ta *TryoutAttempt) BeforeCreate(tx *gorm.DB) error {
	if ta.ID == uuid.Nil {
		ta.ID = uuid.New()
	}
	if ta.StartedAt.IsZero() {
		ta.StartedAt = time.Now()
	}
	if ta.CurrentDifficultyLevel < 1 {
		ta.CurrentDifficultyLevel = 1
	}
	return nil
}

// AttemptQuestion records which questions were delivered in what order and difficulty level.
// This enables complete reconstruction and audit of adaptive test paths.
type AttemptQuestion struct {
	ID              uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	AttemptID       uuid.UUID  `gorm:"type:uuid;not null;index" json:"attemptId"`
	QuestionID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"questionId"`
	QuestionNumber  int        `gorm:"not null" json:"questionNumber"`
	DifficultyLevel int        `gorm:"not null" json:"difficultyLevel"`
	PresentedAt     time.Time  `gorm:"not null" json:"presentedAt"`
	AnsweredAt      *time.Time `json:"answeredAt"`
	CreatedAt       time.Time  `json:"createdAt"`

	Question *Question `gorm:"foreignKey:QuestionID;" json:"question,omitempty"`
}

func (aq *AttemptQuestion) BeforeCreate(tx *gorm.DB) error {
	if aq.ID == uuid.Nil {
		aq.ID = uuid.New()
	}
	if aq.PresentedAt.IsZero() {
		aq.PresentedAt = time.Now()
	}
	return nil
}

// StudentAnswer records the student's submission for a question in an attempt.
type StudentAnswer struct {
	ID                  uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	AttemptID           uuid.UUID  `gorm:"type:uuid;not null;index" json:"attemptId"`
	QuestionID          uuid.UUID  `gorm:"type:uuid;not null;index" json:"questionId"`
	AttemptQuestionID   *uuid.UUID `gorm:"type:uuid;index" json:"attemptQuestionId"`
	SelectedOptionID    *uuid.UUID `gorm:"type:uuid" json:"selectedOptionId"`
	AnswerData          string     `gorm:"type:jsonb" json:"answerData"` // JSON representation for complex / multi-choice answers
	IsCorrect           *bool      `json:"isCorrect"`
	Score               *float64   `gorm:"type:numeric(5,2)" json:"score"`
	ResponseTimeSeconds int        `gorm:"not null;default:0" json:"responseTimeSeconds"`
	AnsweredAt          time.Time  `gorm:"not null" json:"answeredAt"`
	CreatedAt           time.Time  `json:"createdAt"`
	UpdatedAt           time.Time  `json:"updatedAt"`

	Question       *Question       `gorm:"foreignKey:QuestionID;" json:"-"`
	SelectedOption *QuestionOption `gorm:"foreignKey:SelectedOptionID;" json:"selectedOption,omitempty"`
}

func (sa *StudentAnswer) BeforeCreate(tx *gorm.DB) error {
	if sa.ID == uuid.Nil {
		sa.ID = uuid.New()
	}
	if sa.AnsweredAt.IsZero() {
		sa.AnsweredAt = time.Now()
	}
	return nil
}
