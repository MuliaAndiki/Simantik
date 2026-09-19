package dto

import (
	"time"

	"github.com/google/uuid"
)

// ─── Module DTOs ─────────────────────────────────────────────────────────────

type CreateLearningModuleRequest struct {
	Title        string `json:"title" validate:"required,min=3,max=200"`
	Description  string `json:"description"`
	Label        string `json:"label"`
	Jenjang      string `json:"jenjang" validate:"required,oneof=sd smp sma smk"`
	DisplayOrder int    `json:"display_order"`
}

type UpdateLearningModuleRequest struct {
	Title        string `json:"title" validate:"omitempty,min=3,max=200"`
	Description  string `json:"description"`
	Label        string `json:"label"`
	Jenjang      string `json:"jenjang" validate:"omitempty,oneof=sd smp sma smk"`
	DisplayOrder int    `json:"display_order"`
	Status       string `json:"status" validate:"omitempty,oneof=draft published archived"`
}

type LearningModuleResponse struct {
	ID                 uuid.UUID `json:"id"`
	Title              string    `json:"title"`
	Description        string    `json:"description"`
	Label              string    `json:"label"`
	Jenjang            string    `json:"jenjang"`
	DisplayOrder       int       `json:"display_order"`
	Status             string    `json:"status"`
	MaterialsCount     int       `json:"materials_count"`
	CompletedCount     int       `json:"completed_count"`
	ProgressPercentage float64   `json:"progress_percentage"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type MaterialSummaryResponse struct {
	ID           uuid.UUID  `json:"id"`
	Title        string     `json:"title"`
	Type         string     `json:"type"` // text, document, video
	DisplayOrder int        `json:"display_order"`
	CompetencyID *uuid.UUID `json:"competency_id,omitempty"`
	Status       string     `json:"status"`
	IsCompleted  bool       `json:"is_completed"`
}

type LearningModuleDetailResponse struct {
	LearningModuleResponse
	Materials []MaterialSummaryResponse `json:"materials"`
}

type ListModuleFilter struct {
	Search  string `query:"search"`
	Label   string `query:"label"`
	Jenjang string `query:"jenjang"`
	Status  string `query:"status"`
	Limit   int    `query:"limit"`
	Offset  int    `query:"offset"`
}

type PaginatedModulesResponse struct {
	Modules []LearningModuleResponse `json:"modules"`
	Total   int64                    `json:"total"`
	Limit   int                      `json:"limit"`
	Offset  int                      `json:"offset"`
}

// ─── Material DTOs ───────────────────────────────────────────────────────────

type CreateMaterialRequest struct {
	ModuleID     uuid.UUID  `json:"module_id" validate:"required"`
	CompetencyID *uuid.UUID `json:"competency_id"`
	Title        string     `json:"title" validate:"required,min=3,max=255"`
	Description  string     `json:"description"`
	Content      string     `json:"content" validate:"required"`
	Type         string     `json:"type" validate:"required,oneof=text document video"`
	DisplayOrder int        `json:"display_order"`
}

type UpdateMaterialRequest struct {
	CompetencyID *uuid.UUID `json:"competency_id"`
	Title        string     `json:"title" validate:"omitempty,min=3,max=255"`
	Description  string     `json:"description"`
	Content      string     `json:"content"`
	Type         string     `json:"type" validate:"omitempty,oneof=text document video"`
	DisplayOrder int        `json:"display_order"`
	Status       string     `json:"status" validate:"omitempty,oneof=draft published archived"`
}

type MaterialResponse struct {
	ID             uuid.UUID  `json:"id"`
	ModuleID       uuid.UUID  `json:"module_id"`
	CompetencyID   *uuid.UUID `json:"competency_id,omitempty"`
	CompetencyName string     `json:"competency_name,omitempty"`
	Title          string     `json:"title"`
	Description    string     `json:"description"`
	Content        string     `json:"content"`
	Type           string     `json:"type"`
	DisplayOrder   int        `json:"display_order"`
	Status         string     `json:"status"`
	IsCompleted    bool       `json:"is_completed"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

type ListMaterialFilter struct {
	ModuleID     *uuid.UUID `query:"module_id"`
	CompetencyID *uuid.UUID `query:"competency_id"`
	Status       string     `query:"status"`
	Search       string     `query:"search"`
	Limit        int        `query:"limit"`
	Offset       int        `query:"offset"`
}

type PaginatedMaterialsResponse struct {
	Materials []MaterialResponse `json:"materials"`
	Total     int64              `json:"total"`
	Limit     int                `json:"limit"`
	Offset    int                `json:"offset"`
}

// ─── Progress DTOs ───────────────────────────────────────────────────────────

type UpdateProgressRequest struct {
	IsCompleted bool `json:"is_completed"`
}

type LearningProgressResponse struct {
	MaterialID  uuid.UUID  `json:"material_id"`
	IsCompleted bool       `json:"is_completed"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

type ModuleProgressSummaryResponse struct {
	ModuleID           uuid.UUID `json:"module_id"`
	ModuleTitle        string    `json:"module_title"`
	TotalMaterials     int       `json:"total_materials"`
	CompletedMaterials int       `json:"completed_materials"`
	ProgressPercentage float64   `json:"progress_percentage"`
}
