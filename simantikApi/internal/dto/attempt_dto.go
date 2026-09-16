package dto

import (
	"time"

	"github.com/google/uuid"
)

type StartAttemptResponse struct {
	AttemptID       uuid.UUID `json:"attempt_id"`
	TryoutID        uuid.UUID `json:"tryout_id"`
	TotalQuestions  int       `json:"total_questions"`
	DurationSeconds int       `json:"duration_seconds"`
	StartedAt       time.Time `json:"started_at"`
	Status          string    `json:"status"`
}

type AttemptQuestionResponse struct {
	QuestionNumber int                     `json:"question_number"`
	TotalQuestions int                     `json:"total_questions"`
	Question       QuestionStudentResponse `json:"question"`
}

type SubmitAnswerRequest struct {
	QuestionID          uuid.UUID  `json:"question_id" validate:"required"`
	SelectedOptionID    *uuid.UUID `json:"selected_option_id"`
	AnswerData          string     `json:"answer_data"`
	ResponseTimeSeconds int        `json:"response_time_seconds"`
}

type SubmitAnswerResponse struct {
	QuestionID       uuid.UUID `json:"question_id"`
	Submitted        bool      `json:"submitted"`
	RemainingSeconds int       `json:"remaining_seconds"`
}

type AutoSubmitAttemptRequest struct {
	Reason         string                `json:"reason" validate:"omitempty"`
	ViolationCount int                   `json:"violation_count" validate:"omitempty"`
	Answers        []SubmitAnswerRequest `json:"answers" validate:"omitempty,dive"`
}

type CompleteAttemptResponse struct {
	AttemptID        uuid.UUID `json:"attempt_id"`
	Status           string    `json:"status"`
	Score            float64   `json:"score"`
	TotalQuestions   int       `json:"total_questions"`
	CorrectAnswers   int       `json:"correct_answers"`
	Accuracy         float64   `json:"accuracy"`
	TimeTakenSeconds int       `json:"time_taken_seconds"`
	EvaluationID     uuid.UUID `json:"evaluation_id"`
	IsAutoSubmitted  bool      `json:"is_auto_submitted"`
	AutoSubmitReason string    `json:"auto_submit_reason,omitempty"`
}

type AttemptStatusResponse struct {
	AttemptID             uuid.UUID `json:"attempt_id"`
	Status                string    `json:"status"`
	CurrentQuestionNumber int       `json:"current_question_number"`
	TotalQuestions        int       `json:"total_questions"`
	DurationSeconds       int       `json:"duration_seconds"`
	StartedAt             time.Time `json:"started_at"`
	RemainingSeconds      int       `json:"remaining_seconds"`
	AnsweredCount         int       `json:"answered_count"`
}

type MyAttemptsFilter struct {
	TryoutID *uuid.UUID `query:"tryout_id"`
	Status   string     `query:"status"`
	Limit    int        `query:"limit"`
	Offset   int        `query:"offset"`
}

type PaginatedAttemptsResponse struct {
	Attempts []AttemptStatusResponse `json:"attempts"`
	Total    int64                   `json:"total"`
	Limit    int                     `json:"limit"`
	Offset   int                     `json:"offset"`
}

// OptionResponse is a student-safe question option (no IsCorrect).
type OptionResponse struct {
	ID           uuid.UUID `json:"id"`
	OptionLabel  string    `json:"option_label"`
	OptionText   string    `json:"option_text"`
	DisplayOrder int       `json:"display_order"`
}
