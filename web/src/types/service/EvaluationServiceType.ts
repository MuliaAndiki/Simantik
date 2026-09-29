import type { ApiResponse, EvaluationSourceType, PerformanceLevel } from '../model';
import type { CompetencyResponse } from './QuestionServiceType';

// ============================================================================
// Evaluation & Assessment Outcome DTOs
// ============================================================================

/**
 * Granular score and mastery level for a single competency
 * Maps to backend: `dto.CompetencyEvaluationResponse`
 */
export interface CompetencyEvaluationResponse {
  id: string;
  competency_id: string;
  competency_name: string;
  competency_code: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  accuracy: number;
  level: PerformanceLevel | string; // low, medium, high
}

/**
 * Assessment outcome summary and accuracy breakdown
 * Maps to backend: `dto.EvaluationResponse`
 */
export interface EvaluationResponse {
  id: string;
  user_id: string;
  source_type: EvaluationSourceType | string; // tryout, practice
  source_id: string;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  score: number;
  accuracy: number;
  created_at: string;
  competency_evaluations: CompetencyEvaluationResponse[];
}

/**
 * Query filter for evaluations
 * Maps to backend: `dto.ListEvaluationFilter`
 */
export interface ListEvaluationFilter {
  source_type?: EvaluationSourceType | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated evaluation history
 * Maps to backend: `dto.PaginatedEvaluationsResponse`
 */
export interface PaginatedEvaluationsResponse {
  evaluations: EvaluationResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Attempt Review & Pedagogical Feedback DTOs
// ============================================================================

/**
 * Option review item indicating correctness and whether student chose it
 * Maps to backend: `dto.OptionReviewResponse`
 */
export interface OptionReviewResponse {
  id: string;
  option_label: string;
  option_text: string;
  is_correct: boolean;
  is_selected: boolean;
  display_order: number;
}

/**
 * Question-by-question review data with explanation and tips
 * Maps to backend: `dto.QuestionReviewResponse`
 */
export interface QuestionReviewResponse {
  question_number: number;
  question_id: string;
  question_text: string;
  difficulty_level: number;
  competencies: CompetencyResponse[];
  options: OptionReviewResponse[];
  selected_option_id: string | null;
  answer_data: string;
  is_correct: boolean;
  score: number;
  response_time_seconds: number;
  explanation?: string;
  answering_tips?: string;
}

/**
 * Full pedagogical feedback and audit for a completed tryout attempt
 * Maps to backend: `dto.AttemptReviewResponse`
 */
export interface AttemptReviewResponse {
  attempt_id: string;
  tryout_id: string;
  tryout_title: string;
  score: number;
  accuracy: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  time_taken_seconds: number;
  started_at: string;
  submitted_at: string | null;
  evaluation_id?: string | null;
  competency_breakdown: CompetencyEvaluationResponse[];
  questions: QuestionReviewResponse[];
  student_name?: string;
  student_email?: string;
  student_nis?: string;
  student_school?: string;
  student_grade?: string;
}

// ============================================================================
// Student Competency Profile DTOs
// ============================================================================

/**
 * Competency mastery statistics across all assessments
 * Maps to backend: `dto.CompetencyMasteryItem`
 */
export interface CompetencyMasteryItem {
  competency_id: string;
  code: string;
  name: string;
  total_questions: number;
  total_correct: number;
  average_score: number;
  accuracy: number;
  level: string; // low, medium, high
  classification: string; // strength, weakness, developing
}

/**
 * Overall student competency profile identifying strengths and weaknesses
 * Maps to backend: `dto.StudentCompetencyProfileResponse`
 */
export interface StudentCompetencyProfileResponse {
  user_id: string;
  total_evaluations: number;
  overall_average_score: number;
  overall_accuracy: number;
  competencies: CompetencyMasteryItem[];
  strengths: string[];
  weaknesses: string[];
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type EvaluationApiResponse = ApiResponse<EvaluationResponse>;
export type PaginatedEvaluationsApiResponse = ApiResponse<PaginatedEvaluationsResponse>;
export type AttemptReviewApiResponse = ApiResponse<AttemptReviewResponse>;
export type StudentCompetencyProfileApiResponse = ApiResponse<StudentCompetencyProfileResponse>;
