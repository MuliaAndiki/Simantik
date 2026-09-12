package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/models"
)

// StudentProfileRepository provides DB access for student academic profiles.
type StudentProfileRepository interface {
	Create(ctx context.Context, p *models.StudentProfile) error
	FindByUserID(ctx context.Context, userID uuid.UUID) (*models.StudentProfile, error)
	Update(ctx context.Context, p *models.StudentProfile) error
}

type studentProfileRepository struct {
	db *gorm.DB
}

func NewStudentProfileRepository(db *gorm.DB) StudentProfileRepository {
	return &studentProfileRepository{db: db}
}

func (r *studentProfileRepository) Create(ctx context.Context, p *models.StudentProfile) error {
	return r.db.WithContext(ctx).Create(p).Error
}

func (r *studentProfileRepository) FindByUserID(ctx context.Context, userID uuid.UUID) (*models.StudentProfile, error) {
	var p models.StudentProfile
	if err := r.db.WithContext(ctx).First(&p, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *studentProfileRepository) Update(ctx context.Context, p *models.StudentProfile) error {
	return r.db.WithContext(ctx).Save(p).Error
}
