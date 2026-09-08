package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"simantikApi/internal/dto"
	"simantikApi/internal/models"
)

type ReportingRepository interface {
	GetStudentSummary(ctx context.Context, userID uuid.UUID) (*dto.StudentReportSummary, error)
	GetStudentCompetencies(ctx context.Context, userID uuid.UUID) ([]dto.CompetencyPerformanceItem, error)
	GetStudentTrend(ctx context.Context, userID uuid.UUID) ([]dto.AttemptTrendItem, error)
	GetTryoutAnalytics(ctx context.Context, tryoutID uuid.UUID) (*dto.TryoutAnalyticsResponse, error)
	GetQuestionAnalytics(ctx context.Context, questionID uuid.UUID) (*dto.QuestionItemAnalysisResponse, error)
	GetCompetenciesAnalytics(ctx context.Context) ([]dto.CompetencyStatItem, error)
	GetDifficultyAnalytics(ctx context.Context) ([]dto.DifficultyStatItem, error)
	GetAdminOverview(ctx context.Context) (*dto.AdminOverviewAnalyticsResponse, error)
}

type reportingRepository struct {
	db *gorm.DB
}

func NewReportingRepository(db *gorm.DB) ReportingRepository {
	return &reportingRepository{db: db}
}

func (r *reportingRepository) GetStudentSummary(ctx context.Context, userID uuid.UUID) (*dto.StudentReportSummary, error) {
	summary := &dto.StudentReportSummary{}
	if r.db == nil {
		return summary, nil
	}

	// Total attempts
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("user_id = ?", userID).Count(&summary.TotalAttempts)

	// Completed tryouts
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("user_id = ? AND status = ?", userID, models.AttemptStatusCompleted).Count(&summary.CompletedTryouts)

	// Average score
	var avgScore sql.NullFloat64
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("user_id = ? AND status = ?", userID, models.AttemptStatusCompleted).Select("COALESCE(AVG(score), 0)").Scan(&avgScore)
	if avgScore.Valid {
		summary.AverageScore = avgScore.Float64
	}

	// Overall accuracy from evaluations
	var avgAcc sql.NullFloat64
	_ = r.db.WithContext(ctx).Model(&models.Evaluation{}).Where("user_id = ?", userID).Select("COALESCE(AVG(accuracy), 0)").Scan(&avgAcc)
	if avgAcc.Valid {
		summary.OverallAccuracy = avgAcc.Float64
	}

	// Total study materials completed
	_ = r.db.WithContext(ctx).Model(&models.LearningProgress{}).Where("user_id = ? AND is_completed = ?", userID, true).Count(&summary.TotalStudyMaterialsCompleted)

	return summary, nil
}

func (r *reportingRepository) GetStudentCompetencies(ctx context.Context, userID uuid.UUID) ([]dto.CompetencyPerformanceItem, error) {
	if r.db == nil {
		return []dto.CompetencyPerformanceItem{}, nil
	}

	type compRow struct {
		CompetencyID   uuid.UUID
		Code           string
		Name           string
		TotalQuestions int
		CorrectAnswers int
		AvgScore       float64
	}

	var rows []compRow
	err := r.db.WithContext(ctx).Table("competency_evaluations").
		Select("competency_evaluations.competency_id, competencies.code, competencies.name, SUM(competency_evaluations.total_questions) AS total_questions, SUM(competency_evaluations.correct_answers) AS correct_answers, AVG(competency_evaluations.score) AS avg_score").
		Joins("JOIN competencies ON competencies.id = competency_evaluations.competency_id").
		Where("competency_evaluations.user_id = ?", userID).
		Group("competency_evaluations.competency_id, competencies.code, competencies.name").
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	items := make([]dto.CompetencyPerformanceItem, len(rows))
	for i, row := range rows {
		acc := 0.0
		if row.TotalQuestions > 0 {
			acc = (float64(row.CorrectAnswers) / float64(row.TotalQuestions)) * 100
		}
		level := "low"
		if row.AvgScore >= 70 {
			level = "high"
		} else if row.AvgScore >= 40 {
			level = "medium"
		}
		items[i] = dto.CompetencyPerformanceItem{
			CompetencyID:     row.CompetencyID,
			Code:             row.Code,
			Name:             row.Name,
			TotalQuestions:   row.TotalQuestions,
			CorrectAnswers:   row.CorrectAnswers,
			Score:            row.AvgScore,
			Accuracy:         acc,
			PerformanceLevel: level,
		}
	}

	return items, nil
}

