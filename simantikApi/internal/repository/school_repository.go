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
	CountSummary(ctx context.Context) (*dto.SchoolVerificationSummary, error)
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
	if filter.VerificationStatus != "" && filter.VerificationStatus != "all" {
		query = query.Where("verification_status = ?", filter.VerificationStatus)
	}
	if filter.SubmittedByUserID != nil {
		query = query.Where("submitted_by_user_id = ?", *filter.SubmittedByUserID)
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

func (r *schoolRepository) CountSummary(ctx context.Context) (*dto.SchoolVerificationSummary, error) {
	var summary dto.SchoolVerificationSummary
	err := r.db.WithContext(ctx).Model(&models.School{}).
		Select(`
			COUNT(*) AS total,
			COUNT(*) FILTER (WHERE verification_status = 'verified') AS verified,
			COUNT(*) FILTER (WHERE verification_status = 'pending') AS pending,
			COUNT(*) FILTER (WHERE verification_status = 'rejected') AS rejected,
			COUNT(*) FILTER (WHERE status = 'negeri') AS negeri,
			COUNT(*) FILTER (WHERE status = 'swasta') AS swasta,
			COUNT(*) FILTER (WHERE jenjang = 'sma') AS sma_count,
			COUNT(*) FILTER (WHERE jenjang = 'smk') AS smk_count
		`).
		Scan(&summary).Error
	if err != nil {
		return nil, err
	}
	return &summary, nil
}
