package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

// RecommendationRepository defines data access for learning recommendations.
type RecommendationRepository interface {
	Create(ctx context.Context, rec *models.Recommendation) error
	BulkCreate(ctx context.Context, recs []models.Recommendation) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Recommendation, error)
	ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.ListRecommendationFilter) ([]models.Recommendation, int64, error)
	DeleteByID(ctx context.Context, id uuid.UUID) error
	DeleteByEvaluationID(ctx context.Context, evalID uuid.UUID) error
	FindByEvaluationID(ctx context.Context, evalID uuid.UUID) ([]models.Recommendation, error)
}

type recommendationRepository struct {
	db *gorm.DB
}

// NewRecommendationRepository creates a new RecommendationRepository.
func NewRecommendationRepository(db *gorm.DB) RecommendationRepository {
	return &recommendationRepository{db: db}
}

func (r *recommendationRepository) Create(ctx context.Context, rec *models.Recommendation) error {
	return r.db.WithContext(ctx).Create(rec).Error
}

func (r *recommendationRepository) BulkCreate(ctx context.Context, recs []models.Recommendation) error {
	if len(recs) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).CreateInBatches(recs, 100).Error
}

func (r *recommendationRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Recommendation, error) {
	var rec models.Recommendation
	err := r.db.WithContext(ctx).
		Preload("Competency", preloadUnscopedCompetency).
		Preload("Material").
		First(&rec, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &rec, nil
}

func (r *recommendationRepository) ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.ListRecommendationFilter) ([]models.Recommendation, int64, error) {
	var recs []models.Recommendation
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Recommendation{}).Where("user_id = ?", userID)

	if filter.Priority != "" {
		query = query.Where("priority = ?", filter.Priority)
	}
	if filter.CompetencyID != nil {
		query = query.Where("competency_id = ?", filter.CompetencyID)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	err := query.
		Preload("Competency", preloadUnscopedCompetency).
		Preload("Material").
		Order("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END ASC, created_at DESC").
		Find(&recs).Error

	return recs, total, err
}

func (r *recommendationRepository) DeleteByID(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Recommendation{}, "id = ?", id).Error
}

func (r *recommendationRepository) DeleteByEvaluationID(ctx context.Context, evalID uuid.UUID) error {
	return r.db.WithContext(ctx).Where("evaluation_id = ?", evalID).Delete(&models.Recommendation{}).Error
}

func (r *recommendationRepository) FindByEvaluationID(ctx context.Context, evalID uuid.UUID) ([]models.Recommendation, error) {
	var recs []models.Recommendation
	err := r.db.WithContext(ctx).
		Preload("Competency", preloadUnscopedCompetency).
		Preload("Material").
		Where("evaluation_id = ?", evalID).
		Find(&recs).Error
	return recs, err
}
