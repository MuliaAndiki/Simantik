package repository

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type TryoutAttemptRepository interface {
	CreateAttempt(ctx context.Context, attempt *models.TryoutAttempt) error
	FindAttemptByID(ctx context.Context, id uuid.UUID) (*models.TryoutAttempt, error)
	UpdateAttempt(ctx context.Context, attempt *models.TryoutAttempt) error

	BulkCreateAttemptQuestions(ctx context.Context, aqs []models.AttemptQuestion) error
	FindAttemptQuestions(ctx context.Context, attemptID uuid.UUID) ([]models.AttemptQuestion, error)
	FindAttemptQuestionByNumber(ctx context.Context, attemptID uuid.UUID, questionNumber int) (*models.AttemptQuestion, error)
	// ponytail: lite lookup tanpa preload, untuk SubmitAnswer 7->3 query
	FindAttemptQuestionByQuestionID(ctx context.Context, attemptID, questionID uuid.UUID) (*models.AttemptQuestion, error)
	// ponytail: review hanya answered, hindari load full pool
	FindAttemptQuestionsByQuestionIDs(ctx context.Context, attemptID uuid.UUID, questionIDs []uuid.UUID) ([]models.AttemptQuestion, error)
	UpdateAttemptQuestion(ctx context.Context, aq *models.AttemptQuestion) error

	UpsertAnswer(ctx context.Context, ans *models.StudentAnswer) error
	FindAnswer(ctx context.Context, attemptID, questionID uuid.UUID) (*models.StudentAnswer, error)
	FindAllAnswers(ctx context.Context, attemptID uuid.UUID) ([]models.StudentAnswer, error)
	CountAnswers(ctx context.Context, attemptID uuid.UUID) (int64, error)
	// ponytail: batch count untuk ListMyAttempts, N+1 -> 1 query
	CountAnswersBatch(ctx context.Context, attemptIDs []uuid.UUID) (map[uuid.UUID]int64, error)

	// ponytail: select 1 kolom, ganti First(&opt) full row di SubmitAnswer
	GetOptionCorrectness(ctx context.Context, optionID uuid.UUID) (bool, error)
	// ponytail: select id+difficulty saja, ganti Select * pool di Start/Submit
	FindQuestionDifficulties(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]int, error)

	FindActiveAttempt(ctx context.Context, userID, tryoutID uuid.UUID) (*models.TryoutAttempt, error)
	ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.MyAttemptsFilter) ([]models.TryoutAttempt, int64, error)
}

type tryoutAttemptRepository struct {
	db *gorm.DB
}

func NewTryoutAttemptRepository(db *gorm.DB) TryoutAttemptRepository {
	return &tryoutAttemptRepository{db: db}
}

func (r *tryoutAttemptRepository) CreateAttempt(ctx context.Context, attempt *models.TryoutAttempt) error {
	return r.db.WithContext(ctx).Create(attempt).Error
}

