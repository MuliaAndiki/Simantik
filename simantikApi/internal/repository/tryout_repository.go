package repository

import (
	"context"
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

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
	SyncQuestions(ctx context.Context, tryoutID uuid.UUID, questionIDs []uuid.UUID) error
	RemoveQuestion(ctx context.Context, tryoutID, questionID uuid.UUID) error
	CountPoolQuestions(ctx context.Context, tryoutID uuid.UUID) (int64, error)
	ListPublished(ctx context.Context, filter dto.ListTryoutFilter) ([]models.Tryout, int64, error)
	GetPoolQuestionIDs(ctx context.Context, tryoutID uuid.UUID) ([]uuid.UUID, error)
	GetTryoutPackageResults(ctx context.Context, tryoutID uuid.UUID, filter dto.ListTryoutResultFilter) (*dto.TryoutPackageResultsResponse, error)
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
	err := r.db.WithContext(ctx).
		Preload("Questions").
		Preload("Questions.Options", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Preload("Questions.Type").
		Preload("Questions.Explanation").
		Preload("Questions.Competencies").
		Preload("Questions.Stimulus").
		First(&tryout, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	// Reorder questions based on join table tryout_questions
	var orderedIDs []uuid.UUID
	r.db.WithContext(ctx).Model(&models.TryoutQuestion{}).Where("tryout_id = ?", id).Order("display_order ASC").Pluck("question_id", &orderedIDs)

	if len(orderedIDs) > 0 {
		questionMap := make(map[uuid.UUID]models.Question)
		for _, q := range tryout.Questions {
			questionMap[q.ID] = q
		}
		orderedQuestions := make([]models.Question, 0, len(tryout.Questions))
		for _, qid := range orderedIDs {
			if q, ok := questionMap[qid]; ok {
				orderedQuestions = append(orderedQuestions, q)
			}
		}
		tryout.Questions = orderedQuestions
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

func (r *tryoutRepository) SyncQuestions(ctx context.Context, tryoutID uuid.UUID, questionIDs []uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("tryout_id = ?", tryoutID).Delete(&models.TryoutQuestion{}).Error; err != nil {
			return err
		}

		if len(questionIDs) == 0 {
			return nil
		}

		var tqs []models.TryoutQuestion
		for i, qid := range questionIDs {
			tqs = append(tqs, models.TryoutQuestion{
				TryoutID:     tryoutID,
				QuestionID:   qid,
				DisplayOrder: i + 1,
				ScoreWeight:  1.0,
			})
		}
		return tx.CreateInBatches(tqs, 100).Error
	})
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

func (r *tryoutRepository) GetTryoutPackageResults(ctx context.Context, tryoutID uuid.UUID, filter dto.ListTryoutResultFilter) (*dto.TryoutPackageResultsResponse, error) {
	tryout, err := r.FindByID(ctx, tryoutID)
	if err != nil {
		return nil, err
	}

	totalQuestions, err := r.CountPoolQuestions(ctx, tryoutID)
	if err != nil {
		totalQuestions = 0
	}

	// Calculate Cognitive Level Breakdown C1-C5
	type diffCount struct {
		DifficultyLevel int `gorm:"column:difficulty_level"`
		Count           int `gorm:"column:count"`
	}
	var diffCounts []diffCount
	_ = r.db.WithContext(ctx).Table("tryout_questions tq").
		Select("q.difficulty_level, COUNT(*) AS count").
		Joins("JOIN questions q ON q.id = tq.question_id").
		Where("tq.tryout_id = ?", tryoutID).
		Group("q.difficulty_level").
		Scan(&diffCounts)

	cogBreakdown := dto.TryoutCognitiveBreakdown{}
	for _, dc := range diffCounts {
		switch dc.DifficultyLevel {
		case 1:
			cogBreakdown.C1Count = dc.Count
		case 2:
			cogBreakdown.C2Count = dc.Count
		case 3:
			cogBreakdown.C3Count = dc.Count
		case 4:
			cogBreakdown.C4Count = dc.Count
		case 5:
			cogBreakdown.C5Count = dc.Count
		}
	}

	type studentRow struct {
		UserID       uuid.UUID  `gorm:"column:user_id"`
		FullName     string     `gorm:"column:full_name"`
		Email        string     `gorm:"column:email"`
		School       *string    `gorm:"column:school"`
		Grade        *string    `gorm:"column:grade"`
		AttemptID    *uuid.UUID `gorm:"column:attempt_id"`
		Status       *string    `gorm:"column:status"`
		Score        *float64   `gorm:"column:score"`
		StartedAt    *time.Time `gorm:"column:started_at"`
		SubmittedAt  *time.Time `gorm:"column:submitted_at"`
		CorrectAns   *int       `gorm:"column:correct_answers"`
		IncorrectAns *int       `gorm:"column:incorrect_answers"`
		TotalQ       *int       `gorm:"column:total_questions"`
	}

	var rows []studentRow
	rawSQL := `
		SELECT 
			u.id AS user_id,
			u.full_name,
			u.email,
			COALESCE(NULLIF(s.nama, ''), NULLIF(sp.school, ''), 'SMA SIMANTIK Unggulan') AS school,
			sp.grade,
			ta.id AS attempt_id,
			ta.status,
			ta.score,
			ta.started_at,
			ta.submitted_at,
			(SELECT COUNT(*) FROM student_answers sa WHERE sa.attempt_id = ta.id AND sa.is_correct = true) AS correct_answers,
			(SELECT COUNT(*) FROM student_answers sa WHERE sa.attempt_id = ta.id AND sa.is_correct = false) AS incorrect_answers,
			(SELECT COUNT(*) FROM attempt_questions aq WHERE aq.attempt_id = ta.id) AS total_questions
		FROM users u
		LEFT JOIN student_profiles sp ON sp.user_id = u.id
		LEFT JOIN schools s ON s.id = sp.school_id
		LEFT JOIN (
			SELECT DISTINCT ON (user_id) 
				id, user_id, status, score, started_at, submitted_at
			FROM tryout_attempts
			WHERE tryout_id = ?
			ORDER BY user_id, 
				CASE WHEN status = 'completed' THEN 1 WHEN status = 'in_progress' THEN 2 ELSE 3 END,
				submitted_at DESC NULLS LAST,
				started_at DESC
		) ta ON ta.user_id = u.id
		WHERE u.role = 'student' AND u.deleted_at IS NULL
		ORDER BY u.full_name ASC
	`
	if err := r.db.WithContext(ctx).Raw(rawSQL, tryoutID).Scan(&rows).Error; err != nil {
		return nil, err
	}

	var allItems []dto.TryoutStudentResultItem
	var completedScores []float64
	var (
		highestScore     float64
		highestCorrect   int
		highestIncorrect int
		lowestScore      = 100.0
		lowestCorrect    int
		lowestIncorrect  int
	)
	hasCompleted := false

	for _, row := range rows {
		nisCode := fmt.Sprintf("2026%05d", (uint32(row.UserID[0])<<8|uint32(row.UserID[1]))%100000)

		schoolName := "SMA SIMANTIK Unggulan"
		if row.School != nil && *row.School != "" {
			schoolName = *row.School
		}
		gradeName := "Kelas XII IPA 1"
		if row.Grade != nil && *row.Grade != "" {
			gradeName = "Kelas " + *row.Grade
		}

		status := "not_started"
		var score float64 = 0
		correctAns := 0
		incorrectAns := 0
		totQ := 30
		if row.TotalQ != nil && *row.TotalQ > 0 {
			totQ = *row.TotalQ
		}
		durationMin := 68
		formattedSubmitted := "-"
		var submittedTime *time.Time

		if row.Status != nil {
			status = *row.Status
		}

		if status == string(models.AttemptStatusCompleted) {
			hasCompleted = true
			if row.Score != nil {
				score = *row.Score
			}
			if row.CorrectAns != nil {
				correctAns = *row.CorrectAns
			}
			if row.IncorrectAns != nil {
				incorrectAns = *row.IncorrectAns
			}
			if row.SubmittedAt != nil {
				submittedTime = row.SubmittedAt
				formattedSubmitted = formatIndoDateTimeHelper(*row.SubmittedAt)
				if row.StartedAt != nil {
					diff := int(row.SubmittedAt.Sub(*row.StartedAt).Minutes())
					if diff > 0 {
						durationMin = diff
					}
				}
			}

			completedScores = append(completedScores, score)
			if score >= highestScore {
				highestScore = score
				highestCorrect = correctAns
				highestIncorrect = incorrectAns
			}
			if score <= lowestScore {
				lowestScore = score
				lowestCorrect = correctAns
				lowestIncorrect = incorrectAns
			}
		}

		allItems = append(allItems, dto.TryoutStudentResultItem{
			UserID:               row.UserID,
			NIS:                  nisCode,
			StudentName:          row.FullName,
			StudentEmail:         row.Email,
			School:               schoolName,
			Grade:                gradeName,
			Score:                score,
			CorrectAnswers:       correctAns,
			TotalQuestions:       totQ,
			IncorrectAnswers:     incorrectAns,
			DurationMinutes:      durationMin,
			FormattedDuration:    fmt.Sprintf("%d menit", durationMin),
			Status:               status,
			CompletedAt:          submittedTime,
			FormattedCompletedAt: formattedSubmitted,
			AttemptID:            row.AttemptID,
		})
	}

	totalCompleted := len(completedScores)
	var avgScore float64 = 0
	if totalCompleted > 0 {
		sum := 0.0
		for _, s := range completedScores {
			sum += s
		}
		avgScore = math.Round((sum/float64(totalCompleted))*10) / 10
	} else {
		lowestScore = 0
	}
	if !hasCompleted {
		highestScore = 0
		lowestScore = 0
	}

	// Filter
	var filtered []dto.TryoutStudentResultItem
	searchLower := strings.ToLower(strings.TrimSpace(filter.Search))
	for _, item := range allItems {
		if searchLower != "" {
			if !strings.Contains(strings.ToLower(item.StudentName), searchLower) &&
				!strings.Contains(strings.ToLower(item.StudentEmail), searchLower) &&
				!strings.Contains(strings.ToLower(item.NIS), searchLower) {
				continue
			}
		}
		if filter.Status != "" && filter.Status != "all" {
			if !strings.EqualFold(item.Status, filter.Status) {
				continue
			}
		}
		filtered = append(filtered, item)
	}

	// Sort
	switch filter.Sort {
	case "highest_score":
		sort.SliceStable(filtered, func(i, j int) bool {
			return filtered[i].Score > filtered[j].Score
		})
	case "lowest_score":
		sort.SliceStable(filtered, func(i, j int) bool {
			return filtered[i].Score < filtered[j].Score
		})
	case "newest":
		sort.SliceStable(filtered, func(i, j int) bool {
			if filtered[i].CompletedAt != nil && filtered[j].CompletedAt != nil {
				return filtered[i].CompletedAt.After(*filtered[j].CompletedAt)
			}
			return filtered[i].CompletedAt != nil
		})
	case "name_asc":
		sort.SliceStable(filtered, func(i, j int) bool {
			return strings.ToLower(filtered[i].StudentName) < strings.ToLower(filtered[j].StudentName)
		})
	default:
		sort.SliceStable(filtered, func(i, j int) bool {
			if filtered[i].Status == "completed" && filtered[j].Status != "completed" {
				return true
			}
			if filtered[i].Status != "completed" && filtered[j].Status == "completed" {
				return false
			}
			return filtered[i].Score > filtered[j].Score
		})
	}

	totalFiltered := int64(len(filtered))
	limit := filter.Limit
	if limit <= 0 {
		limit = 10
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}

	var paged []dto.TryoutStudentResultItem
	if offset < len(filtered) {
		end := offset + limit
		if end > len(filtered) {
			end = len(filtered)
		}
		paged = filtered[offset:end]
	} else {
		paged = make([]dto.TryoutStudentResultItem, 0)
	}

	durationMins := tryout.DurationSeconds / 60
	if durationMins == 0 {
		durationMins = 75
	}

	return &dto.TryoutPackageResultsResponse{
		TryoutID:                tryout.ID,
		TryoutTitle:             tryout.Title,
		Description:             tryout.Description,
		Jenjang:                 string(tryout.Jenjang),
		DurationMinutes:         durationMins,
		TotalPoolQuestions:      int(totalQuestions),
		Status:                  string(tryout.Status),
		CreatedAt:               tryout.CreatedAt,
		UpdatedAt:               tryout.UpdatedAt,
		FormattedCreatedAt:      formatIndoDateHelper(tryout.CreatedAt),
		FormattedUpdatedAt:      formatIndoDateHelper(tryout.UpdatedAt),
		CognitiveBreakdown:      cogBreakdown,
		TotalStudentsCompleted:  totalCompleted,
		AverageScore:            avgScore,
		HighestScore:            highestScore,
		HighestCorrectAnswers:   highestCorrect,
		HighestIncorrectAnswers: highestIncorrect,
		LowestScore:             lowestScore,
		LowestCorrectAnswers:    lowestCorrect,
		LowestIncorrectAnswers:  lowestIncorrect,
		Students:                paged,
		Total:                   totalFiltered,
		Limit:                   limit,
		Offset:                  offset,
	}, nil
}
