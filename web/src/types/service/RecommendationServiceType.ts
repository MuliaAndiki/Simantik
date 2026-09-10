import type { ApiResponse, RecommendationPriority } from '../model';

// ============================================================================
// Recommendation Service DTOs
// ============================================================================

/**
 * Payload for requesting personalized learning recommendations
 * Maps to backend: `dto.GenerateRecommendationsRequest`
 */
export interface GenerateRecommendationsRequest {
  evaluation_id?: string | null;
}

/**
 * Targeted learning recommendation item
 * Maps to backend: `dto.RecommendationResponse`
 */
export interface RecommendationResponse {
  id: string;
  competency_id: string;
  competency_name: string;
  competency_code: string;
  evaluation_id?: string | null;
  material_id?: string | null;
  material_title?: string | null;
  recommendation_text: string;
  priority: RecommendationPriority | string; // high, medium, low
  created_at: string;
}

/**
 * Query filter for recommendations
 * Maps to backend: `dto.ListRecommendationFilter`
 */
export interface ListRecommendationFilter {
  priority?: RecommendationPriority | string;
  competency_id?: string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated recommendations response
 * Maps to backend: `dto.PaginatedRecommendationsResponse`
 */
export interface PaginatedRecommendationsResponse {
  recommendations: RecommendationResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type RecommendationApiResponse = ApiResponse<RecommendationResponse>;
export type PaginatedRecommendationsApiResponse = ApiResponse<PaginatedRecommendationsResponse>;
