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
	IsCompleted     *bool      `json:"is_completed,omitempty"`
	LatestScore     *float64   `json:"latest_score,omitempty"`
	LatestAttemptID *uuid.UUID `json:"latest_attempt_id,omitempty"`
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

// SubmitPracticeRequest payload for final submission of a practice attempt with bulk answers.
type SubmitPracticeRequest struct {
	Answers        []SubmitPracticeAnswerRequest `json:"answers" validate:"omitempty,dive"`
	Reason         string                        `json:"reason" validate:"omitempty"`
	ViolationCount int                           `json:"violation_count" validate:"omitempty"`
}

// AutoSubmitPracticeRequest payload when an attempt is auto-submitted due to violations or session expiry.
type AutoSubmitPracticeRequest = SubmitPracticeRequest

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
	Stimulus         *StimulusRefResponse     `json:"stimulus,omitempty"`
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
	StudentName      string                     `json:"student_name,omitempty"`
	StudentEmail     string                     `json:"student_email,omitempty"`
	StudentNIS       string                     `json:"student_nis,omitempty"`
	StudentSchool    string                     `json:"student_school,omitempty"`
	StudentGrade     string                     `json:"student_grade,omitempty"`
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

// ─── Practice Results & Inspection DTOs (Admin / Content Manager) ────────────

// PracticeStudentResultItem represents student performance row in a practice package.
type PracticeStudentResultItem struct {
	UserID               uuid.UUID               `json:"user_id"`
	NIS                  string                  `json:"nis"`
	StudentName          string                  `json:"student_name"`
	StudentEmail         string                  `json:"student_email"`
	School               string                  `json:"school"`
	Grade                string                  `json:"grade"`
	Score                float64                 `json:"score"`
	CorrectAnswers       int                     `json:"correct_answers"`
	TotalQuestions       int                     `json:"total_questions"`
	IncorrectAnswers     int                     `json:"incorrect_answers"`
	DurationMinutes      int                     `json:"duration_minutes"`
	FormattedDuration    string                  `json:"formatted_duration"`
	Status               string                  `json:"status"` // "completed", "in_progress", "not_started"
	CompletedAt          *time.Time              `json:"completed_at,omitempty"`
	FormattedCompletedAt string                  `json:"formatted_completed_at"`
	AttemptID            *uuid.UUID              `json:"attempt_id,omitempty"`
	DeviceBrowser        string                  `json:"device_browser"`
	Logs                 []MaterialAccessLogItem `json:"logs"`
}

// PracticePackageResultsResponse represents package analytics and student attempt list.
type PracticePackageResultsResponse struct {
	PackageID               uuid.UUID                   `json:"package_id"`
	PackageTitle            string                      `json:"package_title"`
	Description             string                      `json:"description"`
	CompetencyName          string                      `json:"competency_name"`
	CompetencyCode          string                      `json:"competency_code"`
	Jenjang                 string                      `json:"jenjang"`
	TotalQuestions          int                         `json:"total_questions"`
	Status                  string                      `json:"status"`
	CreatedAt               time.Time                   `json:"created_at"`
	UpdatedAt               time.Time                   `json:"updated_at"`
	FormattedCreatedAt      string                      `json:"formatted_created_at"`
	FormattedUpdatedAt      string                      `json:"formatted_updated_at"`
	TotalStudentsCompleted  int                         `json:"total_students_completed"`
	AverageScore            float64                     `json:"average_score"`
	HighestScore            float64                     `json:"highest_score"`
	HighestScoreStudentName string                      `json:"highest_score_student_name"`
	LowestScore             float64                     `json:"lowest_score"`
	LowestScoreStudentName  string                      `json:"lowest_score_student_name"`
	Students                []PracticeStudentResultItem `json:"students"`
	Total                   int64                       `json:"total"`
	Limit                   int                         `json:"limit"`
	Offset                  int                         `json:"offset"`
}

// ListPracticeResultFilter filter query params for practice results.
type ListPracticeResultFilter struct {
	Search string `query:"search"`
	Status string `query:"status"` // "all", "completed", "in_progress", "not_started"
	Sort   string `query:"sort"`   // "highest_score", "lowest_score", "newest", "name_asc"
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}

