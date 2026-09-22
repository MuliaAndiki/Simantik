import type { ApiResponse, ContentStatus, TestimonialStatus } from '../model';

// ============================================================================
// News CMS DTOs
// ============================================================================

/**
 * Payload for creating news articles or announcements
 * Maps to backend: `dto.CreateNewsRequest`
 */
export interface CreateNewsRequest {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  thumbnailUrl?: string | null;
  status?: ContentStatus | string;
}

/**
 * Payload for updating news articles
 * Maps to backend: `dto.UpdateNewsRequest`
 */
export interface UpdateNewsRequest {
  title?: string;
  slug?: string;
  content?: string;
  thumbnailUrl?: string | null;
  status?: ContentStatus | string;
}

/**
 * Payload for changing news status (e.g. published, archived)
 * Maps to backend: `dto.UpdateNewsStatusRequest`
 */
export interface UpdateNewsStatusRequest {
  status: ContentStatus | string;
}

/**
 * News article representation
 * Maps to backend: `dto.NewsResponse`
 */
export interface NewsResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  status: string;
  publishedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query filter for searching news articles
 * Maps to backend: `dto.ListNewsFilter`
 */
export interface ListNewsFilter {
  search?: string;
  status?: ContentStatus | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated news response
 * Maps to backend: `dto.PaginatedNewsResponse`
 */
export interface PaginatedNewsResponse {
  news: NewsResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Documentation CMS DTOs
// ============================================================================

/**
 * Payload for creating documentation pages
 * Maps to backend: `dto.CreateDocumentationRequest`
 */
export interface CreateDocumentationRequest {
  title: string;
  slug?: string;
  content: string;
  category: string;
  status?: ContentStatus | string;
}

/**
 * Payload for updating documentation content
 * Maps to backend: `dto.UpdateDocumentationRequest`
 */
export interface UpdateDocumentationRequest {
  title?: string;
  slug?: string;
  content?: string;
  category?: string;
  status?: ContentStatus | string;
}

/**
 * Payload for updating documentation status
 * Maps to backend: `dto.UpdateDocumentationStatusRequest`
 */
export interface UpdateDocumentationStatusRequest {
  status: ContentStatus | string;
}

/**
 * Documentation page representation
 * Maps to backend: `dto.DocumentationResponse`
 */
export interface DocumentationResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query filter for documentation articles
 * Maps to backend: `dto.ListDocumentationFilter`
 */
export interface ListDocumentationFilter {
  search?: string;
  category?: string;
  status?: ContentStatus | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated documentation response
 * Maps to backend: `dto.PaginatedDocumentationResponse`
 */
export interface PaginatedDocumentationResponse {
  documentation: DocumentationResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Testimonial CMS DTOs
// ============================================================================

/**
 * Payload for submitting a student testimonial
 * Maps to backend: `dto.CreateTestimonialRequest`
 */
export interface CreateTestimonialRequest {
  authorName: string;
  authorRole?: string;
  content: string;
  rating: number; // 1 to 5
}

/**
 * Payload for moderation review of testimonials
 * Maps to backend: `dto.UpdateTestimonialStatusRequest`
 */
export interface UpdateTestimonialStatusRequest {
  status: TestimonialStatus | string;
}

/**
 * Testimonial item representation
 * Maps to backend: `dto.TestimonialResponse`
 */
export interface TestimonialResponse {
  id: string;
  userId: string | null;
  authorName: string;
  authorRole: string;
  content: string;
  rating: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query filter for testimonials
 * Maps to backend: `dto.ListTestimonialFilter`
 */
export interface ListTestimonialFilter {
  status?: TestimonialStatus | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated testimonials response
 * Maps to backend: `dto.PaginatedTestimonialsResponse`
 */
export interface PaginatedTestimonialsResponse {
  testimonials: TestimonialResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type NewsApiResponse = ApiResponse<NewsResponse>;
export type PaginatedNewsApiResponse = ApiResponse<PaginatedNewsResponse>;
export type DocumentationApiResponse = ApiResponse<DocumentationResponse>;
export type PaginatedDocumentationApiResponse = ApiResponse<PaginatedDocumentationResponse>;
export type TestimonialApiResponse = ApiResponse<TestimonialResponse>;
export type PaginatedTestimonialsApiResponse = ApiResponse<PaginatedTestimonialsResponse>;
