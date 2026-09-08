package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

// ─── News Repository ─────────────────────────────────────────────────────────

type NewsRepository interface {
	Create(ctx context.Context, n *models.News) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.News, error)
	FindBySlug(ctx context.Context, slug string) (*models.News, error)
	Update(ctx context.Context, n *models.News) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListNewsFilter) ([]models.News, int64, error)
	ListPublished(ctx context.Context, filter dto.ListNewsFilter) ([]models.News, int64, error)
}

type newsRepository struct {
	db *gorm.DB
}

func NewNewsRepository(db *gorm.DB) NewsRepository {
	return &newsRepository{db: db}
}

func (r *newsRepository) Create(ctx context.Context, n *models.News) error {
	return r.db.WithContext(ctx).Create(n).Error
}

func (r *newsRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.News, error) {
	var n models.News
	if err := r.db.WithContext(ctx).First(&n, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

func (r *newsRepository) FindBySlug(ctx context.Context, slug string) (*models.News, error) {
	var n models.News
	if err := r.db.WithContext(ctx).First(&n, "slug = ?", slug).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

func (r *newsRepository) Update(ctx context.Context, n *models.News) error {
	return r.db.WithContext(ctx).Save(n).Error
}

func (r *newsRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.News{}, "id = ?", id).Error
}

func (r *newsRepository) List(ctx context.Context, filter dto.ListNewsFilter) ([]models.News, int64, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	query := r.db.WithContext(ctx).Model(&models.News{})
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR content ILIKE ?", like, like)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var list []models.News
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}

	return list, total, nil
}

func (r *newsRepository) ListPublished(ctx context.Context, filter dto.ListNewsFilter) ([]models.News, int64, error) {
	filter.Status = string(models.ContentStatusPublished)
	return r.List(ctx, filter)
}

// ─── Documentation Repository ────────────────────────────────────────────────

type DocumentationRepository interface {
	Create(ctx context.Context, d *models.Documentation) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Documentation, error)
	FindBySlug(ctx context.Context, slug string) (*models.Documentation, error)
	Update(ctx context.Context, d *models.Documentation) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListDocumentationFilter) ([]models.Documentation, int64, error)
	ListPublished(ctx context.Context, filter dto.ListDocumentationFilter) ([]models.Documentation, int64, error)
}

type documentationRepository struct {
	db *gorm.DB
}

func NewDocumentationRepository(db *gorm.DB) DocumentationRepository {
	return &documentationRepository{db: db}
}

func (r *documentationRepository) Create(ctx context.Context, d *models.Documentation) error {
	return r.db.WithContext(ctx).Create(d).Error
}

func (r *documentationRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Documentation, error) {
	var d models.Documentation
	if err := r.db.WithContext(ctx).First(&d, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &d, nil
}

func (r *documentationRepository) FindBySlug(ctx context.Context, slug string) (*models.Documentation, error) {
	var d models.Documentation
	if err := r.db.WithContext(ctx).First(&d, "slug = ?", slug).Error; err != nil {
		return nil, err
	}
	return &d, nil
}

func (r *documentationRepository) Update(ctx context.Context, d *models.Documentation) error {
	return r.db.WithContext(ctx).Save(d).Error
}

func (r *documentationRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Documentation{}, "id = ?", id).Error
}

func (r *documentationRepository) List(ctx context.Context, filter dto.ListDocumentationFilter) ([]models.Documentation, int64, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	query := r.db.WithContext(ctx).Model(&models.Documentation{})
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR content ILIKE ?", like, like)
	}
	if filter.Category != "" {
		query = query.Where("category = ?", filter.Category)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var list []models.Documentation
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}

	return list, total, nil
}

func (r *documentationRepository) ListPublished(ctx context.Context, filter dto.ListDocumentationFilter) ([]models.Documentation, int64, error) {
	filter.Status = string(models.ContentStatusPublished)
	return r.List(ctx, filter)
}

// ─── Testimonial Repository ──────────────────────────────────────────────────

type TestimonialRepository interface {
	Create(ctx context.Context, t *models.Testimonial) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Testimonial, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status models.TestimonialStatus) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListTestimonialFilter) ([]models.Testimonial, int64, error)
	ListApproved(ctx context.Context, limit, offset int) ([]models.Testimonial, int64, error)
}

type testimonialRepository struct {
	db *gorm.DB
}

func NewTestimonialRepository(db *gorm.DB) TestimonialRepository {
	return &testimonialRepository{db: db}
}

func (r *testimonialRepository) Create(ctx context.Context, t *models.Testimonial) error {
	return r.db.WithContext(ctx).Create(t).Error
}

func (r *testimonialRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Testimonial, error) {
	var t models.Testimonial
	if err := r.db.WithContext(ctx).First(&t, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *testimonialRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status models.TestimonialStatus) error {
	return r.db.WithContext(ctx).Model(&models.Testimonial{}).Where("id = ?", id).Update("status", status).Error
}

func (r *testimonialRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Testimonial{}, "id = ?", id).Error
}

func (r *testimonialRepository) List(ctx context.Context, filter dto.ListTestimonialFilter) ([]models.Testimonial, int64, error) {
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	query := r.db.WithContext(ctx).Model(&models.Testimonial{})
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var list []models.Testimonial
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}

	return list, total, nil
}

func (r *testimonialRepository) ListApproved(ctx context.Context, limit, offset int) ([]models.Testimonial, int64, error) {
	return r.List(ctx, dto.ListTestimonialFilter{
		Status: string(models.TestimonialStatusApproved),
		Limit:  limit,
		Offset: offset,
	})
}
