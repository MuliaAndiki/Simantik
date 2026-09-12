package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

// SchoolRepository provides DB access for school master data.
type SchoolRepository interface {
	Create(ctx context.Context, s *models.School) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.School, error)
	FindByNPSN(ctx context.Context, npsn string) (*models.School, error)
	Update(ctx context.Context, s *models.School) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListSchoolFilter) ([]models.School, int64, error)
}

type schoolRepository struct {
	db *gorm.DB
}

func NewSchoolRepository(db *gorm.DB) SchoolRepository {
	return &schoolRepository{db: db}
}

func (r *schoolRepository) Create(ctx context.Context, s *models.School) error {
	return r.db.WithContext(ctx).Create(s).Error
}

func (r *schoolRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.School, error) {
	var s models.School
	if err := r.db.WithContext(ctx).First(&s, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *schoolRepository) FindByNPSN(ctx context.Context, npsn string) (*models.School, error) {
	var s models.School
	if err := r.db.WithContext(ctx).First(&s, "npsn = ?", npsn).Error; err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *schoolRepository) Update(ctx context.Context, s *models.School) error {
	return r.db.WithContext(ctx).Save(s).Error
}

func (r *schoolRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.School{}, "id = ?", id).Error
}

func (r *schoolRepository) List(ctx context.Context, filter dto.ListSchoolFilter) ([]models.School, int64, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	query := r.db.WithContext(ctx).Model(&models.School{})
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		query = query.Where("nama ILIKE ? OR npsn ILIKE ?", like, like)
	}
	if filter.Level != "" {
		query = query.Where("jenjang = ?", filter.Level)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var list []models.School
	if err := query.Order("nama ASC").Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}

	return list, total, nil
}