func (r *tryoutAttemptRepository) FindAttemptByID(ctx context.Context, id uuid.UUID) (*models.TryoutAttempt, error) {
	var attempt models.TryoutAttempt
	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("User.StudentProfile").
		First(&attempt, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &attempt, nil
}

func (r *tryoutAttemptRepository) UpdateAttempt(ctx context.Context, attempt *models.TryoutAttempt) error {
	return r.db.WithContext(ctx).Save(attempt).Error
}

func (r *tryoutAttemptRepository) BulkCreateAttemptQuestions(ctx context.Context, aqs []models.AttemptQuestion) error {
	return r.db.WithContext(ctx).CreateInBatches(aqs, 100).Error
}

func (r *tryoutAttemptRepository) FindAttemptQuestions(ctx context.Context, attemptID uuid.UUID) ([]models.AttemptQuestion, error) {
	var aqs []models.AttemptQuestion
	// Lite: tanpa Preload Question (hemat TEXT). Caller yang butuh detail pakai ByQuestionIDs/ByNumber.
	err := r.db.WithContext(ctx).Where("attempt_id = ?", attemptID).Order("question_number ASC").Find(&aqs).Error
	return aqs, err
}

func (r *tryoutAttemptRepository) FindAttemptQuestionByNumber(ctx context.Context, attemptID uuid.UUID, questionNumber int) (*models.AttemptQuestion, error) {
	var aq models.AttemptQuestion
	err := r.db.WithContext(ctx).
		Preload("Question").
		Preload("Question.Options").
		Where("attempt_id = ? AND question_number = ?", attemptID, questionNumber).
		First(&aq).Error
	if err != nil {
		return nil, err
	}
	return &aq, nil
}

func (r *tryoutAttemptRepository) UpsertAnswer(ctx context.Context, ans *models.StudentAnswer) error {
	if ans.ID == uuid.Nil {
		ans.ID = uuid.New()
	}
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
	result := r.db.WithContext(ctx).Exec(
		`INSERT INTO student_answers (id, attempt_id, question_id, attempt_question_id, selected_option_id, answer_data, is_correct, score, response_time_seconds, answered_at, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
		 ON CONFLICT (attempt_id, question_id)
		 DO UPDATE SET selected_option_id=EXCLUDED.selected_option_id, answer_data=EXCLUDED.answer_data,
		 is_correct=EXCLUDED.is_correct, score=EXCLUDED.score, response_time_seconds=EXCLUDED.response_time_seconds, answered_at=EXCLUDED.answered_at, updated_at=NOW()`,
		ans.ID, ans.AttemptID, ans.QuestionID, ans.AttemptQuestionID, ans.SelectedOptionID,
		answerDataParam, ans.IsCorrect, ans.Score, ans.ResponseTimeSeconds, ans.AnsweredAt,
	)
	return result.Error
}

func (r *tryoutAttemptRepository) FindAnswer(ctx context.Context, attemptID, questionID uuid.UUID) (*models.StudentAnswer, error) {
	var ans models.StudentAnswer
	err := r.db.WithContext(ctx).Where("attempt_id = ? AND question_id = ?", attemptID, questionID).First(&ans).Error
	if err != nil {
		return nil, err
	}
	return &ans, nil
}

func (r *tryoutAttemptRepository) FindAllAnswers(ctx context.Context, attemptID uuid.UUID) ([]models.StudentAnswer, error) {
	var answers []models.StudentAnswer
	// Lite: tanpa Preload Question (caller hanya butuh QuestionID/IsCorrect/Score).
	err := r.db.WithContext(ctx).Where("attempt_id = ?", attemptID).Find(&answers).Error
	return answers, err
}

func (r *tryoutAttemptRepository) FindAttemptQuestionByQuestionID(ctx context.Context, attemptID, questionID uuid.UUID) (*models.AttemptQuestion, error) {
	var aq models.AttemptQuestion
	err := r.db.WithContext(ctx).
		Where("attempt_id = ? AND question_id = ?", attemptID, questionID).
		First(&aq).Error
	if err != nil {
		return nil, err
	}
	return &aq, nil
}

func (r *tryoutAttemptRepository) FindAttemptQuestionsByQuestionIDs(ctx context.Context, attemptID uuid.UUID, questionIDs []uuid.UUID) ([]models.AttemptQuestion, error) {
	if len(questionIDs) == 0 {
		return []models.AttemptQuestion{}, nil
	}
	var aqs []models.AttemptQuestion
	err := r.db.WithContext(ctx).
		Preload("Question").
		Preload("Question.Options", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Question.Competencies").
		Preload("Question.Explanation").
		Where("attempt_id = ? AND question_id IN ?", attemptID, questionIDs).
		Order("question_number ASC").
		Find(&aqs).Error
	return aqs, err
}

func (r *tryoutAttemptRepository) UpdateAttemptQuestion(ctx context.Context, aq *models.AttemptQuestion) error {
	return r.db.WithContext(ctx).Save(aq).Error
}

func (r *tryoutAttemptRepository) CountAnswersBatch(ctx context.Context, attemptIDs []uuid.UUID) (map[uuid.UUID]int64, error) {
	out := make(map[uuid.UUID]int64, len(attemptIDs))
	if len(attemptIDs) == 0 {
		return out, nil
	}
	type row struct {
		AttemptID uuid.UUID `gorm:"column:attempt_id"`
		Count     int64     `gorm:"column:count"`
	}
	var rows []row
	err := r.db.WithContext(ctx).Table("student_answers").
		Select("attempt_id, COUNT(*) AS count").
		Where("attempt_id IN ?", attemptIDs).
		Group("attempt_id").
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}
	for _, row := range rows {
		out[row.AttemptID] = row.Count
	}
	return out, nil
}

func (r *tryoutAttemptRepository) GetOptionCorrectness(ctx context.Context, optionID uuid.UUID) (bool, error) {
	var isCorrect bool
	err := r.db.WithContext(ctx).Table("question_options").
		Select("is_correct").
		Where("id = ?", optionID).
		Scan(&isCorrect).Error
	return isCorrect, err
}

func (r *tryoutAttemptRepository) FindQuestionDifficulties(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]int, error) {
	out := make(map[uuid.UUID]int, len(ids))
	if len(ids) == 0 {
		return out, nil
	}
	type row struct {
		ID              uuid.UUID `gorm:"column:id"`
		DifficultyLevel int       `gorm:"column:difficulty_level"`
	}
	var rows []row
	err := r.db.WithContext(ctx).Table("questions").
		Select("id, difficulty_level").
		Where("id IN ?", ids).
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}
	for _, row := range rows {
		out[row.ID] = row.DifficultyLevel
	}
	return out, nil
}

func (r *tryoutAttemptRepository) CountAnswers(ctx context.Context, attemptID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.StudentAnswer{}).Where("attempt_id = ?", attemptID).Count(&count).Error
	return count, err
}

func (r *tryoutAttemptRepository) FindActiveAttempt(ctx context.Context, userID, tryoutID uuid.UUID) (*models.TryoutAttempt, error) {
	var attempt models.TryoutAttempt
	err := r.db.WithContext(ctx).Where("user_id = ? AND tryout_id = ? AND status = 'in_progress'", userID, tryoutID).First(&attempt).Error
	if err != nil {
		return nil, err
	}
	return &attempt, nil
}

func (r *tryoutAttemptRepository) ListByUserID(ctx context.Context, userID uuid.UUID, filter dto.MyAttemptsFilter) ([]models.TryoutAttempt, int64, error) {
	var attempts []models.TryoutAttempt
	var total int64
	query := r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("user_id = ?", userID)

	if filter.TryoutID != nil {
		query = query.Where("tryout_id = ?", filter.TryoutID)
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

	err = query.Order("started_at desc").Find(&attempts).Error
	return attempts, total, err
}
