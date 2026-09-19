package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateTryoutRequest struct {
	Title           string `json:"title" validate:"required,min=3,max=200"`
	Description     string `json:"description"`
	Jenjang         string `json:"jenjang" validate:"required,oneof=sd smp sma smk"`
	DurationSeconds int    `json:"duration_seconds" validate:"required,min=60"`
	TotalQuestions  int    `json:"total_questions" validate:"required,min=1"`
}

type UpdateTryoutRequest struct {
	Title           string `json:"title" validate:"omitempty,min=3,max=200"`
	Description     string `json:"description"`
	Jenjang         string `json:"jenjang" validate:"omitempty,oneof=sd smp sma smk"`
	DurationSeconds int    `json:"duration_seconds" validate:"omitempty,min=60"`
	TotalQuestions  int    `json:"total_questions" validate:"omitempty,min=1"`
}

type PublishTryoutRequest struct {
	Status string `json:"status" validate:"required,oneof=draft review published archived"`
}

type AddTryoutQuestionsRequest struct {
	QuestionIDs []uuid.UUID `json:"question_ids" validate:"required,min=1"`
}

type RemoveTryoutQuestionRequest struct {
	QuestionID uuid.UUID `json:"question_id" validate:"required"`
}

type TryoutResponse struct {
	ID              uuid.UUID  `json:"id"`
	Title           string     `json:"title"`
	Description     string     `json:"description"`
	Jenjang         string     `json:"jenjang"`
	DurationSeconds int        `json:"duration_seconds"`
	TotalQuestions  int        `json:"total_questions"`
	Status          string     `json:"status"`
	StartAt         *time.Time `json:"start_at"`
	EndAt           *time.Time `json:"end_at"`
	CreatedBy       uuid.UUID  `json:"created_by"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	PoolCount       int        `json:"pool_count"`
}

type TryoutDetailResponse struct {
	TryoutResponse
	Questions []TryoutQuestionResponse `json:"questions"`
}

type TryoutQuestionResponse struct {
	QuestionID   uuid.UUID `json:"question_id"`
	DisplayOrder int       `json:"display_order"`
	ScoreWeight  float64   `json:"score_weight"`
}

type ListTryoutFilter struct {
	Search  string `query:"search"`
	Status  string `query:"status"`
	Jenjang string `query:"jenjang"`
	Limit   int    `query:"limit"`
	Offset  int    `query:"offset"`
}

type PaginatedTryoutsResponse struct {
	Tryouts []TryoutResponse `json:"tryouts"`
	Total   int64            `json:"total"`
	Limit   int              `json:"limit"`
	Offset  int              `json:"offset"`
}
