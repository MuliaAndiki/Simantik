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
}

type UpdateTryoutRequest struct {
	Title           string `json:"title" validate:"omitempty,min=3,max=200"`
	Description     string `json:"description"`
	Jenjang         string `json:"jenjang" validate:"omitempty,oneof=sd smp sma smk"`
	DurationSeconds int    `json:"duration_seconds" validate:"omitempty,min=60"`
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

type SyncTryoutQuestionsRequest struct {
	Questions []CreateQuestionRequest `json:"questions" validate:"required,min=1,dive"`
}

type TryoutDetailResponse struct {
	TryoutResponse
	Questions []QuestionAdminResponse `json:"questions"`
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

// ─── Tryout Results & Inspection DTOs (Admin / Content Manager) ──────────────

// TryoutCognitiveBreakdown represents the pool distribution across cognitive levels C1-C5.
type TryoutCognitiveBreakdown struct {
	C1Count int `json:"c1_count"`
	C2Count int `json:"c2_count"`
	C3Count int `json:"c3_count"`
	C4Count int `json:"c4_count"`
	C5Count int `json:"c5_count"`
}

// TryoutStudentResultItem represents student performance row in a tryout package.
type TryoutStudentResultItem struct {
	UserID               uuid.UUID  `json:"user_id"`
	NIS                  string     `json:"nis"`
	StudentName          string     `json:"student_name"`
	StudentEmail         string     `json:"student_email"`
	School               string     `json:"school"`
	Grade                string     `json:"grade"`
	Score                float64    `json:"score"`
	CorrectAnswers       int        `json:"correct_answers"`
	TotalQuestions       int        `json:"total_questions"`
	IncorrectAnswers     int        `json:"incorrect_answers"`
	DurationMinutes      int        `json:"duration_minutes"`
	FormattedDuration    string     `json:"formatted_duration"`
	Status               string     `json:"status"` // "completed", "in_progress", "not_started"
	CompletedAt          *time.Time `json:"completed_at,omitempty"`
	FormattedCompletedAt string     `json:"formatted_completed_at"`
	AttemptID            *uuid.UUID `json:"attempt_id,omitempty"`
}

// TryoutPackageResultsResponse represents tryout package metadata, cognitive breakdown, and student attempt list.
type TryoutPackageResultsResponse struct {
	TryoutID                uuid.UUID                `json:"tryout_id"`
	TryoutTitle             string                   `json:"tryout_title"`
	Description             string                   `json:"description"`
	Jenjang                 string                   `json:"jenjang"`
	DurationMinutes         int                      `json:"duration_minutes"`
	TotalPoolQuestions      int                      `json:"total_pool_questions"`
	Status                  string                   `json:"status"`
	CreatedAt               time.Time                `json:"created_at"`
	UpdatedAt               time.Time                `json:"updated_at"`
	FormattedCreatedAt      string                   `json:"formatted_created_at"`
	FormattedUpdatedAt      string                   `json:"formatted_updated_at"`
	CognitiveBreakdown      TryoutCognitiveBreakdown `json:"cognitive_breakdown"`
	TotalStudentsCompleted  int                      `json:"total_students_completed"`
	AverageScore            float64                  `json:"average_score"`
	HighestScore            float64                  `json:"highest_score"`
	HighestCorrectAnswers   int                      `json:"highest_correct_answers"`
	HighestIncorrectAnswers int                      `json:"highest_incorrect_answers"`
	LowestScore             float64                  `json:"lowest_score"`
	LowestCorrectAnswers    int                      `json:"lowest_correct_answers"`
	LowestIncorrectAnswers  int                      `json:"lowest_incorrect_answers"`
	Students                []TryoutStudentResultItem `json:"students"`
	Total                   int64                    `json:"total"`
	Limit                   int                      `json:"limit"`
	Offset                  int                      `json:"offset"`
}

// ListTryoutResultFilter filter query params for tryout results.
type ListTryoutResultFilter struct {
	Search string `query:"search"`
	Status string `query:"status"` // "all", "completed", "in_progress", "not_started"
	Sort   string `query:"sort"`   // "highest_score", "lowest_score", "newest", "name_asc"
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}
