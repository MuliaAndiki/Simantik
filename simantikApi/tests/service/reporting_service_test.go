package service_test

import (
	"context"
	"testing"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/service"
)

type mockReportingRepo struct {
	summary       *dto.StudentReportSummary
	competencies  []dto.CompetencyPerformanceItem
	trend         []dto.AttemptTrendItem
	tryoutStats   *dto.TryoutAnalyticsResponse
	questionStats *dto.QuestionItemAnalysisResponse
	compStats     []dto.CompetencyStatItem
	diffStats     []dto.DifficultyStatItem
	adminOverview *dto.AdminOverviewAnalyticsResponse
}

func newMockReportingRepo() *mockReportingRepo {
	return &mockReportingRepo{
		summary: &dto.StudentReportSummary{
			TotalAttempts:                6,
			CompletedTryouts:             5,
			AverageScore:                 78.0,
			OverallAccuracy:              82.0,
			TotalStudyMaterialsCompleted: 4,
		},
		competencies: []dto.CompetencyPerformanceItem{
			{
				CompetencyID:     uuid.New(),
				Code:             "COMP-01",
				Name:             "Penalaran Umum",
				TotalQuestions:   20,
				CorrectAnswers:   17,
				Score:            85.0,
				Accuracy:         85.0,
				PerformanceLevel: "high",
			},
			{
				CompetencyID:     uuid.New(),
				Code:             "COMP-02",
				Name:             "Pengetahuan Kuantitatif",
				TotalQuestions:   20,
				CorrectAnswers:   8,
				Score:            40.0,
				Accuracy:         40.0,
				PerformanceLevel: "low",
			},
		},
		trend: []dto.AttemptTrendItem{
			{AttemptID: uuid.New(), Score: 60.0, Accuracy: 65.0},
			{AttemptID: uuid.New(), Score: 72.0, Accuracy: 75.0},
			{AttemptID: uuid.New(), Score: 85.0, Accuracy: 88.0},
		},
		tryoutStats: &dto.TryoutAnalyticsResponse{
			TryoutID:          uuid.New(),
			TryoutTitle:       "Tryout Akbar UTBK",
			TotalParticipants: 100,
			TotalCompleted:    90,
			CompletionRate:    90.0,
			AverageScore:      72.5,
			MinScore:          30.0,
			MaxScore:          98.0,
			ScoreDistribution: map[string]int64{
				"0-20":   2,
				"21-40":  8,
				"41-60":  20,
				"61-80":  40,
				"81-100": 20,
			},
		},
		questionStats: &dto.QuestionItemAnalysisResponse{
			QuestionID:                 uuid.New(),
			QuestionText:               "Jika x + y = 10 dan x - y = 2, maka x = ...",
			DifficultyLevel:            2,
			TotalAttempts:              50,
			CorrectCount:               40,
			DifficultyIndex:            0.80,
			AverageResponseTimeSeconds: 45.0,
			OptionDistribution: []dto.OptionChoiceCount{
				{OptionLabel: "A", OptionText: "4", IsCorrect: false, SelectedCount: 3, Percentage: 6.0},
				{OptionLabel: "B", OptionText: "6", IsCorrect: true, SelectedCount: 40, Percentage: 80.0},
				{OptionLabel: "C", OptionText: "8", IsCorrect: false, SelectedCount: 7, Percentage: 14.0},
			},
		},
		compStats: []dto.CompetencyStatItem{
			{
				CompetencyID:          uuid.New(),
				Code:                  "COMP-01",
				Name:                  "Penalaran Umum",
				TotalEvaluations:      120,
				AverageScore:          76.0,
				HighPerformersCount:   60,
				MediumPerformersCount: 40,
				LowPerformersCount:    20,
			},
		},
		diffStats: []dto.DifficultyStatItem{
			{DifficultyLevel: 1, TotalQuestionsPresented: 100, TotalCorrect: 85, Accuracy: 85.0},
			{DifficultyLevel: 2, TotalQuestionsPresented: 120, TotalCorrect: 90, Accuracy: 75.0},
			{DifficultyLevel: 3, TotalQuestionsPresented: 80, TotalCorrect: 48, Accuracy: 60.0},
			{DifficultyLevel: 4, TotalQuestionsPresented: 60, TotalCorrect: 30, Accuracy: 50.0},
			{DifficultyLevel: 5, TotalQuestionsPresented: 40, TotalCorrect: 12, Accuracy: 30.0},
		},
		adminOverview: &dto.AdminOverviewAnalyticsResponse{
			TotalStudents:            250,
			ActiveStudentsLast30Days: 180,
			TotalAttempts:            600,
			CompletedAttempts:        520,
			OverallPassRate:          78.5,
			AverageScorePlatform:     71.2,
		},
	}
}

