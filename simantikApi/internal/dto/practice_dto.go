package dto

import (
	"time"

	"github.com/google/uuid"
)

// ─── Management DTOs (Admin / Content Manager) ──────────────────────────────

// CreatePracticePackageRequest payload for creating a new practice package.
type CreatePracticePackageRequest struct {
	Title        string     `json:"title" validate:"required,min=3,max=200"`
	Description  string     `json:"description" validate:"omitempty"`
	CompetencyID *uuid.UUID `json:"competency_id" validate:"omitempty,uuid"`
	Jenjang      string     `json:"jenjang" validate:"required,oneof=sd smp sma smk"`
}

// UpdatePracticePackageRequest payload for updating practice package metadata.
type UpdatePracticePackageRequest struct {
	Title        string     `json:"title" validate:"omitempty,min=3,max=200"`
	Description  string     `json:"description" validate:"omitempty"`
	CompetencyID *uuid.UUID `json:"competency_id" validate:"omitempty,uuid"`
	Jenjang      string     `json:"jenjang" validate:"omitempty,oneof=sd smp sma smk"`
	Status       string     `json:"status" validate:"omitempty,oneof=draft published archived"`
}

// AddPracticeQuestionsRequest payload for associating questions with a practice package.
type AddPracticeQuestionsRequest struct {
	QuestionIDs []uuid.UUID `json:"question_ids" validate:"required,min=1,dive,uuid"`
}

// ListPracticePackageFilter filter parameters for listing practice packages.
type ListPracticePackageFilter struct {
	Search       string     `query:"search"`
	Status       string     `query:"status"`
	Jenjang      string     `query:"jenjang"`
	CompetencyID *uuid.UUID `query:"competency_id"`
	Limit        int        `query:"limit"`
	Offset       int        `query:"offset"`
}

// PracticePackageResponse represents a practice package summary.
type PracticePackageResponse struct {
	ID             uuid.UUID  `json:"id"`
	Title          string     `json:"title"`
	Description    string     `json:"description"`
	CompetencyID   *uuid.UUID `json:"competency_id"`
	CompetencyName string     `json:"competency_name,omitempty"`
	CompetencyCode string     `json:"competency_code,omitempty"`
	Jenjang        string     `json:"jenjang"`
	TotalQuestions int        `json:"total_questions"`
	Status         string     `json:"status"`
	CreatedBy      uuid.UUID  `json:"created_by"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`

	// Student-specific completion status (when queried by student)
	IsCompleted *bool    `json:"is_completed,omitempty"`
	LatestScore *float64 `json:"latest_score,omitempty"`
}

// PracticePackageDetailResponse represents full practice package details including student-safe questions.
type PracticePackageDetailResponse struct {
	PracticePackageResponse
	Questions []QuestionStudentResponse `json:"questions"`
}

// PaginatedPracticePackagesResponse wraps paginated practice packages.
type PaginatedPracticePackagesResponse struct {
	Packages []PracticePackageResponse `json:"packages"`
	Total    int64                     `json:"total"`
	Limit    int                       `json:"limit"`
	Offset   int                       `json:"offset"`
}

// ─── Student Practice Execution DTOs ─────────────────────────────────────────

// StartPracticeResponse returned when student begins a practice session.
type StartPracticeResponse struct {
	AttemptID      uuid.UUID `json:"attempt_id"`
	PackageID      uuid.UUID `json:"package_id"`
	PackageTitle   string    `json:"package_title"`
	TotalQuestions int       `json:"total_questions"`
	StartedAt      time.Time `json:"started_at"`
	Status         string    `json:"status"`
}

// PracticeAnswerItem stores user's current choice for a question.
type PracticeAnswerItem struct {
	QuestionID       uuid.UUID  `json:"question_id"`
	SelectedOptionID *uuid.UUID `json:"selected_option_id"`
	AnswerData       string     `json:"answer_data"`
	AnsweredAt       time.Time  `json:"answered_at"`
}

// PracticeAttemptDetailResponse returns the ongoing attempt state with questions and saved answers.
type PracticeAttemptDetailResponse struct {
	AttemptID      uuid.UUID                 `json:"attempt_id"`
	PackageID      uuid.UUID                 `json:"package_id"`
	PackageTitle   string                    `json:"package_title"`
	Status         string                    `json:"status"`
	TotalQuestions int                       `json:"total_questions"`
	AnsweredCount  int                       `json:"answered_count"`
	StartedAt      time.Time                 `json:"started_at"`
	Questions      []QuestionStudentResponse `json:"questions"`
	Answers        []PracticeAnswerItem      `json:"answers"`
}

// SubmitPracticeAnswerRequest payload for saving an answer in a practice attempt.
type SubmitPracticeAnswerRequest struct {
	QuestionID       uuid.UUID  `json:"question_id" validate:"required,uuid"`
	SelectedOptionID *uuid.UUID `json:"selected_option_id" validate:"omitempty,uuid"`
	AnswerData       string     `json:"answer_data"`
}

