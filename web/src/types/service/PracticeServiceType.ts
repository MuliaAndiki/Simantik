import type { ApiResponse } from '../model';
import type { OptionReviewResponse } from './EvaluationServiceType';
import type { CompetencyResponse, QuestionStudentResponse } from './QuestionServiceType';
import type { SchoolLevel } from './SchoolServiceType';

// ============================================================================
// Practice Package DTOs (Management & Catalog)
// ============================================================================

export interface CreatePracticePackageRequest {
  title: string;
  description?: string;
  competency_id?: string | null;
  jenjang: SchoolLevel;
}

export interface UpdatePracticePackageRequest {
  title?: string;
  description?: string;
  competency_id?: string | null;
  jenjang?: SchoolLevel;
  status?: string;
}

export interface AddPracticeQuestionsRequest {
  question_ids: string[];
}

export interface ListPracticePackageFilter {
  search?: string;
  status?: string;
  jenjang?: SchoolLevel | string;
  competency_id?: string;
  limit?: number;
  offset?: number;
}

export interface PracticePackageResponse {
  id: string;
  title: string;
  description: string;
  competency_id: string | null;
  competency_name?: string;
  competency_code?: string;
  jenjang: string;
  total_questions: number;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_completed?: boolean;
  latest_score?: number | null;
}

export interface PracticePackageDetailResponse extends PracticePackageResponse {
  questions: QuestionStudentResponse[];
}

export interface PaginatedPracticePackagesResponse {
  packages: PracticePackageResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Practice Attempt & Execution DTOs (Student)
// ============================================================================

export interface StartPracticeResponse {
  attempt_id: string;
  package_id: string;
  package_title: string;
  total_questions: number;
  started_at: string;
  status: string;
}

export interface PracticeAnswerItem {
  question_id: string;
  selected_option_id: string | null;
  answer_data: string;
  answered_at: string;
}

export interface PracticeAttemptDetailResponse {
  attempt_id: string;
  package_id: string;
  package_title: string;
  status: string;
  total_questions: number;
  answered_count: number;
  started_at: string;
  questions: QuestionStudentResponse[];
  answers: PracticeAnswerItem[];
}

export interface SubmitPracticeAnswerRequest {
  question_id: string;
  selected_option_id?: string | null;
  answer_data?: string;
}

export interface SubmitPracticeAnswerResponse {
  question_id: string;
  saved: boolean;
}

export interface AutoSubmitPracticeRequest {
  reason?: string;
  violation_count?: number;
  answers?: SubmitPracticeAnswerRequest[];
}

export interface CompletePracticeResponse {
  attempt_id: string;
  status: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  completed_at: string;
  evaluation_id?: string | null;
  is_auto_submitted?: boolean;
  auto_submit_reason?: string;
}

export interface PracticeAnswerReviewItem {
  question_number: number;
  question_id: string;
  question_text: string;
  competencies: CompetencyResponse[];
  options: OptionReviewResponse[];
  selected_option_id: string | null;
  answer_data: string;
  is_correct: boolean;
  score: number;
  explanation?: string;
  answering_tips?: string;
}

export interface PracticeResultResponse {
  attempt_id: string;
  package_id: string;
  package_title: string;
  status: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  started_at: string;
  completed_at: string | null;
  evaluation_id?: string | null;
  is_auto_submitted?: boolean;
  auto_submit_reason?: string;
  reviews: PracticeAnswerReviewItem[];
}

export interface MyPracticesFilter {
  package_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface PracticeAttemptSummaryResponse {
  attempt_id: string;
  package_id: string;
  package_title: string;
  status: string;
  score: number | null;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  completed_at: string | null;
}

export interface PaginatedPracticesResponse {
  practices: PracticeAttemptSummaryResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type PracticePackageApiResponse = ApiResponse<PracticePackageResponse>;
export type PracticePackageDetailApiResponse = ApiResponse<PracticePackageDetailResponse>;
export type PaginatedPracticePackagesApiResponse = ApiResponse<PaginatedPracticePackagesResponse>;
export type StartPracticeApiResponse = ApiResponse<StartPracticeResponse>;
export type PracticeAttemptDetailApiResponse = ApiResponse<PracticeAttemptDetailResponse>;
export type SubmitPracticeAnswerApiResponse = ApiResponse<SubmitPracticeAnswerResponse>;
export type CompletePracticeApiResponse = ApiResponse<CompletePracticeResponse>;
export type PracticeResultApiResponse = ApiResponse<PracticeResultResponse>;
export type PaginatedPracticesApiResponse = ApiResponse<PaginatedPracticesResponse>;
