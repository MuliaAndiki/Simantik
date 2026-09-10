import type { ApiResponse, AttemptStatus, ContentStatus } from '../model';
import type { QuestionStudentResponse } from './QuestionServiceType';

// ============================================================================
// Tryout Management Request Payloads (Admin / Content Manager)
// ============================================================================

/**
 * Payload for creating a new tryout package
 * Maps to backend: `dto.CreateTryoutRequest`
 */
export interface CreateTryoutRequest {
  title: string;
  description?: string;
  duration_seconds: number;
  total_questions: number;
}

/**
 * Payload for updating tryout metadata
 * Maps to backend: `dto.UpdateTryoutRequest`
 */
export interface UpdateTryoutRequest {
  title?: string;
  description?: string;
  duration_seconds?: number;
  total_questions?: number;
}

/**
 * Payload for changing tryout publication lifecycle status
 * Maps to backend: `dto.PublishTryoutRequest`
 */
export interface PublishTryoutRequest {
  status: ContentStatus | string;
}

/**
 * Payload for associating questions with a tryout pool
 * Maps to backend: `dto.AddTryoutQuestionsRequest`
 */
export interface AddTryoutQuestionsRequest {
  question_ids: string[];
}

/**
 * Payload for removing a question from a tryout pool
 * Maps to backend: `dto.RemoveTryoutQuestionRequest`
 */
export interface RemoveTryoutQuestionRequest {
  question_id: string;
}

/**
 * Query filter parameters for listing tryout packages
 * Maps to backend: `dto.ListTryoutFilter`
 */
export interface ListTryoutFilter {
  search?: string;
  status?: ContentStatus | string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Tryout Management Response Payloads
// ============================================================================

/**
 * Summary representation of a tryout package
 * Maps to backend: `dto.TryoutResponse`
 */
export interface TryoutResponse {
  id: string;
  title: string;
  description: string;
  duration_seconds: number;
  total_questions: number;
  status: string;
  start_at: string | null;
  end_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  pool_count: number;
}

/**
 * Question mapping item inside a tryout
 * Maps to backend: `dto.TryoutQuestionResponse`
 */
export interface TryoutQuestionResponse {
  question_id: string;
  display_order: number;
  score_weight: number;
}

/**
 * Detailed tryout representation including its question pool
 * Maps to backend: `dto.TryoutDetailResponse`
 */
export interface TryoutDetailResponse extends TryoutResponse {
  questions: TryoutQuestionResponse[];
}

/**
 * Paginated list of tryouts
 * Maps to backend: `dto.PaginatedTryoutsResponse`
 */
export interface PaginatedTryoutsResponse {
  tryouts: TryoutResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Tryout Attempt & Exam Execution Payloads (Student Facing)
// ============================================================================

/**
 * Response returned when student starts a timed tryout attempt
 * Maps to backend: `dto.StartAttemptResponse`
 */
export interface StartAttemptResponse {
  attempt_id: string;
  tryout_id: string;
  total_questions: number;
  duration_seconds: number;
  started_at: string;
  status: string;
}

/**
 * Student-facing active exam question payload
 * Maps to backend: `dto.AttemptQuestionResponse`
 */
export interface AttemptQuestionResponse {
  question_number: number;
  total_questions: number;
  question: QuestionStudentResponse;
}

/**
 * Payload for submitting an answer for a specific question
 * Maps to backend: `dto.SubmitAnswerRequest`
 */
export interface SubmitAnswerRequest {
  question_id: string;
  selected_option_id?: string | null;
  answer_data?: string;
  response_time_seconds?: number;
}

/**
 * Acknowledgement response after submitting an answer
 * Maps to backend: `dto.SubmitAnswerResponse`
 */
export interface SubmitAnswerResponse {
  question_id: string;
  submitted: boolean;
  remaining_seconds: number;
}

/**
 * Result returned upon completing / submitting the entire attempt
 * Maps to backend: `dto.CompleteAttemptResponse`
 */
export interface CompleteAttemptResponse {
  attempt_id: string;
  status: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  time_taken_seconds: number;
  evaluation_id: string;
}

/**
 * Real-time attempt status and timer synchronization
 * Maps to backend: `dto.AttemptStatusResponse`
 */
export interface AttemptStatusResponse {
  attempt_id: string;
  status: string;
  current_question_number: number;
  total_questions: number;
  duration_seconds: number;
  started_at: string;
  remaining_seconds: number;
  answered_count: number;
}

/**
 * Query filter for student's attempt history
 * Maps to backend: `dto.MyAttemptsFilter`
 */
export interface MyAttemptsFilter {
  tryout_id?: string;
  status?: AttemptStatus | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated attempt history
 * Maps to backend: `dto.PaginatedAttemptsResponse`
 */
export interface PaginatedAttemptsResponse {
  attempts: AttemptStatusResponse[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Safe student option choice
 * Maps to backend: `dto.OptionResponse`
 */
export interface OptionResponse {
  id: string;
  option_label: string;
  option_text: string;
  display_order: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type TryoutApiResponse = ApiResponse<TryoutResponse>;
export type TryoutDetailApiResponse = ApiResponse<TryoutDetailResponse>;
export type PaginatedTryoutsApiResponse = ApiResponse<PaginatedTryoutsResponse>;
export type StartAttemptApiResponse = ApiResponse<StartAttemptResponse>;
export type AttemptQuestionApiResponse = ApiResponse<AttemptQuestionResponse>;
export type SubmitAnswerApiResponse = ApiResponse<SubmitAnswerResponse>;
export type CompleteAttemptApiResponse = ApiResponse<CompleteAttemptResponse>;
export type AttemptStatusApiResponse = ApiResponse<AttemptStatusResponse>;
export type PaginatedAttemptsApiResponse = ApiResponse<PaginatedAttemptsResponse>;