// SubmitPracticeAnswerResponse returned after saving an answer.
type SubmitPracticeAnswerResponse struct {
	QuestionID     uuid.UUID `json:"question_id"`
	Saved          bool      `json:"saved"`
	IsCorrect      *bool     `json:"is_correct,omitempty"`
	Explanation    *string   `json:"explanation,omitempty"`
	AnsweringTips  *string   `json:"answering_tips,omitempty"`
}

// AutoSubmitPracticeRequest payload when an attempt is auto-submitted due to violations or session expiry.
type AutoSubmitPracticeRequest struct {
	Reason         string                        `json:"reason" validate:"omitempty"`
	ViolationCount int                           `json:"violation_count" validate:"omitempty"`
	Answers        []SubmitPracticeAnswerRequest `json:"answers" validate:"omitempty,dive"`
}

// CompletePracticeResponse returned after submitting and grading a practice attempt.
type CompletePracticeResponse struct {
	AttemptID        uuid.UUID  `json:"attempt_id"`
	Status           string     `json:"status"`
	Score            float64    `json:"score"`
	TotalQuestions   int        `json:"total_questions"`
	CorrectAnswers   int        `json:"correct_answers"`
	IncorrectAnswers int        `json:"incorrect_answers"`
	Unanswered       int        `json:"unanswered"`
	CompletedAt      time.Time  `json:"completed_at"`
	EvaluationID     *uuid.UUID `json:"evaluation_id,omitempty"`
	IsAutoSubmitted  bool       `json:"is_auto_submitted"`
	AutoSubmitReason string     `json:"auto_submit_reason,omitempty"`
}

// PracticeAnswerReviewItem pedagogical feedback on a specific question in a practice session.
type PracticeAnswerReviewItem struct {
	QuestionNumber   int                      `json:"question_number"`
	QuestionID       uuid.UUID                `json:"question_id"`
	QuestionText     string                   `json:"question_text"`
	Competencies     []CompetencyResponse     `json:"competencies"`
	Options          []OptionReviewResponse   `json:"options"`
	SelectedOptionID *uuid.UUID               `json:"selected_option_id"`
	AnswerData       string                   `json:"answer_data"`
	IsCorrect        bool                     `json:"is_correct"`
	Score            float64                  `json:"score"`
	Explanation      string                   `json:"explanation,omitempty"`
	AnsweringTips    string                   `json:"answering_tips,omitempty"`
}

// PracticeResultResponse comprehensive review and scores for a completed practice attempt.
type PracticeResultResponse struct {
	AttemptID        uuid.UUID                  `json:"attempt_id"`
	PackageID        uuid.UUID                  `json:"package_id"`
	PackageTitle     string                     `json:"package_title"`
	Status           string                     `json:"status"`
	Score            float64                    `json:"score"`
	TotalQuestions   int                        `json:"total_questions"`
	CorrectAnswers   int                        `json:"correct_answers"`
	IncorrectAnswers int                        `json:"incorrect_answers"`
	Unanswered       int                        `json:"unanswered"`
	StartedAt        time.Time                  `json:"started_at"`
	CompletedAt      *time.Time                 `json:"completed_at"`
	EvaluationID     *uuid.UUID                 `json:"evaluation_id,omitempty"`
	IsAutoSubmitted  bool                       `json:"is_auto_submitted"`
	AutoSubmitReason string                     `json:"auto_submit_reason,omitempty"`
	Reviews          []PracticeAnswerReviewItem `json:"reviews"`
}

// MyPracticesFilter filter for listing student's practice attempts.
type MyPracticesFilter struct {
	PackageID *uuid.UUID `query:"package_id"`
	Status    string     `query:"status"`
	Limit     int        `query:"limit"`
	Offset    int        `query:"offset"`
}

// PracticeAttemptSummaryResponse summary of a single practice attempt.
type PracticeAttemptSummaryResponse struct {
	AttemptID      uuid.UUID  `json:"attempt_id"`
	PackageID      uuid.UUID  `json:"package_id"`
	PackageTitle   string     `json:"package_title"`
	Status         string     `json:"status"`
	Score          *float64   `json:"score"`
	TotalQuestions int        `json:"total_questions"`
	CorrectAnswers int        `json:"correct_answers"`
	StartedAt      time.Time  `json:"started_at"`
	CompletedAt    *time.Time `json:"completed_at"`
}

// PaginatedPracticesResponse wraps paginated student practice attempts.
type PaginatedPracticesResponse struct {
	Practices []PracticeAttemptSummaryResponse `json:"practices"`
	Total     int64                            `json:"total"`
	Limit     int                              `json:"limit"`
	Offset    int                              `json:"offset"`
}
