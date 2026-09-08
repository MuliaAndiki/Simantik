package dto

import (
	"time"

	"github.com/google/uuid"
)

// GenerateRecommendationsRequest requests personalized learning recommendations.
type GenerateRecommendationsRequest struct {
	EvaluationID *uuid.UUID `json:"evaluation_id"`
}

// RecommendationResponse represents a targeted learning recommendation.
type RecommendationResponse struct {
	ID                 uuid.UUID  `json:"id"`
	CompetencyID       uuid.UUID  `json:"competency_id"`
	CompetencyName     string     `json:"competency_name"`
	CompetencyCode     string     `json:"competency_code"`
	EvaluationID       *uuid.UUID `json:"evaluation_id,omitempty"`
	MaterialID         *uuid.UUID `json:"material_id,omitempty"`
	MaterialTitle      string     `json:"material_title,omitempty"`
	RecommendationText string     `json:"recommendation_text"`
	Priority           string     `json:"priority"` // high, medium, low
	CreatedAt          time.Time  `json:"created_at"`
}

// ListRecommendationFilter filters recommendations by priority or competency.
type ListRecommendationFilter struct {
	Priority     string     `query:"priority"`
	CompetencyID *uuid.UUID `query:"competency_id"`
	Limit        int        `query:"limit"`
	Offset       int        `query:"offset"`
}

// PaginatedRecommendationsResponse provides paginated recommendation items.
type PaginatedRecommendationsResponse struct {
	Recommendations []RecommendationResponse `json:"recommendations"`
	Total           int64                    `json:"total"`
	Limit           int                      `json:"limit"`
	Offset          int                      `json:"offset"`
}