func (r *reportingRepository) GetStudentTrend(ctx context.Context, userID uuid.UUID) ([]dto.AttemptTrendItem, error) {
	if r.db == nil {
		return []dto.AttemptTrendItem{}, nil
	}

	type trendRow struct {
		AttemptID   uuid.UUID
		TryoutID    uuid.UUID
		TryoutTitle string
		Score       *float64
		Accuracy    *float64
		SubmittedAt *time.Time
	}

	var rows []trendRow
	err := r.db.WithContext(ctx).Table("tryout_attempts").
		Select("tryout_attempts.id AS attempt_id, tryout_attempts.tryout_id, tryouts.title AS tryout_title, tryout_attempts.score, evaluations.accuracy, tryout_attempts.submitted_at").
		Joins("JOIN tryouts ON tryouts.id = tryout_attempts.tryout_id").
		Joins("LEFT JOIN evaluations ON evaluations.source_id = tryout_attempts.id").
		Where("tryout_attempts.user_id = ? AND tryout_attempts.status = ?", userID, models.AttemptStatusCompleted).
		Order("tryout_attempts.submitted_at ASC").
		Limit(10).
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	items := make([]dto.AttemptTrendItem, len(rows))
	for i, row := range rows {
		score := 0.0
		if row.Score != nil {
			score = *row.Score
		}
		acc := score
		if row.Accuracy != nil {
			acc = *row.Accuracy
		}
		items[i] = dto.AttemptTrendItem{
			AttemptID:   row.AttemptID,
			TryoutID:    row.TryoutID,
			TryoutTitle: row.TryoutTitle,
			Score:       score,
			Accuracy:    acc,
			SubmittedAt: row.SubmittedAt,
		}
	}

	return items, nil
}

func (r *reportingRepository) GetTryoutAnalytics(ctx context.Context, tryoutID uuid.UUID) (*dto.TryoutAnalyticsResponse, error) {
	if r.db == nil {
		return &dto.TryoutAnalyticsResponse{ScoreDistribution: map[string]int64{}}, nil
	}

	var tryout models.Tryout
	if err := r.db.WithContext(ctx).First(&tryout, "id = ?", tryoutID).Error; err != nil {
		return nil, err
	}

	res := &dto.TryoutAnalyticsResponse{
		TryoutID:          tryout.ID,
		TryoutTitle:       tryout.Title,
		ScoreDistribution: make(map[string]int64),
	}

	// Total participants (distinct users who attempted)
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("tryout_id = ?", tryoutID).Distinct("user_id").Count(&res.TotalParticipants)

	// Completed
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("tryout_id = ? AND status = ?", tryoutID, models.AttemptStatusCompleted).Count(&res.TotalCompleted)

	if res.TotalParticipants > 0 {
		res.CompletionRate = (float64(res.TotalCompleted) / float64(res.TotalParticipants)) * 100
	}

	// Score stats
	type scoreStats struct {
		AvgScore sql.NullFloat64
		MinScore sql.NullFloat64
		MaxScore sql.NullFloat64
	}
	var ss scoreStats
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).
		Where("tryout_id = ? AND status = ?", tryoutID, models.AttemptStatusCompleted).
		Select("AVG(score) AS avg_score, MIN(score) AS min_score, MAX(score) AS max_score").
		Scan(&ss)
	if ss.AvgScore.Valid {
		res.AverageScore = ss.AvgScore.Float64
	}
	if ss.MinScore.Valid {
		res.MinScore = ss.MinScore.Float64
	}
	if ss.MaxScore.Valid {
		res.MaxScore = ss.MaxScore.Float64
	}

	// Score Distribution
	var scores []float64
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).
		Where("tryout_id = ? AND status = ?", tryoutID, models.AttemptStatusCompleted).
		Pluck("score", &scores)

	dist := map[string]int64{
		"0-20":   0,
		"21-40":  0,
		"41-60":  0,
		"61-80":  0,
		"81-100": 0,
	}
	for _, sc := range scores {
		if sc <= 20 {
			dist["0-20"]++
		} else if sc <= 40 {
			dist["21-40"]++
		} else if sc <= 60 {
			dist["41-60"]++
		} else if sc <= 80 {
			dist["61-80"]++
		} else {
			dist["81-100"]++
		}
	}
	res.ScoreDistribution = dist

	return res, nil
}

