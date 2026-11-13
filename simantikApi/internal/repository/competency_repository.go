package repository

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type CompetencyRepository interface {
	Create(ctx context.Context, competency *models.Competency) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Competency, error)
	FindByCode(ctx context.Context, code string) (*models.Competency, error)
	Update(ctx context.Context, competency *models.Competency) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListCompetencyFilter) ([]models.Competency, int64, error)
}

type competencyRepository struct {
	db *gorm.DB
}

func NewCompetencyRepository(db *gorm.DB) CompetencyRepository {
	return &competencyRepository{db: db}
}

func (r *competencyRepository) Create(ctx context.Context, competency *models.Competency) error {
	return r.db.WithContext(ctx).Create(competency).Error
}

func (r *competencyRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Competency, error) {
	var competency models.Competency
	if err := r.db.WithContext(ctx).First(&competency, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &competency, nil
}

func (r *competencyRepository) FindByCode(ctx context.Context, code string) (*models.Competency, error) {
	var competency models.Competency
	if err := r.db.WithContext(ctx).First(&competency, "code = ?", code).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &competency, nil
}

func (r *competencyRepository) Update(ctx context.Context, competency *models.Competency) error {
	return r.db.WithContext(ctx).Save(competency).Error
}

// Delete soft-deletes a competency while safely detaching active content references
// so modules, materials, practice packages, questions, and tryouts remain intact with null/empty competency.
func (r *competencyRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Unscoped().
			Model(&models.Material{}).
			Where("competency_id = ?", id).
			Update("competency_id", nil).Error; err != nil {
			return err
		}

		if err := tx.Unscoped().
			Model(&models.PracticePackage{}).
			Where("competency_id = ?", id).
			Update("competency_id", nil).Error; err != nil {
			return err
		}

		if err := tx.Model(&models.Practice{}).
			Where("competency_id = ?", id).
			Update("competency_id", nil).Error; err != nil {
			return err
		}

		if err := tx.Where("competency_id = ?", id).
			Delete(&models.QuestionCompetency{}).Error; err != nil {
			return err
		}

		return tx.Delete(&models.Competency{}, "id = ?", id).Error
	})
}

func (r *competencyRepository) List(ctx context.Context, filter dto.ListCompetencyFilter) ([]models.Competency, int64, error) {
	var competencies []models.Competency
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Competency{})

	if filter.Search != "" {
		searchTerm := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(code) LIKE ?", searchTerm, searchTerm)
	}

	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
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

	if err := query.Order("created_at DESC").Find(&competencies).Error; err != nil {
		return nil, 0, err
	}

	return competencies, total, nil
}
