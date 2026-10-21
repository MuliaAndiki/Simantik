package dto

import (
	"time"

	"github.com/google/uuid"
)

// CompetencyEvaluationResponse gives granular score and mastery level for a specific competency.
type CompetencyEvaluationResponse struct {
	ID             uuid.UUID `json:"id"`
	CompetencyID   uuid.UUID `json:"competency_id"`
	CompetencyName string    `json:"competency_name"`
	CompetencyCode string    `json:"competency_code"`
	TotalQuestions int       `json:"total_questions"`
	CorrectAnswers int       `json:"correct_answers"`
	Score          float64   `json:"score"`
	Accuracy       float64   `json:"accuracy"`
	Level          string    `json:"level"` // low, medium, high
}

// EvaluationResponse provides the assessment outcome, scores, accuracy, and competency breakdowns.
type EvaluationResponse struct {
	ID                    uuid.UUID                      `json:"id"`
	UserID                uuid.UUID                      `json:"user_id"`
	SourceType            string                         `json:"source_type"` // tryout, practice
	SourceID              uuid.UUID                      `json:"source_id"`
	TotalQuestions        int                            `json:"total_questions"`
	CorrectAnswers        int                            `json:"correct_answers"`
	IncorrectAnswers      int                            `json:"incorrect_answers"`
	Unanswered            int                            `json:"unanswered"`
	Score                 float64                        `json:"score"`
	Accuracy              float64                        `json:"accuracy"`
	CreatedAt             time.Time                      `json:"created_at"`
	CompetencyEvaluations []CompetencyEvaluationResponse `json:"competency_evaluations"`
}

// OptionReviewResponse represents an option in a completed assessment review.
type OptionReviewResponse struct {
	ID           uuid.UUID `json:"id"`
	OptionLabel  string    `json:"option_label"`
	OptionText   string    `json:"option_text"`
	IsCorrect    bool      `json:"is_correct"`
	IsSelected   bool      `json:"is_selected"`
	DisplayOrder int       `json:"display_order"`
}

// QuestionReviewResponse represents question-by-question review data with explanations and answer keys.
type QuestionReviewResponse struct {
	QuestionNumber      int                    `json:"question_number"`
	QuestionID          uuid.UUID              `json:"question_id"`
	QuestionText        string                 `json:"question_text"`
	DifficultyLevel     int                    `json:"difficulty_level"`
	Competencies        []CompetencyResponse   `json:"competencies"`
	Options             []OptionReviewResponse `json:"options"`
	SelectedOptionID    *uuid.UUID             `json:"selected_option_id"`
	AnswerData          string                 `json:"answer_data"`
	IsCorrect           bool                   `json:"is_correct"`
	Score               float64                `json:"score"`
	ResponseTimeSeconds int                    `json:"response_time_seconds"`
	Explanation         string                 `json:"explanation,omitempty"`
	AnsweringTips       string                 `json:"answering_tips,omitempty"`
	Stimulus            *StimulusRefResponse   `json:"stimulus,omitempty"`
}

// AttemptReviewResponse exposes pedagogical feedback, scoring breakdown, and full explanations.
// Only accessible AFTER an attempt is completed.
type AttemptReviewResponse struct {
	AttemptID           uuid.UUID                      `json:"attempt_id"`
	TryoutID            uuid.UUID                      `json:"tryout_id"`
	TryoutTitle         string                         `json:"tryout_title"`
	Score               float64                        `json:"score"`
	Accuracy            float64                        `json:"accuracy"`
	TotalQuestions      int                            `json:"total_questions"`
	CorrectAnswers      int                            `json:"correct_answers"`
	IncorrectAnswers    int                            `json:"incorrect_answers"`
	Unanswered          int                            `json:"unanswered"`
	TimeTakenSeconds    int                            `json:"time_taken_seconds"`
	StartedAt           time.Time                      `json:"started_at"`
	SubmittedAt         *time.Time                     `json:"submitted_at"`
	EvaluationID        *uuid.UUID                     `json:"evaluation_id,omitempty"`
	CompetencyBreakdown []CompetencyEvaluationResponse `json:"competency_breakdown"`
	Questions           []QuestionReviewResponse       `json:"questions"`
	StudentName         string                         `json:"student_name,omitempty"`
	StudentEmail        string                         `json:"student_email,omitempty"`
	StudentNIS          string                         `json:"student_nis,omitempty"`
	StudentSchool       string                         `json:"student_school,omitempty"`
	StudentGrade        string                         `json:"student_grade,omitempty"`
}

// CompetencyMasteryItem aggregates student performance across all assessments for a competency.
type CompetencyMasteryItem struct {
	CompetencyID   uuid.UUID `json:"competency_id"`
	Code           string    `json:"code"`
	Name           string    `json:"name"`
	TotalQuestions int       `json:"total_questions"`
	TotalCorrect   int       `json:"total_correct"`
	AverageScore   float64   `json:"average_score"`
	Accuracy       float64   `json:"accuracy"`
	Level          string    `json:"level"`          // low, medium, high
	Classification string    `json:"classification"` // strength, weakness, developing
}

// StudentCompetencyProfileResponse outlines the student's mastery profile, identifying strengths and weaknesses.
type StudentCompetencyProfileResponse struct {
	UserID              uuid.UUID               `json:"user_id"`
	TotalEvaluations    int                     `json:"total_evaluations"`
	OverallAverageScore float64                 `json:"overall_average_score"`
	OverallAccuracy     float64                 `json:"overall_accuracy"`
	Competencies        []CompetencyMasteryItem `json:"competencies"`
	Strengths           []string                `json:"strengths"`  // High-performing competency names
	Weaknesses          []string                `json:"weaknesses"` // Low-performing competency names needing reinforcement
}

// ListEvaluationFilter holds query parameters for filtering evaluations.
type ListEvaluationFilter struct {
	SourceType string `query:"source_type"`
	Limit      int    `query:"limit"`
	Offset     int    `query:"offset"`
}

// PaginatedEvaluationsResponse wraps paginated evaluation results.
type PaginatedEvaluationsResponse struct {
	Evaluations []EvaluationResponse `json:"evaluations"`
	Total       int64                `json:"total"`
	Limit       int                  `json:"limit"`
	Offset      int                  `json:"offset"`
}
