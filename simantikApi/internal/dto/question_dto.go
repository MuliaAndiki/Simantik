package dto

import (
	"time"

	"github.com/google/uuid"

	"simantikApi/internal/models"
)

// Competency DTOs

type CreateCompetencyRequest struct {
	Code        string `json:"code" validate:"required"`
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
}

type UpdateCompetencyRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	Status      string `json:"status" validate:"required,oneof=active inactive"`
}

type CompetencyResponse struct {
	ID          string    `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ListCompetencyFilter struct {
	Search string `query:"search"`
	Status string `query:"status"`
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}

type PaginatedCompetenciesResponse struct {
	Competencies []CompetencyResponse `json:"competencies"`
	Total        int                  `json:"total"`
	Limit        int                  `json:"limit"`
	Offset       int                  `json:"offset"`
}

// QuestionType DTOs

type QuestionTypeResponse struct {
	ID          string    `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

// Question Option DTOs

type CreateQuestionOptionRequest struct {
	OptionLabel  string `json:"option_label" validate:"required"`
	OptionText   string `json:"option_text" validate:"required"`
	IsCorrect    bool   `json:"is_correct"`
	DisplayOrder int    `json:"display_order"`
}

type QuestionOptionAdminResponse struct {
	ID           string `json:"id"`
	QuestionID   string `json:"question_id"`
	OptionLabel  string `json:"option_label"`
	OptionText   string `json:"option_text"`
	IsCorrect    bool   `json:"is_correct"`
	DisplayOrder int    `json:"display_order"`
}

type QuestionOptionStudentResponse struct {
	ID           string `json:"id"`
	OptionLabel  string `json:"option_label"`
	OptionText   string `json:"option_text"`
	IsCorrect    *bool  `json:"is_correct,omitempty"`
	DisplayOrder int    `json:"display_order"`
}

// Question Explanation DTOs

type CreateQuestionExplanationRequest struct {
	Explanation   string `json:"explanation"`
	AnsweringTips string `json:"answering_tips"`
}

type QuestionExplanationResponse struct {
	ID            string `json:"id"`
	QuestionID    string `json:"question_id"`
	Explanation   string `json:"explanation"`
	AnsweringTips string `json:"answering_tips"`
}

// Question DTOs

type CreateQuestionRequest struct {
	QuestionTypeID  uuid.UUID                         `json:"question_type_id" validate:"required"`
	QuestionText    string                            `json:"question_text" validate:"required"`
	DifficultyLevel int                               `json:"difficulty_level" validate:"required,min=1,max=5"`
	Options         []CreateQuestionOptionRequest     `json:"options" validate:"required,min=2"`
	CompetencyIDs   []uuid.UUID                       `json:"competency_ids"`
	Explanation     *CreateQuestionExplanationRequest `json:"explanation"`
	// StimulusID links the new question to a shared stimulus (max 3 enforced).
	StimulusID *uuid.UUID `json:"stimulus_id,omitempty"`
}

type CreateQuestionsBulkRequest struct {
	Questions []CreateQuestionRequest `json:"questions" validate:"required,min=1,dive"`
}

type UpdateQuestionRequest struct {
	QuestionText    string      `json:"question_text" validate:"required"`
	DifficultyLevel int         `json:"difficulty_level" validate:"required,min=1,max=5"`
	Status          string      `json:"status" validate:"required,oneof=draft review published archived"`
	CompetencyIDs   []uuid.UUID `json:"competency_ids"`
}

type PublishQuestionRequest struct {
	Status string `json:"status" validate:"required,oneof=draft review published archived"`
}

type ListQuestionFilter struct {
	Search          string `query:"search"`
	Status          string `query:"status"`
	QuestionTypeID  string `query:"question_type_id"`
	CompetencyID    string `query:"competency_id"`
	DifficultyLevel int    `query:"difficulty_level"`
	Limit           int    `query:"limit"`
	Offset          int    `query:"offset"`
}

type QuestionAdminResponse struct {
	ID               string                        `json:"id"`
	QuestionTypeID   string                        `json:"question_type_id"`
	QuestionTypeCode string                        `json:"question_type_code,omitempty"`
	QuestionTypeName string                        `json:"question_type_name,omitempty"`
	QuestionText     string                        `json:"question_text"`
	DifficultyLevel  int                           `json:"difficulty_level"`
	Status           string                        `json:"status"`
	Options          []QuestionOptionAdminResponse `json:"options"`
	Competencies     []CompetencyResponse          `json:"competencies"`
	Explanation      *QuestionExplanationResponse  `json:"explanation,omitempty"`
	StimulusID       *uuid.UUID                    `json:"stimulus_id,omitempty"`
	Stimulus         *StimulusRefResponse          `json:"stimulus,omitempty"`
	CreatedAt        time.Time                     `json:"created_at"`
	UpdatedAt        time.Time                     `json:"updated_at"`
}

type QuestionStudentResponse struct {
	ID               string                          `json:"id"`
	QuestionTypeID   string                          `json:"question_type_id"`
	QuestionTypeCode string                          `json:"question_type_code,omitempty"`
	QuestionTypeName string                          `json:"question_type_name,omitempty"`
	QuestionText     string                          `json:"question_text"`
	DifficultyLevel  int                             `json:"difficulty_level"`
	Options          []QuestionOptionStudentResponse `json:"options"`
	Competencies     []CompetencyResponse            `json:"competencies"`
	// Stimulus shared reading passage (nil = standalone question).
	Stimulus    *StimulusRefResponse         `json:"stimulus,omitempty"`
	Explanation *QuestionExplanationResponse `json:"explanation,omitempty"`
}

// StimulusRefResponse is the compact stimulus embedded in question payloads.
type StimulusRefResponse struct {
	ID      uuid.UUID `json:"id"`
	Title   string    `json:"title"`
	Content string    `json:"content"`
}

// StimulusRefFromQuestion maps a preloaded Stimulus relation (nil-safe).
func StimulusRefFromQuestion(q *models.Question) *StimulusRefResponse {
	if q == nil || q.Stimulus == nil {
		return nil
	}
	return &StimulusRefResponse{
		ID:      q.Stimulus.ID,
		Title:   q.Stimulus.Title,
		Content: q.Stimulus.Content,
	}
}

type PaginatedQuestionsAdminResponse struct {
	Questions []QuestionAdminResponse `json:"questions"`
	Total     int                     `json:"total"`
	Limit     int                     `json:"limit"`
	Offset    int                     `json:"offset"`
}