func (m *mockReportingRepo) GetStudentSummary(ctx context.Context, userID uuid.UUID) (*dto.StudentReportSummary, error) {
	return m.summary, nil
}

func (m *mockReportingRepo) GetStudentCompetencies(ctx context.Context, userID uuid.UUID) ([]dto.CompetencyPerformanceItem, error) {
	return m.competencies, nil
}

func (m *mockReportingRepo) GetStudentTrend(ctx context.Context, userID uuid.UUID) ([]dto.AttemptTrendItem, error) {
	return m.trend, nil
}

func (m *mockReportingRepo) GetTryoutAnalytics(ctx context.Context, tryoutID uuid.UUID) (*dto.TryoutAnalyticsResponse, error) {
	return m.tryoutStats, nil
}

func (m *mockReportingRepo) GetQuestionAnalytics(ctx context.Context, questionID uuid.UUID) (*dto.QuestionItemAnalysisResponse, error) {
	return m.questionStats, nil
}

func (m *mockReportingRepo) GetCompetenciesAnalytics(ctx context.Context) ([]dto.CompetencyStatItem, error) {
	return m.compStats, nil
}

func (m *mockReportingRepo) GetDifficultyAnalytics(ctx context.Context) ([]dto.DifficultyStatItem, error) {
	return m.diffStats, nil
}

func (m *mockReportingRepo) GetAdminOverview(ctx context.Context) (*dto.AdminOverviewAnalyticsResponse, error) {
	return m.adminOverview, nil
}


// ─── Tests ───────────────────────────────────────────────────────────────────