func (r *reportingRepository) GetQuestionAnalytics(ctx context.Context, questionID uuid.UUID) (*dto.QuestionItemAnalysisResponse, error) {
	if r.db == nil {
		return &dto.QuestionItemAnalysisResponse{OptionDistribution: make([]dto.OptionChoiceCount, 0)}, nil
	}

	var q models.Question
	if err := r.db.WithContext(ctx).Preload("Options").First(&q, "id = ?", questionID).Error; err != nil {
		return nil, err
	}

	res := &dto.QuestionItemAnalysisResponse{
		QuestionID:      q.ID,
		QuestionText:    q.QuestionText,
		DifficultyLevel: q.DifficultyLevel,
	}

	// Attempt count and correct count
	_ = r.db.WithContext(ctx).Model(&models.StudentAnswer{}).Where("question_id = ?", questionID).Count(&res.TotalAttempts)
	_ = r.db.WithContext(ctx).Model(&models.StudentAnswer{}).Where("question_id = ? AND is_correct = ?", questionID, true).Count(&res.CorrectCount)

	if res.TotalAttempts > 0 {
		res.DifficultyIndex = float64(res.CorrectCount) / float64(res.TotalAttempts)
	}

	var avgTime sql.NullFloat64
	_ = r.db.WithContext(ctx).Model(&models.StudentAnswer{}).Where("question_id = ?", questionID).Select("AVG(response_time_seconds)").Scan(&avgTime)
	if avgTime.Valid {
		res.AverageResponseTimeSeconds = avgTime.Float64
	}

	// Option distribution
	type optCount struct {
		SelectedOptionID uuid.UUID
		Count            int64
	}
	var counts []optCount
	_ = r.db.WithContext(ctx).Model(&models.StudentAnswer{}).
		Where("question_id = ? AND selected_option_id IS NOT NULL", questionID).
		Select("selected_option_id, COUNT(*) AS count").
		Group("selected_option_id").
		Scan(&counts)

	countMap := make(map[uuid.UUID]int64)
	for _, c := range counts {
		countMap[c.SelectedOptionID] = c.Count
	}

	opts := make([]dto.OptionChoiceCount, len(q.Options))
	for i, o := range q.Options {
		c := countMap[o.ID]
		pct := 0.0
		if res.TotalAttempts > 0 {
			pct = (float64(c) / float64(res.TotalAttempts)) * 100
		}
		opts[i] = dto.OptionChoiceCount{
			OptionLabel:   o.OptionLabel,
			OptionText:    o.OptionText,
			IsCorrect:     o.IsCorrect,
			SelectedCount: c,
			Percentage:    pct,
		}
	}
	res.OptionDistribution = opts

	return res, nil
}

func (r *reportingRepository) GetCompetenciesAnalytics(ctx context.Context) ([]dto.CompetencyStatItem, error) {
	if r.db == nil {
		return []dto.CompetencyStatItem{}, nil
	}

	type compStatRow struct {
		CompetencyID uuid.UUID
		Code         string
		Name         string
		TotalEvals   int64
		AvgScore     float64
		HighCount    int64
		MedCount     int64
		LowCount     int64
	}

	var rows []compStatRow
	err := r.db.WithContext(ctx).Table("competency_evaluations").
		Select(`competency_evaluations.competency_id, competencies.code, competencies.name,
			COUNT(*) AS total_evals,
			AVG(competency_evaluations.score) AS avg_score,
			SUM(CASE WHEN competency_evaluations.level = 'high' THEN 1 ELSE 0 END) AS high_count,
			SUM(CASE WHEN competency_evaluations.level = 'medium' THEN 1 ELSE 0 END) AS med_count,
			SUM(CASE WHEN competency_evaluations.level = 'low' THEN 1 ELSE 0 END) AS low_count`).
		Joins("JOIN competencies ON competencies.id = competency_evaluations.competency_id").
		Group("competency_evaluations.competency_id, competencies.code, competencies.name").
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	items := make([]dto.CompetencyStatItem, len(rows))
	for i, r := range rows {
		items[i] = dto.CompetencyStatItem{
			CompetencyID:          r.CompetencyID,
			Code:                  r.Code,
			Name:                  r.Name,
			TotalEvaluations:      r.TotalEvals,
			AverageScore:          r.AvgScore,
			HighPerformersCount:   r.HighCount,
			MediumPerformersCount: r.MedCount,
			LowPerformersCount:    r.LowCount,
		}
	}

	return items, nil
}

