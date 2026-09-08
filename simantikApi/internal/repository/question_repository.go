package repository

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type QuestionRepository interface {
	Create(ctx context.Context, q *models.Question) error
	FindByID(ctx context.Context, id uuid.UUID) (*models.Question, error)
	Update(ctx context.Context, q *models.Question) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filter dto.ListQuestionFilter) ([]models.Question, int64, error)
	FindByIDWithAnswers(ctx context.Context, id uuid.UUID) (*models.Question, error)
	CountByFilter(ctx context.Context, filter dto.ListQuestionFilter) (int64, error)
	ReplaceCompetencies(ctx context.Context, tx *gorm.DB, questionID uuid.UUID, competencyIDs []uuid.UUID) error
}

type questionRepository struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) QuestionRepository {
	return &questionRepository{db: db}
}

func (r *questionRepository) Create(ctx context.Context, q *models.Question) error {
	return r.db.WithContext(ctx).Create(q).Error
}

func (r *questionRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.Question, error) {
	var q models.Question
	// Student view, avoid loading IsCorrect if possible, but GORM preload loads all fields.
	// The DTO mapping handles removing IsCorrect for students.
	err := r.db.WithContext(ctx).
		Preload("Type").
		Preload("Options", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Competencies").
		Preload("Explanation").
		First(&q, "id = ?", id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &q, nil
}

func (r *questionRepository) FindByIDWithAnswers(ctx context.Context, id uuid.UUID) (*models.Question, error) {
	return r.FindByID(ctx, id)
}

func (r *questionRepository) Update(ctx context.Context, q *models.Question) error {
	return r.db.WithContext(ctx).Save(q).Error
}

func (r *questionRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.Question{}, "id = ?", id).Error
}

func (r *questionRepository) List(ctx context.Context, filter dto.ListQuestionFilter) ([]models.Question, int64, error) {
	var questions []models.Question
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Question{})

	if filter.Search != "" {
		searchTerm := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where("LOWER(question_text) LIKE ?", searchTerm)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.QuestionTypeID != "" {
		query = query.Where("question_type_id = ?", filter.QuestionTypeID)
	}
	if filter.DifficultyLevel > 0 {
		query = query.Where("difficulty_level = ?", filter.DifficultyLevel)
	}
	if filter.CompetencyID != "" {
		query = query.Joins("JOIN question_competencies qc ON qc.question_id = questions.id").
			Where("qc.competency_id = ?", filter.CompetencyID)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	query = query.Preload("Type").
		Preload("Options", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Competencies").
		Preload("Explanation")

	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}
	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	if err := query.Order("created_at DESC").Find(&questions).Error; err != nil {
		return nil, 0, err
	}

	return questions, total, nil
}

func (r *questionRepository) CountByFilter(ctx context.Context, filter dto.ListQuestionFilter) (int64, error) {
	var total int64
	query := r.db.WithContext(ctx).Model(&models.Question{})

	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.QuestionTypeID != "" {
		query = query.Where("question_type_id = ?", filter.QuestionTypeID)
	}
	if filter.DifficultyLevel > 0 {
		query = query.Where("difficulty_level = ?", filter.DifficultyLevel)
	}
	if filter.CompetencyID != "" {
		query = query.Joins("JOIN question_competencies qc ON qc.question_id = questions.id").
			Where("qc.competency_id = ?", filter.CompetencyID)
	}

	if err := query.Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

func (r *questionRepository) ReplaceCompetencies(ctx context.Context, tx *gorm.DB, questionID uuid.UUID, competencyIDs []uuid.UUID) error {
	if err := tx.WithContext(ctx).Where("question_id = ?", questionID).Delete(&models.QuestionCompetency{}).Error; err != nil {
		return err
	}

	for _, cid := range competencyIDs {
		qc := models.QuestionCompetency{
			QuestionID:   questionID,
			CompetencyID: cid,
		}
		if err := tx.WithContext(ctx).Create(&qc).Error; err != nil {
			return err
		}
	}
	return nil
}
