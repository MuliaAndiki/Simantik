import type { ApiResponse, CompetencyStatus, ContentStatus } from '../model';

// ============================================================================
// Competency DTOs
// ============================================================================

/**
 * Payload for creating a new competency domain
 * Maps to backend: `dto.CreateCompetencyRequest`
 */
export interface CreateCompetencyRequest {
  code: string;
  name: string;
  description?: string;
}

/**
 * Payload for updating an existing competency
 * Maps to backend: `dto.UpdateCompetencyRequest`
 */
export interface UpdateCompetencyRequest {
  name: string;
  description?: string;
  status: CompetencyStatus | string;
}

/**
 * Competency domain details
 * Maps to backend: `dto.CompetencyResponse`
 */
export interface CompetencyResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Filter parameters for listing competencies
 * Maps to backend: `dto.ListCompetencyFilter`
 */
export interface ListCompetencyFilter {
  search?: string;
  status?: CompetencyStatus | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated competencies result
 * Maps to backend: `dto.PaginatedCompetenciesResponse`
 */
export interface PaginatedCompetenciesResponse {
  competencies: CompetencyResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Question Type DTOs
// ============================================================================

/**
 * Question format type definition
 * Maps to backend: `dto.QuestionTypeResponse`
 */
export interface QuestionTypeResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  created_at: string;
}

// ============================================================================
// Question Option DTOs
// ============================================================================

/**
 * Payload for creating an answer option
 * Maps to backend: `dto.CreateQuestionOptionRequest`
 */
export interface CreateQuestionOptionRequest {
  option_label: string;
  option_text: string;
  is_correct?: boolean;
  display_order?: number;
}

/**
 * Admin view of an option (includes answer key is_correct)
 * Maps to backend: `dto.QuestionOptionAdminResponse`
 */
export interface QuestionOptionAdminResponse {
  id: string;
  question_id: string;
  option_label: string;
  option_text: string;
  is_correct: boolean;
  display_order: number;
}

/**
 * Student-safe view of an option (excludes is_correct)
 * Maps to backend: `dto.QuestionOptionStudentResponse`
 */
export interface QuestionOptionStudentResponse {
  id: string;
  option_label: string;
  option_text: string;
  display_order: number;
}

// ============================================================================
// Question Explanation DTOs
// ============================================================================

/**
 * Payload for question pedagogical explanations
 * Maps to backend: `dto.CreateQuestionExplanationRequest`
 */
export interface CreateQuestionExplanationRequest {
  explanation?: string;
  answering_tips?: string;
}

/**
 * Explanation response data
 * Maps to backend: `dto.QuestionExplanationResponse`
 */
export interface QuestionExplanationResponse {
  id: string;
  question_id: string;
  explanation: string;
  answering_tips: string;
}

// ============================================================================
// Question Bank Core DTOs
// ============================================================================

/**
 * Payload for creating an assessment question
 * Maps to backend: `dto.CreateQuestionRequest`
 */
export interface CreateQuestionRequest {
  question_type_id: string;
  question_text: string;
  difficulty_level: number; // 1 to 5
  options: CreateQuestionOptionRequest[];
  competency_ids?: string[];
  explanation?: CreateQuestionExplanationRequest | null;
}

/**
 * Payload for updating question content and difficulty
 * Maps to backend: `dto.UpdateQuestionRequest`
 */
export interface UpdateQuestionRequest {
  question_text: string;
  difficulty_level: number;
  status: ContentStatus | string;
  competency_ids?: string[];
}

/**
 * Payload for changing question publication status
 * Maps to backend: `dto.PublishQuestionRequest`
 */
export interface PublishQuestionRequest {
  status: ContentStatus | string;
}

/**
 * Query filter for searching and browsing question bank
 * Maps to backend: `dto.ListQuestionFilter`
 */
export interface ListQuestionFilter {
  search?: string;
  status?: ContentStatus | string;
  question_type_id?: string;
  competency_id?: string;
  difficulty_level?: number;
  limit?: number;
  offset?: number;
}

/**
 * Comprehensive question representation for admin / educators
 * Maps to backend: `dto.QuestionAdminResponse`
 */
export interface QuestionAdminResponse {
  id: string;
  question_type_id: string;
  question_text: string;
  difficulty_level: number;
  status: string;
  options: QuestionOptionAdminResponse[];
  competencies: CompetencyResponse[];
  explanation?: QuestionExplanationResponse;
  created_at: string;
  updated_at: string;
}

/**
 * Student-safe question representation (without answer keys)
 * Maps to backend: `dto.QuestionStudentResponse`
 */
export interface QuestionStudentResponse {
  id: string;
  question_type_id: string;
  question_text: string;
  difficulty_level: number;
  options: QuestionOptionStudentResponse[];
  competencies: CompetencyResponse[];
}

/**
 * Paginated question bank results
 * Maps to backend: `dto.PaginatedQuestionsAdminResponse`
 */
export interface PaginatedQuestionsAdminResponse {
  questions: QuestionAdminResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type CompetencyApiResponse = ApiResponse<CompetencyResponse>;
export type PaginatedCompetenciesApiResponse = ApiResponse<PaginatedCompetenciesResponse>;
export type QuestionTypeApiResponse = ApiResponse<QuestionTypeResponse[]>;
export type QuestionAdminApiResponse = ApiResponse<QuestionAdminResponse>;
export type QuestionStudentApiResponse = ApiResponse<QuestionStudentResponse>;
export type PaginatedQuestionsApiResponse = ApiResponse<PaginatedQuestionsAdminResponse>;
