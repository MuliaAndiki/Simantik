import type { ApiResponse } from '../model';
import type { RecommendationResponse } from './RecommendationServiceType';

// ============================================================================
// Student Report Card DTOs
// ============================================================================

/**
 * Competency performance breakdown in student report
 * Maps to backend: `dto.CompetencyPerformanceItem`
 */
export interface CompetencyPerformanceItem {
  competency_id: string;
  code: string;
  name: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  accuracy: number;
  performance_level: string; // low, medium, high
}

/**
 * Attempt trend point for score progression charting
 * Maps to backend: `dto.AttemptTrendItem`
 */
export interface AttemptTrendItem {
  attempt_id: string;
  tryout_id: string;
  tryout_title: string;
  score: number;
  accuracy: number;
  submitted_at: string | null;
}

/**
 * Summary metrics for student's overall learning journey
 * Maps to backend: `dto.StudentReportSummary`
 */
export interface StudentReportSummary {
  total_attempts: number;
  completed_tryouts: number;
  average_score: number;
  overall_accuracy: number;
  total_study_materials_completed: number;
  strength_count: number;
  weakness_count: number;
}

/**
 * Comprehensive student report card with trends and recommendations
 * Maps to backend: `dto.StudentReportCardResponse`
 */
export interface StudentReportCardResponse {
  summary: StudentReportSummary;
  strengths: CompetencyPerformanceItem[];
  areas_for_improvement: CompetencyPerformanceItem[];
  competency_breakdown: CompetencyPerformanceItem[];
  performance_trend: AttemptTrendItem[];
  trend_status: 'improving' | 'stable' | 'declining' | 'insufficient_data' | string;
  recommendations: RecommendationResponse[];
}

// ============================================================================
// Tryout Analytics DTOs
// ============================================================================

/**
 * Aggregated analytics for a tryout examination package
 * Maps to backend: `dto.TryoutAnalyticsResponse`
 */
export interface TryoutAnalyticsResponse {
  tryout_id: string;
  tryout_title: string;
  total_participants: number;
  total_completed: number;
  completion_rate: number;
  average_score: number;
  min_score: number;
  max_score: number;
  score_distribution: Record<string, number>;
  average_duration_seconds: number;
}

// ============================================================================
// Question Item Analysis DTOs
// ============================================================================

/**
 * Frequency breakdown of student choices for an option
 * Maps to backend: `dto.OptionChoiceCount`
 */
export interface OptionChoiceCount {
  option_label: string;
  option_text: string;
  is_correct: boolean;
  selected_count: number;
  percentage: number;
}

/**
 * Psychometric question item analysis (Difficulty Index, Option Distribution)
 * Maps to backend: `dto.QuestionItemAnalysisResponse`
 */
export interface QuestionItemAnalysisResponse {
  question_id: string;
  question_text: string;
  difficulty_level: number;
  total_attempts: number;
  correct_count: number;
  difficulty_index: number; // P-value: correct / total
  average_response_time_seconds: number;
  option_distribution: OptionChoiceCount[];
}

// ============================================================================
// Competency Analytics DTOs
// ============================================================================

/**
 * High-level performance stat for a competency across all students
 * Maps to backend: `dto.CompetencyStatItem`
 */
export interface CompetencyStatItem {
  competency_id: string;
  code: string;
  name: string;
  total_evaluations: number;
  average_score: number;
  high_performers_count: number;
  medium_performers_count: number;
  low_performers_count: number;
}

/**
 * Platform-wide competency analytics
 * Maps to backend: `dto.CompetencyAnalyticsResponse`
 */
export interface CompetencyAnalyticsResponse {
  competencies: CompetencyStatItem[];
}

// ============================================================================
// Difficulty Analytics DTOs
// ============================================================================

/**
 * Performance metrics categorized by difficulty level (1-5)
 * Maps to backend: `dto.DifficultyStatItem`
 */
export interface DifficultyStatItem {
  difficulty_level: number;
  total_questions_presented: number;
  total_correct: number;
  accuracy: number;
}

/**
 * Difficulty level distribution analytics
 * Maps to backend: `dto.DifficultyAnalyticsResponse`
 */
export interface DifficultyAnalyticsResponse {
  difficulty_levels: DifficultyStatItem[];
}

// ============================================================================
// Admin Platform Overview Analytics DTOs
// ============================================================================

/**
 * Daily exam attempt volume and average score
 * Maps to backend: `dto.DailyAttemptItem`
 */
export interface DailyAttemptItem {
  date: string;
  attempt_count: number;
  average_score: number;
}

/**
 * Platform executive overview metrics
 * Maps to backend: `dto.AdminOverviewAnalyticsResponse`
 */
export interface AdminOverviewAnalyticsResponse {
  total_students: number;
  active_students_last_30_days: number;
  total_attempts: number;
  completed_attempts: number;
  overall_pass_rate: number;
  average_score_platform: number;
  daily_attempt_trend: DailyAttemptItem[];
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type StudentReportCardApiResponse = ApiResponse<StudentReportCardResponse>;
export type TryoutAnalyticsApiResponse = ApiResponse<TryoutAnalyticsResponse>;
export type QuestionItemAnalysisApiResponse = ApiResponse<QuestionItemAnalysisResponse>;
export type CompetencyAnalyticsApiResponse = ApiResponse<CompetencyAnalyticsResponse>;
export type DifficultyAnalyticsApiResponse = ApiResponse<DifficultyAnalyticsResponse>;
export type AdminOverviewAnalyticsApiResponse = ApiResponse<AdminOverviewAnalyticsResponse>;