func (r *reportingRepository) GetDifficultyAnalytics(ctx context.Context) ([]dto.DifficultyStatItem, error) {
	if r.db == nil {
		return []dto.DifficultyStatItem{}, nil
	}

	type diffRow struct {
		DifficultyLevel int
		TotalPresented  int64
		TotalCorrect    int64
	}

	var rows []diffRow
	err := r.db.WithContext(ctx).Table("student_answers").
		Select(`questions.difficulty_level,
			COUNT(*) AS total_presented,
			SUM(CASE WHEN student_answers.is_correct = TRUE THEN 1 ELSE 0 END) AS total_correct`).
		Joins("JOIN questions ON questions.id = student_answers.question_id").
		Where("questions.deleted_at IS NULL").
		Group("questions.difficulty_level").
		Order("questions.difficulty_level ASC").
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	items := make([]dto.DifficultyStatItem, len(rows))
	for i, r := range rows {
		acc := 0.0
		if r.TotalPresented > 0 {
			acc = (float64(r.TotalCorrect) / float64(r.TotalPresented)) * 100
		}
		items[i] = dto.DifficultyStatItem{
			DifficultyLevel:         r.DifficultyLevel,
			TotalQuestionsPresented: r.TotalPresented,
			TotalCorrect:            r.TotalCorrect,
			Accuracy:                acc,
		}
	}

	return items, nil
}

func (r *reportingRepository) GetAdminOverview(ctx context.Context) (*dto.AdminOverviewAnalyticsResponse, error) {
	overview := &dto.AdminOverviewAnalyticsResponse{
		DailyAttemptTrend: make([]dto.DailyAttemptItem, 0),
	}
	if r.db == nil {
		return overview, nil
	}

	// 1. Total students
	_ = r.db.WithContext(ctx).Model(&models.User{}).Where("role = ? AND deleted_at IS NULL", models.UserRoleStudent).Count(&overview.TotalStudents)

	// 2. Active students last 30 days
	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)
	_ = r.db.WithContext(ctx).Model(&models.User{}).Where("role = ? AND last_login_at >= ?", models.UserRoleStudent, thirtyDaysAgo).Count(&overview.ActiveStudentsLast30Days)

	// 3. Total attempts & completed
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Count(&overview.TotalAttempts)
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("status = ?", models.AttemptStatusCompleted).Count(&overview.CompletedAttempts)

	// 4. Pass rate (score >= 60)
	var passCount int64
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("status = ? AND score >= ?", models.AttemptStatusCompleted, 60.0).Count(&passCount)
	if overview.CompletedAttempts > 0 {
		overview.OverallPassRate = (float64(passCount) / float64(overview.CompletedAttempts)) * 100
	}

	// 5. Average platform score
	var avgScore sql.NullFloat64
	_ = r.db.WithContext(ctx).Model(&models.TryoutAttempt{}).Where("status = ?", models.AttemptStatusCompleted).Select("COALESCE(AVG(score), 0)").Scan(&avgScore)
	if avgScore.Valid {
		overview.AverageScorePlatform = avgScore.Float64
	}

	// 6. Daily attempt trend (last 7 days)
	type dailyRow struct {
		Date         string
		AttemptCount int64
		AvgScore     float64
	}
	var dailyRows []dailyRow
	_ = r.db.WithContext(ctx).Table("tryout_attempts").
		Select("TO_CHAR(created_at, 'YYYY-MM-DD') AS date, COUNT(*) AS attempt_count, COALESCE(AVG(score), 0) AS avg_score").
		Where("created_at >= ?", time.Now().AddDate(0, 0, -7)).
		Group("TO_CHAR(created_at, 'YYYY-MM-DD')").
		Order("date ASC").
		Scan(&dailyRows)

	for _, d := range dailyRows {
		overview.DailyAttemptTrend = append(overview.DailyAttemptTrend, dto.DailyAttemptItem{
			Date:         d.Date,
			AttemptCount: d.AttemptCount,
			AverageScore: d.AvgScore,
		})
	}

	return overview, nil
}
