package dto

import (
	"time"

	"github.com/google/uuid"
)

// MaxQuestionsPerStimulus caps how many questions may share one stimulus.
const MaxQuestionsPerStimulus = 3

type CreateStimulusRequest struct {
	Title       string     `json:"title" validate:"required,max=200"`
	Content     string     `json:"content" validate:"required"`
	PackageID   *uuid.UUID `json:"package_id,omitempty"`
	PackageKind string     `json:"package_kind,omitempty"` // "tryout" | "practice"
}

type UpdateStimulusRequest struct {
	Title   *string `json:"title" validate:"omitempty,max=200"`
	Content *string `json:"content" validate:"omitempty"`
}

// StimulusQuestionItem is a compact linked question (id + level for the level-spread checklist).
type StimulusQuestionItem struct {
	ID              uuid.UUID `json:"id"`
	DifficultyLevel int       `json:"difficulty_level"`
}

type StimulusResponse struct {
	ID            uuid.UUID              `json:"id"`
	Title         string                 `json:"title"`
	Content       string                 `json:"content"`
	PackageID     *uuid.UUID             `json:"package_id,omitempty"`
	PackageKind   string                 `json:"package_kind,omitempty"`
	QuestionCount int                    `json:"question_count"`
	LevelsCovered []int                  `json:"levels_covered"`
	Questions     []StimulusQuestionItem `json:"questions,omitempty"`
	CreatedBy     uuid.UUID              `json:"created_by"`
	CreatedAt     time.Time              `json:"created_at"`
	UpdatedAt     time.Time              `json:"updated_at"`
}

type ListStimulusFilter struct {
	Search string `query:"search"`
	// Package scope: when set, stimuli used in OTHER packages are excluded.
	PackageID   *uuid.UUID `query:"package_id"`
	PackageKind string     `query:"package_kind"` // "tryout" | "practice"
	Limit       int        `query:"limit"`
	Offset      int        `query:"offset"`
}

type PaginatedStimuliResponse struct {
	Stimuli []StimulusResponse `json:"stimuli"`
	Total   int64              `json:"total"`
	Limit   int                `json:"limit"`
	Offset  int                `json:"offset"`
}

type LinkStimulusQuestionRequest struct {
	QuestionID uuid.UUID `json:"question_id" validate:"required"`
}

// LinkStimulusQuestionResponse carries a soft warning (level spread),
// never blocks: only the max-3 cap is a hard error.
type LinkStimulusQuestionResponse struct {
	StimulusID uuid.UUID `json:"stimulus_id"`
	QuestionID uuid.UUID `json:"question_id"`
	Warning    string    `json:"warning,omitempty"`
}
