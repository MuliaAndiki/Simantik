package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

// EvaluationRepository defines data access methods for Evaluations and CompetencyEvaluations.
type EvaluationRepository interface {
	Create(ctx context.Context, eval *models.Evaluation) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Evaluation, error)
	FindBySource(ctx context.Context, sourceType models.EvaluationSourceType, sourceID uuid.UUID) (*models.Evaluation, error)
	ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.ListEvaluationFilter) ([]models.Evaluation, int64, error)
	GetCompetencyEvaluationsByUserID(ctx context.Context, userID uuid.UUID) ([]models.CompetencyEvaluation, error)
}

type evaluationRepository struct {
	db *gorm.DB
}

// NewEvaluationRepository creates a new instance of EvaluationRepository.
func NewEvaluationRepository(db *gorm.DB) EvaluationRepository {
	return &evaluationRepository{db: db}
}

func (r *evaluationRepository) Create(ctx context.Context, eval *models.Evaluation) error {
	return r.db.WithContext(ctx).Create(eval).Error
}

func (r *evaluationRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Evaluation, error) {
	var eval models.Evaluation
	err := r.db.WithContext(ctx).
		Preload("CompetencyEvaluations.Competency").
		First(&eval, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &eval, nil
}

func (r *evaluationRepository) FindBySource(ctx context.Context, sourceType models.EvaluationSourceType, sourceID uuid.UUID) (*models.Evaluation, error) {
	var eval models.Evaluation
	err := r.db.WithContext(ctx).
		Preload("CompetencyEvaluations.Competency").
		Where("source_type = ? AND source_id = ?", sourceType, sourceID).
		Order("created_at DESC").
		First(&eval).Error
	if err != nil {
		return nil, err
	}
	return &eval, nil
}

func (r *evaluationRepository) ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.ListEvaluationFilter) ([]models.Evaluation, int64, error) {
	var evals []models.Evaluation
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Evaluation{}).Where("user_id = ?", userID)

	if filter.SourceType != "" {
		query = query.Where("source_type = ?", filter.SourceType)
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
		Preload("CompetencyEvaluations.Competency").
		Order("created_at DESC").
		Find(&evals).Error

	return evals, total, err
}

func (r *evaluationRepository) GetCompetencyEvaluationsByUserID(ctx context.Context, userID uuid.UUID) ([]models.CompetencyEvaluation, error) {
	var items []models.CompetencyEvaluation
	err := r.db.WithContext(ctx).
		Preload("Competency").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&items).Error
	return items, err
}
