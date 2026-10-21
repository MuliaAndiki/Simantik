import type { ApiResponse } from '../model';

/**
 * Shared reading passage (stimulus wacana): 1 stimulus -> max 3 questions.
 * Maps to backend: `dto.StimulusResponse`
 */
export interface StimulusQuestionItem {
  id: string;
  difficulty_level: number;
}

export interface StimulusResponse {
  id: string;
  title: string;
  content: string;
  package_id?: string;
  package_kind?: 'tryout' | 'practice';
  question_count: number;
  levels_covered: number[];
  questions?: StimulusQuestionItem[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStimulusRequest {
  title: string;
  content: string;
  package_id?: string;
  package_kind?: 'tryout' | 'practice';
}

export interface UpdateStimulusRequest {
  title?: string;
  content?: string;
}

export interface ListStimulusFilter {
  search?: string;
  limit?: number;
  offset?: number;
  package_id?: string;
  package_kind?: 'tryout' | 'practice';
}

export interface PaginatedStimuliResponse {
  stimuli: StimulusResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface LinkStimulusQuestionResponse {
  stimulus_id: string;
  question_id: string;
  warning?: string;
}

export type StimulusApiResponse = ApiResponse<StimulusResponse>;
export type PaginatedStimuliApiResponse = ApiResponse<PaginatedStimuliResponse>;
