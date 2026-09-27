package repository

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

// PracticeRepository defines database operations for Practice packages, attempts, and answers.
type PracticeRepository interface {
	// Package management
	CreatePackage(ctx context.Context, pkg *models.PracticePackage) error
	FindPackageByID(ctx context.Context, id uuid.UUID) (*models.PracticePackage, error)
	FindPackageByIDWithQuestions(ctx context.Context, id uuid.UUID) (*models.PracticePackage, error)
	UpdatePackage(ctx context.Context, pkg *models.PracticePackage) error
	DeletePackage(ctx context.Context, id uuid.UUID) error
	ListPackages(ctx context.Context, filter dto.ListPracticePackageFilter) ([]models.PracticePackage, int64, error)
	AddQuestionsToPackage(ctx context.Context, packageID uuid.UUID, questionIDs []uuid.UUID) error
	RemoveQuestionFromPackage(ctx context.Context, packageID, questionID uuid.UUID) error
	CountPackageQuestions(ctx context.Context, packageID uuid.UUID) (int64, error)
	GetPackageQuestionIDs(ctx context.Context, packageID uuid.UUID) ([]uuid.UUID, error)

	// Attempt & Session execution
	CreateAttempt(ctx context.Context, attempt *models.Practice) error
	FindAttemptByID(ctx context.Context, id uuid.UUID) (*models.Practice, error)
	FindAttemptByIDWithDetails(ctx context.Context, id uuid.UUID) (*models.Practice, error)
	FindActiveAttempt(ctx context.Context, userID, packageID uuid.UUID) (*models.Practice, error)
	UpdateAttempt(ctx context.Context, attempt *models.Practice) error
	ListAttemptsByUserID(ctx context.Context, userID uuid.UUID, filter dto.MyPracticesFilter) ([]models.Practice, int64, error)
	FindLatestCompletedAttempt(ctx context.Context, userID, packageID uuid.UUID) (*models.Practice, error)

	// Answers persistence
	UpsertAnswer(ctx context.Context, ans *models.PracticeAnswer) error
	FindAnswer(ctx context.Context, practiceID, questionID uuid.UUID) (*models.PracticeAnswer, error)
	FindAllAnswers(ctx context.Context, practiceID uuid.UUID) ([]models.PracticeAnswer, error)
	CountAnswers(ctx context.Context, practiceID uuid.UUID) (int64, error)
}

type practiceRepository struct {
	db *gorm.DB
}

// NewPracticeRepository constructs a PracticeRepository backed by GORM.
func NewPracticeRepository(db *gorm.DB) PracticeRepository {
	return &practiceRepository{db: db}
}

// ─── Package Management ──────────────────────────────────────────────────────

func (r *practiceRepository) CreatePackage(ctx context.Context, pkg *models.PracticePackage) error {
	return r.db.WithContext(ctx).Create(pkg).Error
}

