package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type StimulusRepository interface {
	Create(ctx context.Context, s *models.Stimulus) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Stimulus, error)
	Update(ctx context.Context, s *models.Stimulus) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListStimulusFilter) ([]models.Stimulus, int64, error)
	// FindLinkedQuestions returns id + difficulty of questions using a stimulus.
	FindLinkedQuestions(ctx context.Context, stimulusID uuid.UUID) ([]models.Question, error)
	// FindPackagesUsingStimulus lists packages (either kind) whose questions
	// use the stimulus. Basis for per-package scoping.
	FindPackagesUsingStimulus(ctx context.Context, stimulusID uuid.UUID) ([]StimulusPackageRef, error)
}

// StimulusPackageRef identifies one package using a stimulus.
type StimulusPackageRef struct {
	Kind      string    `gorm:"column:kind"`
	PackageID uuid.UUID `gorm:"column:package_id"`
}

type stimulusRepository struct {
	db *gorm.DB
}

func NewStimulusRepository(db *gorm.DB) StimulusRepository {
	return &stimulusRepository{db: db}
}

func (r *stimulusRepository) Create(ctx context.Context, s *models.Stimulus) error {
	return r.db.WithContext(ctx).Create(s).Error
}

func (r *stimulusRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Stimulus, error) {
	var s models.Stimulus
	err := r.db.WithContext(ctx).First(&s, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *stimulusRepository) Update(ctx context.Context, s *models.Stimulus) error {
	return r.db.WithContext(ctx).Save(s).Error
}

func (r *stimulusRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.Question{}).Where("stimulus_id = ?", id).Update("stimulus_id", nil).Error; err != nil {
			return err
		}
		return tx.Delete(&models.Stimulus{}, "id = ?", id).Error
	})
}

func (r *stimulusRepository) List(ctx context.Context, filter dto.ListStimulusFilter) ([]models.Stimulus, int64, error) {
	var items []models.Stimulus
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Stimulus{})
	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR content ILIKE ?", like, like)
	}

	if filter.PackageID != nil && filter.PackageKind != "" {
		query = query.Where(`(package_id = ? AND package_kind = ?) OR (package_id IS NULL AND id NOT IN (
			SELECT q.stimulus_id FROM questions q
			JOIN tryout_questions tq ON tq.question_id = q.id
			WHERE q.stimulus_id IS NOT NULL AND (tq.tryout_id != ? OR ? != 'tryout')
			UNION
			SELECT q.stimulus_id FROM questions q
			JOIN practice_package_questions pq ON pq.question_id = q.id
			WHERE q.stimulus_id IS NOT NULL AND (pq.package_id != ? OR ? != 'practice')
		))`, *filter.PackageID, filter.PackageKind, *filter.PackageID, filter.PackageKind, *filter.PackageID, filter.PackageKind)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	} else if limit > 100 {
		limit = 100
	}
	query = query.Limit(limit)
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	err := query.Order("updated_at DESC").Find(&items).Error
	return items, total, err
}

func (r *stimulusRepository) FindPackagesUsingStimulus(ctx context.Context, stimulusID uuid.UUID) ([]StimulusPackageRef, error) {
	var refs []StimulusPackageRef
	err := r.db.WithContext(ctx).Raw(`
		SELECT package_kind AS kind, package_id
		FROM stimuli
		WHERE id = ? AND package_id IS NOT NULL AND package_kind IS NOT NULL
		UNION
		SELECT 'tryout' AS kind, tq.tryout_id AS package_id
		FROM tryout_questions tq
		JOIN questions q ON q.id = tq.question_id
		WHERE q.stimulus_id = ?
		UNION
		SELECT 'practice' AS kind, pq.package_id AS package_id
		FROM practice_package_questions pq
		JOIN questions q ON q.id = pq.question_id
		WHERE q.stimulus_id = ?`,
		stimulusID, stimulusID, stimulusID,
	).Scan(&refs).Error
	return refs, err
}

func (r *stimulusRepository) FindLinkedQuestions(ctx context.Context, stimulusID uuid.UUID) ([]models.Question, error) {
	var questions []models.Question
	err := r.db.WithContext(ctx).
		Select("id", "difficulty_level").
		Where("stimulus_id = ?", stimulusID).
		Order("created_at ASC").
		Find(&questions).Error
	return questions, err
}
