package service

import (
	"context"

	"github.com/google/uuid"

	"simantikApi/internal/dto"
	"simantikApi/internal/repository"
)

type ReportingService interface {
	GetStudentReportCard(ctx context.Context, userID uuid.UUID) (*dto.StudentReportCardResponse, error)
	GetTryoutAnalytics(ctx context.Context, tryoutID uuid.UUID) (*dto.TryoutAnalyticsResponse, error)
	GetQuestionAnalytics(ctx context.Context, questionID uuid.UUID) (*dto.QuestionItemAnalysisResponse, error)
	GetCompetenciesAnalytics(ctx context.Context) (*dto.CompetencyAnalyticsResponse, error)
	GetDifficultyAnalytics(ctx context.Context) (*dto.DifficultyAnalyticsResponse, error)
	GetAdminOverview(ctx context.Context) (*dto.AdminOverviewAnalyticsResponse, error)
}

type reportingService struct {
	reportRepo ReportingRepository
	recService RecommendationService
}

// Ensure alias to repository interface for clean mock injection
type ReportingRepository = repository.ReportingRepository

func NewReportingService(reportRepo repository.ReportingRepository, recService RecommendationService) ReportingService {
	return &reportingService{
		reportRepo: reportRepo,
		recService: recService,
	}
}

func (s *reportingService) GetStudentReportCard(ctx context.Context, userID uuid.UUID) (*dto.StudentReportCardResponse, error) {
	summary, err := s.reportRepo.GetStudentSummary(ctx, userID)
	if err != nil {
		return nil, err
	}

	comps, err := s.reportRepo.GetStudentCompetencies(ctx, userID)
	if err != nil {
		return nil, err
	}

	strengths := make([]dto.CompetencyPerformanceItem, 0)
	improvements := make([]dto.CompetencyPerformanceItem, 0)

	for _, c := range comps {
		if c.Score >= 70.0 {
			strengths = append(strengths, c)
		} else if c.Score < 50.0 {
			improvements = append(improvements, c)
		}
	}

	summary.StrengthCount = len(strengths)
	summary.WeaknessCount = len(improvements)

	trend, err := s.reportRepo.GetStudentTrend(ctx, userID)
	if err != nil {
		return nil, err
	}

	trendStatus := "insufficient_data"
	if len(trend) >= 2 {
		first := trend[0].Score
		last := trend[len(trend)-1].Score
		diff := last - first
		if diff > 3.0 {
			trendStatus = "improving"
		} else if diff < -3.0 {
			trendStatus = "declining"
		} else {
			trendStatus = "stable"
		}
	}

	recs := make([]dto.RecommendationResponse, 0)
	if s.recService != nil {
		filter := dto.ListRecommendationFilter{Limit: 5, Offset: 0}
		if res, err := s.recService.GetStudentRecommendations(ctx, userID, filter); err == nil && res != nil {
			recs = res.Recommendations
		}
	}

	return &dto.StudentReportCardResponse{
		Summary:             *summary,
		Strengths:           strengths,
		AreasForImprovement: improvements,
		CompetencyBreakdown: comps,
		PerformanceTrend:    trend,
		TrendStatus:         trendStatus,
		Recommendations:     recs,
	}, nil
}

func (s *reportingService) GetTryoutAnalytics(ctx context.Context, tryoutID uuid.UUID) (*dto.TryoutAnalyticsResponse, error) {
	analytics, err := s.reportRepo.GetTryoutAnalytics(ctx, tryoutID)
	if err != nil {
		return nil, ErrTryoutNotFound
	}
	return analytics, nil
}

func (s *reportingService) GetQuestionAnalytics(ctx context.Context, questionID uuid.UUID) (*dto.QuestionItemAnalysisResponse, error) {
	analytics, err := s.reportRepo.GetQuestionAnalytics(ctx, questionID)
	if err != nil {
		return nil, ErrQuestionNotFound
	}
	return analytics, nil
}

func (s *reportingService) GetCompetenciesAnalytics(ctx context.Context) (*dto.CompetencyAnalyticsResponse, error) {
	comps, err := s.reportRepo.GetCompetenciesAnalytics(ctx)
	if err != nil {
		return nil, err
	}
	return &dto.CompetencyAnalyticsResponse{Competencies: comps}, nil
}

func (s *reportingService) GetDifficultyAnalytics(ctx context.Context) (*dto.DifficultyAnalyticsResponse, error) {
	diffs, err := s.reportRepo.GetDifficultyAnalytics(ctx)
	if err != nil {
		return nil, err
	}
	return &dto.DifficultyAnalyticsResponse{DifficultyLevels: diffs}, nil
}

func (s *reportingService) GetAdminOverview(ctx context.Context) (*dto.AdminOverviewAnalyticsResponse, error) {
	return s.reportRepo.GetAdminOverview(ctx)
}
