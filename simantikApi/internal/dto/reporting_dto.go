package dto

import (
	"time"

	"github.com/google/uuid"
)

// ─── Student Report DTOs ─────────────────────────────────────────────────────

type CompetencyPerformanceItem struct {
	CompetencyID     uuid.UUID `json:"competency_id"`
	Code             string    `json:"code"`
	Name             string    `json:"name"`
	TotalQuestions   int       `json:"total_questions"`
	CorrectAnswers   int       `json:"correct_answers"`
	Score            float64   `json:"score"`
	Accuracy         float64   `json:"accuracy"`
	PerformanceLevel string    `json:"performance_level"` // low, medium, high
}

type AttemptTrendItem struct {
	AttemptID   uuid.UUID  `json:"attempt_id"`
	TryoutID    uuid.UUID  `json:"tryout_id"`
	TryoutTitle string     `json:"tryout_title"`
	Score       float64    `json:"score"`
	Accuracy    float64    `json:"accuracy"`
	SubmittedAt *time.Time `json:"submitted_at"`
}

type StudentReportSummary struct {
	TotalAttempts                int64   `json:"total_attempts"`
	CompletedTryouts             int64   `json:"completed_tryouts"`
	AverageScore                 float64 `json:"average_score"`
	OverallAccuracy              float64 `json:"overall_accuracy"`
	TotalStudyMaterialsCompleted int64   `json:"total_study_materials_completed"`
	StrengthCount                int     `json:"strength_count"`
	WeaknessCount                int     `json:"weakness_count"`
}

type StudentReportCardResponse struct {
	Summary             StudentReportSummary        `json:"summary"`
	Strengths           []CompetencyPerformanceItem `json:"strengths"`
	AreasForImprovement []CompetencyPerformanceItem `json:"areas_for_improvement"`
	CompetencyBreakdown []CompetencyPerformanceItem `json:"competency_breakdown"`
	PerformanceTrend    []AttemptTrendItem          `json:"performance_trend"`
	TrendStatus         string                      `json:"trend_status"` // improving, stable, declining, insufficient_data
	Recommendations     []RecommendationResponse    `json:"recommendations"`
}

// ─── Tryout Analytics DTOs ───────────────────────────────────────────────────

type TryoutAnalyticsResponse struct {
	TryoutID               uuid.UUID        `json:"tryout_id"`
	TryoutTitle            string           `json:"tryout_title"`
	TotalParticipants      int64            `json:"total_participants"`
	TotalCompleted         int64            `json:"total_completed"`
	CompletionRate         float64          `json:"completion_rate"`
	AverageScore           float64          `json:"average_score"`
	MinScore               float64          `json:"min_score"`
	MaxScore               float64          `json:"max_score"`
	ScoreDistribution      map[string]int64 `json:"score_distribution"` // e.g. "0-20": 5, "21-40": 12, ...
	AverageDurationSeconds float64          `json:"average_duration_seconds"`
}

// ─── Question Item Analysis DTOs ─────────────────────────────────────────────

type OptionChoiceCount struct {
	OptionLabel   string  `json:"option_label"`
	OptionText    string  `json:"option_text"`
	IsCorrect     bool    `json:"is_correct"`
	SelectedCount int64   `json:"selected_count"`
	Percentage    float64 `json:"percentage"`
}

type QuestionItemAnalysisResponse struct {
	QuestionID                 uuid.UUID           `json:"question_id"`
	QuestionText               string              `json:"question_text"`
	DifficultyLevel            int                 `json:"difficulty_level"`
	TotalAttempts              int64               `json:"total_attempts"`
	CorrectCount               int64               `json:"correct_count"`
	DifficultyIndex            float64             `json:"difficulty_index"` // P-value: correct / total
	AverageResponseTimeSeconds float64             `json:"average_response_time_seconds"`
	OptionDistribution         []OptionChoiceCount `json:"option_distribution"`
}

// ─── Competency Analytics DTOs ───────────────────────────────────────────────

type CompetencyStatItem struct {
	CompetencyID          uuid.UUID `json:"competency_id"`
	Code                  string    `json:"code"`
	Name                  string    `json:"name"`
	TotalEvaluations      int64     `json:"total_evaluations"`
	AverageScore          float64   `json:"average_score"`
	HighPerformersCount   int64     `json:"high_performers_count"`
	MediumPerformersCount int64     `json:"medium_performers_count"`
	LowPerformersCount    int64     `json:"low_performers_count"`
}

type CompetencyAnalyticsResponse struct {
	Competencies []CompetencyStatItem `json:"competencies"`
}

// ─── Difficulty Analytics DTOs ───────────────────────────────────────────────

type DifficultyStatItem struct {
	DifficultyLevel         int     `json:"difficulty_level"`
	TotalQuestionsPresented int64   `json:"total_questions_presented"`
	TotalCorrect            int64   `json:"total_correct"`
	Accuracy                float64 `json:"accuracy"`
}

type DifficultyAnalyticsResponse struct {
	DifficultyLevels []DifficultyStatItem `json:"difficulty_levels"`
}

// ─── Admin Overview Analytics DTOs ───────────────────────────────────────────

type DailyAttemptItem struct {
	Date         string  `json:"date"`
	AttemptCount int64   `json:"attempt_count"`
	AverageScore float64 `json:"average_score"`
}

type AdminOverviewAnalyticsResponse struct {
	TotalStudents            int64              `json:"total_students"`
	ActiveStudentsLast30Days int64              `json:"active_students_last_30_days"`
	TotalAttempts            int64              `json:"total_attempts"`
	CompletedAttempts        int64              `json:"completed_attempts"`
	OverallPassRate          float64            `json:"overall_pass_rate"` // % with score >= 60
	AverageScorePlatform     float64            `json:"average_score_platform"`
	DailyAttemptTrend        []DailyAttemptItem `json:"daily_attempt_trend"`
}