func (r *practiceRepository) FindPackageByID(ctx context.Context, id uuid.UUID) (*models.PracticePackage, error) {
	var pkg models.PracticePackage
	err := r.db.WithContext(ctx).
		Preload("Competency").
		First(&pkg, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &pkg, nil
}

func (r *practiceRepository) FindPackageByIDWithQuestions(ctx context.Context, id uuid.UUID) (*models.PracticePackage, error) {
	var pkg models.PracticePackage
	err := r.db.WithContext(ctx).
		Preload("Competency").
		Preload("Questions").
		Preload("Questions.Options", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Questions.Competencies").
		Preload("Questions.Explanation").
		First(&pkg, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	// Reorder questions based on join table manually to prevent GORM many2many preload errors
	var orderedIDs []uuid.UUID
	r.db.WithContext(ctx).Model(&models.PracticePackageQuestion{}).Where("package_id = ?", id).Order("display_order ASC").Pluck("question_id", &orderedIDs)

	questionMap := make(map[uuid.UUID]models.Question)
	for _, q := range pkg.Questions {
		questionMap[q.ID] = q
	}
	orderedQuestions := make([]models.Question, 0, len(pkg.Questions))
	for _, qid := range orderedIDs {
		if q, ok := questionMap[qid]; ok {
			orderedQuestions = append(orderedQuestions, q)
		}
	}
	pkg.Questions = orderedQuestions

	return &pkg, nil
}

func (r *practiceRepository) UpdatePackage(ctx context.Context, pkg *models.PracticePackage) error {
	return r.db.WithContext(ctx).Save(pkg).Error
}

func (r *practiceRepository) DeletePackage(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&models.PracticePackage{}, "id = ?", id).Error
}

func (r *practiceRepository) ListPackages(ctx context.Context, filter dto.ListPracticePackageFilter) ([]models.PracticePackage, int64, error) {
	var pkgs []models.PracticePackage
	var total int64
	query := r.db.WithContext(ctx).Model(&models.PracticePackage{})

	if filter.Search != "" {
		query = query.Where("title ILIKE ? OR description ILIKE ?", "%"+filter.Search+"%", "%"+filter.Search+"%")
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Jenjang != "" {
		query = query.Where("jenjang = ?", filter.Jenjang)
	}
	if filter.CompetencyID != nil {
		query = query.Where("competency_id = ?", filter.CompetencyID)
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

	err = query.Preload("Competency").Order("created_at DESC").Find(&pkgs).Error
	return pkgs, total, err
}

func (r *practiceRepository) AddQuestionsToPackage(ctx context.Context, packageID uuid.UUID, questionIDs []uuid.UUID) error {
	var pqs []models.PracticePackageQuestion
	for i, qid := range questionIDs {
		pqs = append(pqs, models.PracticePackageQuestion{
			PackageID:    packageID,
			QuestionID:   qid,
			DisplayOrder: i + 1,
			CreatedAt:    time.Now(),
		})
	}
	return r.db.WithContext(ctx).Clauses(
		clause.OnConflict{DoNothing: true},
	).CreateInBatches(pqs, 100).Error
}

func (r *practiceRepository) RemoveQuestionFromPackage(ctx context.Context, packageID, questionID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("package_id = ? AND question_id = ?", packageID, questionID).
		Delete(&models.PracticePackageQuestion{}).Error
}

func (r *practiceRepository) CountPackageQuestions(ctx context.Context, packageID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&models.PracticePackageQuestion{}).
		Where("package_id = ?", packageID).
		Count(&count).Error
	return count, err
}

func (r *practiceRepository) GetPackageQuestionIDs(ctx context.Context, packageID uuid.UUID) ([]uuid.UUID, error) {
	var ids []uuid.UUID
	err := r.db.WithContext(ctx).
		Model(&models.PracticePackageQuestion{}).
		Where("package_id = ?", packageID).
		Order("display_order ASC").
		Pluck("question_id", &ids).Error
	return ids, err
}

// ─── Attempt & Session Execution ─────────────────────────────────────────────

func (r *practiceRepository) CreateAttempt(ctx context.Context, attempt *models.Practice) error {
	return r.db.WithContext(ctx).Create(attempt).Error
}

func (r *practiceRepository) FindAttemptByID(ctx context.Context, id uuid.UUID) (*models.Practice, error) {
	var attempt models.Practice
	err := r.db.WithContext(ctx).
		Preload("Package").
		First(&attempt, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &attempt, nil
}

func (r *practiceRepository) FindAttemptByIDWithDetails(ctx context.Context, id uuid.UUID) (*models.Practice, error) {
	var attempt models.Practice
	err := r.db.WithContext(ctx).
		Preload("Package").
		Preload("Package.Questions").
		Preload("Package.Questions.Options", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Package.Questions.Competencies").
		Preload("Package.Questions.Explanation").
		Preload("Answers").
		First(&attempt, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	if attempt.Package != nil && len(attempt.Package.Questions) > 0 {
		var orderedIDs []uuid.UUID
		r.db.WithContext(ctx).Model(&models.PracticePackageQuestion{}).Where("package_id = ?", attempt.PackageID).Order("display_order ASC").Pluck("question_id", &orderedIDs)

		questionMap := make(map[uuid.UUID]models.Question)
		for _, q := range attempt.Package.Questions {
			questionMap[q.ID] = q
		}
		orderedQuestions := make([]models.Question, 0, len(attempt.Package.Questions))
		for _, qid := range orderedIDs {
			if q, ok := questionMap[qid]; ok {
				orderedQuestions = append(orderedQuestions, q)
			}
		}
		attempt.Package.Questions = orderedQuestions
	}

	return &attempt, nil
}

func (r *practiceRepository) FindActiveAttempt(ctx context.Context, userID, packageID uuid.UUID) (*models.Practice, error) {
	var attempt models.Practice
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND package_id = ? AND status = ?", userID, packageID, models.AttemptStatusInProgress).
		First(&attempt).Error
	if err != nil {
		return nil, err
	}
	return &attempt, nil
}

func (r *practiceRepository) UpdateAttempt(ctx context.Context, attempt *models.Practice) error {
	return r.db.WithContext(ctx).Save(attempt).Error
}

func (r *practiceRepository) ListAttemptsByUserID(ctx context.Context, userID uuid.UUID, filter dto.MyPracticesFilter) ([]models.Practice, int64, error) {
	var attempts []models.Practice
	var total int64
	query := r.db.WithContext(ctx).Model(&models.Practice{}).Where("user_id = ?", userID)

	if filter.PackageID != nil {
		query = query.Where("package_id = ?", filter.PackageID)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
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

	err = query.Preload("Package").Order("started_at DESC").Find(&attempts).Error
	return attempts, total, err
}

func (r *practiceRepository) FindLatestCompletedAttempt(ctx context.Context, userID, packageID uuid.UUID) (*models.Practice, error) {
	var attempt models.Practice
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND package_id = ? AND status = ?", userID, packageID, models.AttemptStatusCompleted).
		Order("completed_at DESC").
		First(&attempt).Error
	if err != nil {
		return nil, err
	}
	return &attempt, nil
}

// ─── Answer Persistence ──────────────────────────────────────────────────────

func (r *practiceRepository) UpsertAnswer(ctx context.Context, ans *models.PracticeAnswer) error {
	var answerDataParam interface{} = nil
	if ans.AnswerData != "" {
		var js json.RawMessage
		if json.Unmarshal([]byte(ans.AnswerData), &js) == nil {
			answerDataParam = ans.AnswerData
		} else {
			if b, err := json.Marshal(ans.AnswerData); err == nil {
				answerDataParam = string(b)
			}
		}
	}

	var existing models.PracticeAnswer
	findErr := r.db.WithContext(ctx).
		Where("practice_id = ? AND question_id = ?", ans.PracticeID, ans.QuestionID).
		First(&existing).Error

	if findErr == nil {
		return r.db.WithContext(ctx).Exec(
			`UPDATE practice_answers
			 SET selected_option_id = ?, answer_data = ?, is_correct = ?, score = ?, answered_at = ?
			 WHERE practice_id = ? AND question_id = ?`,
			ans.SelectedOptionID, answerDataParam, ans.IsCorrect, ans.Score, ans.AnsweredAt,
			ans.PracticeID, ans.QuestionID,
		).Error
	}
	if !errors.Is(findErr, gorm.ErrRecordNotFound) {
		return findErr
	}

	if ans.ID == uuid.Nil {
		ans.ID = uuid.New()
	}
	return r.db.WithContext(ctx).Exec(
		`INSERT INTO practice_answers (id, practice_id, question_id, selected_option_id, answer_data, is_correct, score, answered_at, created_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
		ans.ID, ans.PracticeID, ans.QuestionID, ans.SelectedOptionID, answerDataParam, ans.IsCorrect, ans.Score, ans.AnsweredAt,
	).Error
}

func (r *practiceRepository) FindAnswer(ctx context.Context, practiceID, questionID uuid.UUID) (*models.PracticeAnswer, error) {
	var ans models.PracticeAnswer
	err := r.db.WithContext(ctx).
		Where("practice_id = ? AND question_id = ?", practiceID, questionID).
		First(&ans).Error
	if err != nil {
		return nil, err
	}
	return &ans, nil
}

func (r *practiceRepository) FindAllAnswers(ctx context.Context, practiceID uuid.UUID) ([]models.PracticeAnswer, error) {
	var answers []models.PracticeAnswer
	err := r.db.WithContext(ctx).
		Preload("Question").
		Preload("Question.Options").
		Where("practice_id = ?", practiceID).
		Find(&answers).Error
	return answers, err
}

func (r *practiceRepository) CountAnswers(ctx context.Context, practiceID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&models.PracticeAnswer{}).
		Where("practice_id = ?", practiceID).
		Count(&count).Error
	return count, err
}
