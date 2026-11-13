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
	ModuleID           uuid.UUID  `json:"module_id" validate:"required"`
	CompetencyID       *uuid.UUID `json:"competency_id"`
	Title              string     `json:"title" validate:"required,min=3,max=255"`
	Description        string     `json:"description"`
	Content            string     `json:"content" validate:"required"`
	LearningObjectives string     `json:"learning_objectives"`
	StructureItems     string     `json:"structure_items"`
	Type               string     `json:"type" validate:"required,oneof=text document video"`
	DisplayOrder       int        `json:"display_order"`
}

type UpdateMaterialRequest struct {
	CompetencyID       *uuid.UUID `json:"competency_id"`
	ClearCompetency    bool       `json:"clear_competency"`
	Title              string     `json:"title" validate:"omitempty,min=3,max=255"`
	Description        string     `json:"description"`
	Content            string     `json:"content"`
	LearningObjectives *string    `json:"learning_objectives"`
	StructureItems     *string    `json:"structure_items"`
	Type               string     `json:"type" validate:"omitempty,oneof=text document video"`
	DisplayOrder       int        `json:"display_order"`
	Status             string     `json:"status" validate:"omitempty,oneof=draft published archived review in_review"`
}

type MaterialResponse struct {
	ID                 uuid.UUID  `json:"id"`
	ModuleID           uuid.UUID  `json:"module_id"`
	CompetencyID       *uuid.UUID `json:"competency_id,omitempty"`
	CompetencyName     string     `json:"competency_name,omitempty"`
	Title              string     `json:"title"`
	Description        string     `json:"description"`
	Content            string     `json:"content"`
	LearningObjectives string     `json:"learning_objectives"`
	StructureItems     string     `json:"structure_items"`
	Type               string     `json:"type"`
	DisplayOrder       int        `json:"display_order"`
	Status             string     `json:"status"`
	IsCompleted        bool       `json:"is_completed"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

type ListMaterialFilter struct {
	ModuleID      *uuid.UUID `query:"module_id"`
	CompetencyID  *uuid.UUID `query:"competency_id"`
	Uncategorized bool       `query:"uncategorized"`
	Status        string     `query:"status"`
	Search        string     `query:"search"`
	Limit         int        `query:"limit"`
	Offset        int        `query:"offset"`
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

// ─── Material Student Activity DTOs ──────────────────────────────────────────

type MaterialAccessLogItem struct {
	SessionNumber int       `json:"session_number"`
	Title         string    `json:"title"`
	Timestamp     time.Time `json:"timestamp"`
	FormattedTime string    `json:"formatted_time"`
}

type MaterialStudentActivityItem struct {
	UserID                uuid.UUID               `json:"user_id"`
	NIS                   string                  `json:"nis"`
	StudentName           string                  `json:"student_name"`
	StudentEmail          string                  `json:"student_email"`
	School                string                  `json:"school"`
	Grade                 string                  `json:"grade"`
	IsAccessed            bool                    `json:"is_accessed"`
	LastAccessedAt        *time.Time              `json:"last_accessed_at,omitempty"`
	FormattedLastAccessed string                  `json:"formatted_last_accessed"`
	AccessCount           int                     `json:"access_count"`
	DeviceBrowser         string                  `json:"device_browser"`
	Logs                  []MaterialAccessLogItem `json:"logs"`
}

type MaterialStudentActivitiesResponse struct {
	MaterialID         uuid.UUID                     `json:"material_id"`
	MaterialTitle      string                        `json:"material_title"`
	ModuleID           uuid.UUID                     `json:"module_id"`
	ModuleName         string                        `json:"module_name"`
	CompetencyName     string                        `json:"competency_name"`
	Status             string                        `json:"status"`
	TotalStudents      int64                         `json:"total_students"`
	AccessedStudents   int64                         `json:"accessed_students"`
	UnaccessedStudents int64                         `json:"unaccessed_students"`
	ParticipationRate  float64                       `json:"participation_rate"`
	LastUpdatedAt      string                        `json:"last_updated_at"`
	Students           []MaterialStudentActivityItem `json:"students"`
	Total              int64                         `json:"total"`
	Limit              int                           `json:"limit"`
	Offset             int                           `json:"offset"`
}

type ListMaterialActivityFilter struct {
	Search string `query:"search"`
	Status string `query:"status"` // "all", "accessed", "unaccessed"
	Sort   string `query:"sort"`   // "newest", "oldest", "name_asc", "name_desc"
	Limit  int    `query:"limit"`
	Offset int    `query:"offset"`
}