func TestReportingService_StudentReportCard(t *testing.T) {
	repo := newMockReportingRepo()
	svc := service.NewReportingService(repo, nil)

	userID := uuid.New()
	res, err := svc.GetStudentReportCard(context.Background(), userID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	// Verify Summary
	if res.Summary.TotalAttempts != 6 {
		t.Errorf("expected 6 attempts, got %d", res.Summary.TotalAttempts)
	}
	if res.Summary.StrengthCount != 1 {
		t.Errorf("expected 1 strength competency, got %d", res.Summary.StrengthCount)
	}
	if res.Summary.WeaknessCount != 1 {
		t.Errorf("expected 1 weakness competency, got %d", res.Summary.WeaknessCount)
	}

	// Verify Strengths and Improvements segregation
	if len(res.Strengths) != 1 || res.Strengths[0].Code != "COMP-01" {
		t.Errorf("expected COMP-01 as strength, got %+v", res.Strengths)
	}
	if len(res.AreasForImprovement) != 1 || res.AreasForImprovement[0].Code != "COMP-02" {
		t.Errorf("expected COMP-02 as area for improvement, got %+v", res.AreasForImprovement)
	}

	// Verify Trend (60 -> 72 -> 85 is improving)
	if res.TrendStatus != "improving" {
		t.Errorf("expected trend 'improving', got %s", res.TrendStatus)
	}
}

func TestReportingService_TrendCalculation(t *testing.T) {
	repo := newMockReportingRepo()
	svc := service.NewReportingService(repo, nil)

	// 1. Declining trend (85 -> 70 -> 55)
	repo.trend = []dto.AttemptTrendItem{
		{Score: 85.0},
		{Score: 70.0},
		{Score: 55.0},
	}
	res, _ := svc.GetStudentReportCard(context.Background(), uuid.New())
	if res.TrendStatus != "declining" {
		t.Errorf("expected 'declining', got %s", res.TrendStatus)
	}

	// 2. Stable trend (75 -> 74 -> 76)
	repo.trend = []dto.AttemptTrendItem{
		{Score: 75.0},
		{Score: 74.0},
		{Score: 76.0},
	}
	res, _ = svc.GetStudentReportCard(context.Background(), uuid.New())
	if res.TrendStatus != "stable" {
		t.Errorf("expected 'stable', got %s", res.TrendStatus)
	}

	// 3. Insufficient data (< 2 attempts)
	repo.trend = []dto.AttemptTrendItem{
		{Score: 80.0},
	}
	res, _ = svc.GetStudentReportCard(context.Background(), uuid.New())
	if res.TrendStatus != "insufficient_data" {
		t.Errorf("expected 'insufficient_data', got %s", res.TrendStatus)
	}
}

func TestReportingService_TryoutAnalytics(t *testing.T) {
	repo := newMockReportingRepo()
	svc := service.NewReportingService(repo, nil)

	tryoutID := uuid.New()
	res, err := svc.GetTryoutAnalytics(context.Background(), tryoutID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.CompletionRate != 90.0 {
		t.Errorf("expected 90%% completion rate, got %f", res.CompletionRate)
	}
	if res.AverageScore != 72.5 {
		t.Errorf("expected avg score 72.5, got %f", res.AverageScore)
	}
	if res.ScoreDistribution["61-80"] != 40 {
		t.Errorf("expected 40 in 61-80 distribution, got %d", res.ScoreDistribution["61-80"])
	}
}

func TestReportingService_QuestionItemAnalysis(t *testing.T) {
	repo := newMockReportingRepo()
	svc := service.NewReportingService(repo, nil)

	questionID := uuid.New()
	res, err := svc.GetQuestionAnalytics(context.Background(), questionID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.DifficultyIndex != 0.80 {
		t.Errorf("expected difficulty index 0.80, got %f", res.DifficultyIndex)
	}
	if len(res.OptionDistribution) != 3 {
		t.Errorf("expected 3 options in distribution, got %d", len(res.OptionDistribution))
	}
	if res.OptionDistribution[1].SelectedCount != 40 {
		t.Errorf("expected correct option chosen 40 times, got %d", res.OptionDistribution[1].SelectedCount)
	}
}

func TestReportingService_CompetenciesAndDifficultyAnalytics(t *testing.T) {
	repo := newMockReportingRepo()
	svc := service.NewReportingService(repo, nil)

	// Competencies analytics
	comps, err := svc.GetCompetenciesAnalytics(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(comps.Competencies) != 1 || comps.Competencies[0].AverageScore != 76.0 {
		t.Errorf("unexpected competencies analytics: %+v", comps)
	}

	// Difficulty analytics
	diffs, err := svc.GetDifficultyAnalytics(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(diffs.DifficultyLevels) != 5 {
		t.Errorf("expected 5 difficulty levels, got %d", len(diffs.DifficultyLevels))
	}
	if diffs.DifficultyLevels[0].Accuracy != 85.0 {
		t.Errorf("expected level 1 accuracy 85%%, got %f", diffs.DifficultyLevels[0].Accuracy)
	}
}

func TestReportingService_AdminOverview(t *testing.T) {
	repo := newMockReportingRepo()
	svc := service.NewReportingService(repo, nil)

	overview, err := svc.GetAdminOverview(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if overview.TotalStudents != 250 {
		t.Errorf("expected 250 students, got %d", overview.TotalStudents)
	}
	if overview.OverallPassRate != 78.5 {
		t.Errorf("expected 78.5 pass rate, got %f", overview.OverallPassRate)
	}
}
