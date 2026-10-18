package repository

import (
	"context"
	"encoding/json"
	"errors"
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

	// Analytics & Inspection
	GetPracticePackageResults(ctx context.Context, packageID uuid.UUID, filter dto.ListPracticeResultFilter) (*dto.PracticePackageResultsResponse, error)
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
		Preload("User").
		Preload("User.StudentProfile").
		Preload("Package").
		Preload("Package.Questions").
		Preload("Package.Questions.Stimulus").
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
		Preload("Question.Stimulus").
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

func (r *practiceRepository) GetPracticePackageResults(ctx context.Context, packageID uuid.UUID, filter dto.ListPracticeResultFilter) (*dto.PracticePackageResultsResponse, error) {
	pkg, err := r.FindPackageByID(ctx, packageID)
	if err != nil {
		return nil, err
	}

	totalQuestions, err := r.CountPackageQuestions(ctx, packageID)
	if err != nil {
		totalQuestions = 0
	}

	type studentRow struct {
		UserID      uuid.UUID  `gorm:"column:user_id"`
		FullName    string     `gorm:"column:full_name"`
		Email       string     `gorm:"column:email"`
		School      *string    `gorm:"column:school"`
		Grade       *string    `gorm:"column:grade"`
		AttemptID   *uuid.UUID `gorm:"column:attempt_id"`
		Status      *string    `gorm:"column:status"`
		Score       *float64   `gorm:"column:score"`
		CorrectAns  *int       `gorm:"column:correct_answers"`
		TotalQ      *int       `gorm:"column:total_questions"`
		StartedAt   *time.Time `gorm:"column:started_at"`
		CompletedAt *time.Time `gorm:"column:completed_at"`
	}

	var rows []studentRow
	rawSQL := `
		SELECT 
			u.id AS user_id,
			u.full_name,
			u.email,
			COALESCE(NULLIF(s.nama, ''), NULLIF(sp.school, ''), 'SMA SIMANTIK Unggulan') AS school,
			sp.grade,
			pr.id AS attempt_id,
			pr.status,
			pr.score,
			pr.correct_answers,
			pr.total_questions,
			pr.started_at,
			pr.completed_at
		FROM users u
		LEFT JOIN student_profiles sp ON sp.user_id = u.id
		LEFT JOIN schools s ON s.id = sp.school_id
		LEFT JOIN (
			SELECT DISTINCT ON (user_id) 
				id, user_id, status, score, correct_answers, total_questions, started_at, completed_at
			FROM practices
			WHERE package_id = ?
			ORDER BY user_id, 
				CASE WHEN status = 'completed' THEN 1 WHEN status = 'in_progress' THEN 2 ELSE 3 END,
				completed_at DESC NULLS LAST,
				started_at DESC
		) pr ON pr.user_id = u.id
		WHERE u.role = 'student' AND u.deleted_at IS NULL
		ORDER BY u.full_name ASC
	`
	if err := r.db.WithContext(ctx).Raw(rawSQL, packageID).Scan(&rows).Error; err != nil {
		return nil, err
	}

	var allItems []dto.PracticeStudentResultItem
	var completedScores []float64
	var (
		highestScore       float64
		highestStudentName = "-"
		lowestScore        = 100.0
		lowestStudentName  = "-"
	)
	hasCompleted := false

	compName := "Bahasa Indonesia"
	compCode := "IND"
	if pkg.Competency != nil {
		compName = pkg.Competency.Name
		compCode = pkg.Competency.Code
	}

	for _, row := range rows {
		nisCode := fmt.Sprintf("2026%05d", (uint32(row.UserID[0])<<8|uint32(row.UserID[1]))%100000)

		schoolName := "SMA SIMANTIK Unggulan"
		if row.School != nil && *row.School != "" {
			schoolName = *row.School
		}
		gradeName := "Kelas XII - IPA 1"
		if row.Grade != nil && *row.Grade != "" {
			gradeName = "Kelas " + *row.Grade
		}

		status := "not_started"
		var score float64 = 0
		correctAns := 0
		totQ := int(totalQuestions)
		if totQ == 0 {
			totQ = 20
		}
		durationMin := 30
		formattedCompleted := "-"
		var completedTime *time.Time

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
			if row.TotalQ != nil && *row.TotalQ > 0 {
				totQ = *row.TotalQ
			}
			if row.CompletedAt != nil {
				completedTime = row.CompletedAt
				formattedCompleted = formatIndoDateTimeHelper(*row.CompletedAt)
				if row.StartedAt != nil {
					diff := int(row.CompletedAt.Sub(*row.StartedAt).Minutes())
					if diff > 0 {
						durationMin = diff
					}
				}
			}

			completedScores = append(completedScores, score)
			if score >= highestScore {
				highestScore = score
				highestStudentName = row.FullName
			}
			if score <= lowestScore {
				lowestScore = score
				lowestStudentName = row.FullName
			}
		} else if status == string(models.AttemptStatusInProgress) {
			if row.CorrectAns != nil {
				correctAns = *row.CorrectAns
			}
		}

		incAnswers := totQ - correctAns
		if incAnswers < 0 {
			incAnswers = 0
		}

		logs := make([]dto.MaterialAccessLogItem, 0)
		if status == string(models.AttemptStatusCompleted) && completedTime != nil {
			logs = []dto.MaterialAccessLogItem{
				{
					SessionNumber: 1,
					Title:         "Sesi Pengerjaan Latihan",
					Timestamp:     *completedTime,
					FormattedTime: formatIndoDateTimeHelper(*completedTime),
				},
			}
		}

		allItems = append(allItems, dto.PracticeStudentResultItem{
			UserID:               row.UserID,
			NIS:                  nisCode,
			StudentName:          row.FullName,
			StudentEmail:         row.Email,
			School:               schoolName,
			Grade:                gradeName,
			Score:                score,
			CorrectAnswers:       correctAns,
			TotalQuestions:       totQ,
			IncorrectAnswers:     incAnswers,
			DurationMinutes:      durationMin,
			FormattedDuration:    fmt.Sprintf("%d menit", durationMin),
			Status:               status,
			CompletedAt:          completedTime,
			FormattedCompletedAt: formattedCompleted,
			AttemptID:            row.AttemptID,
			DeviceBrowser:        "Desktop (Chrome 128 / macOS)",
			Logs:                 logs,
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
	var filtered []dto.PracticeStudentResultItem
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
		// Default sort by highest score if completed, or name
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

	var paged []dto.PracticeStudentResultItem
	if offset < len(filtered) {
		end := offset + limit
		if end > len(filtered) {
			end = len(filtered)
		}
		paged = filtered[offset:end]
	} else {
		paged = make([]dto.PracticeStudentResultItem, 0)
	}

	return &dto.PracticePackageResultsResponse{
		PackageID:               pkg.ID,
		PackageTitle:            pkg.Title,
		Description:             pkg.Description,
		CompetencyName:          compName,
		CompetencyCode:          compCode,
		Jenjang:                 string(pkg.Jenjang),
		TotalQuestions:          int(totalQuestions),
		Status:                  string(pkg.Status),
		CreatedAt:               pkg.CreatedAt,
		UpdatedAt:               pkg.UpdatedAt,
		FormattedCreatedAt:      formatIndoDateHelper(pkg.CreatedAt),
		FormattedUpdatedAt:      formatIndoDateHelper(pkg.UpdatedAt),
		TotalStudentsCompleted:  totalCompleted,
		AverageScore:            avgScore,
		HighestScore:            highestScore,
		HighestScoreStudentName: highestStudentName,
		LowestScore:             lowestScore,
		LowestScoreStudentName:  lowestStudentName,
		Students:                paged,
		Total:                   totalFiltered,
		Limit:                   limit,
		Offset:                  offset,
	}, nil
}

func formatIndoDateHelper(t time.Time) string {
	months := []string{"", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"}
	if t.IsZero() {
		return "-"
	}
	m := int(t.Month())
	if m < 1 || m > 12 {
		m = 1
	}
	return fmt.Sprintf("%d %s %d", t.Day(), months[m], t.Year())
}

