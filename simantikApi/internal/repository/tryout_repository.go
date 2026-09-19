package repository

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type TryoutRepository interface {
	Create(ctx context.Context, tryout *models.Tryout) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Tryout, error)
	FindByIDWithQuestions(ctx context.Context, id uuid.UUID) (*models.Tryout, error)
	Update(ctx context.Context, tryout *models.Tryout) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListTryoutFilter) ([]models.Tryout, int64, error)
	AddQuestions(ctx context.Context, tryoutID uuid.UUID, questionIDs []uuid.UUID) error
	RemoveQuestion(ctx context.Context, tryoutID, questionID uuid.UUID) error
	CountPoolQuestions(ctx context.Context, tryoutID uuid.UUID) (int64, error)
	ListPublished(ctx context.Context, filter dto.ListTryoutFilter) ([]models.Tryout, int64, error)
	GetPoolQuestionIDs(ctx context.Context, tryoutID uuid.UUID) ([]uuid.UUID, error)
}

type tryoutRepository struct {
	db *gorm.DB
}

func NewTryoutRepository(db *gorm.DB) TryoutRepository {
	return &tryoutRepository{db: db}
}

func (r *tryoutRepository) Create(ctx context.Context, tryout *models.Tryout) error {
	return r.db.WithContext(ctx).Create(tryout).Error
}

func (r *tryoutRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Tryout, error) {
	var tryout models.Tryout
	err := r.db.WithContext(ctx).First(&tryout, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &tryout, nil
}

func (r *tryoutRepository) FindByIDWithQuestions(ctx context.Context, id uuid.UUID) (*models.Tryout, error) {
	var tryout models.Tryout
	err := r.db.WithContext(ctx).Preload("Questions").First(&tryout, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &tryout, nil
}

func (r *tryoutRepository) Update(ctx context.Context, tryout *models.Tryout) error {
	return r.db.WithContext(ctx).Save(tryout).Error
}

func (r *tryoutRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Tryout{}, "id = ?", id).Error
}

func (r *tryoutRepository) List(ctx context.Context, filter dto.ListTryoutFilter) ([]models.Tryout, int64, error) {
	var tryouts []models.Tryout
	var total int64
	query := r.db.WithContext(ctx).Model(&models.Tryout{})

	if filter.Search != "" {
		query = query.Where("title ILIKE ?", "%"+filter.Search+"%")
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Jenjang != "" {
		query = query.Where("jenjang = ?", filter.Jenjang)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	err = query.Order("created_at desc").Find(&tryouts).Error
	return tryouts, total, err
}

func (r *tryoutRepository) AddQuestions(ctx context.Context, tryoutID uuid.UUID, questionIDs []uuid.UUID) error {
	var tqs []models.TryoutQuestion
	for i, qid := range questionIDs {
		tqs = append(tqs, models.TryoutQuestion{
			TryoutID:     tryoutID,
			QuestionID:   qid,
			DisplayOrder: i + 1,
			ScoreWeight:  1.0,
		})
	}
	return r.db.WithContext(ctx).Clauses(
		clause.OnConflict{DoNothing: true},
	).CreateInBatches(tqs, 100).Error
}

func (r *tryoutRepository) RemoveQuestion(ctx context.Context, tryoutID, questionID uuid.UUID) error {
	return r.db.WithContext(ctx).Where("tryout_id = ? AND question_id = ?", tryoutID, questionID).Delete(&models.TryoutQuestion{}).Error
}

func (r *tryoutRepository) CountPoolQuestions(ctx context.Context, tryoutID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.TryoutQuestion{}).Where("tryout_id = ?", tryoutID).Count(&count).Error
	return count, err
}

func (r *tryoutRepository) ListPublished(ctx context.Context, filter dto.ListTryoutFilter) ([]models.Tryout, int64, error) {
	filter.Status = "published"
	return r.List(ctx, filter)
}

func (r *tryoutRepository) GetPoolQuestionIDs(ctx context.Context, tryoutID uuid.UUID) ([]uuid.UUID, error) {
	var ids []uuid.UUID
	err := r.db.WithContext(ctx).Model(&models.TryoutQuestion{}).
		Where("tryout_id = ?", tryoutID).
		Pluck("question_id", &ids).Error
	return ids, err
}
