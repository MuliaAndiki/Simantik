import type { ApiResponse, ContentStatus, MaterialType } from '../model';
import type { SchoolLevel } from './SchoolServiceType';

// ============================================================================
// Learning Module DTOs
// ============================================================================

/**
 * Payload for creating a learning module
 * Maps to backend: `dto.CreateLearningModuleRequest`
 */
export interface CreateLearningModuleRequest {
  title: string;
  description?: string;
  label?: string;
  jenjang: SchoolLevel;
  display_order?: number;
}

/**
 * Payload for updating an existing learning module
 * Maps to backend: `dto.UpdateLearningModuleRequest`
 */
export interface UpdateLearningModuleRequest {
  title?: string;
  description?: string;
  label?: string;
  jenjang?: SchoolLevel;
  display_order?: number;
  status?: ContentStatus | string;
}

/**
 * Summary representation of a learning module
 * Maps to backend: `dto.LearningModuleResponse`
 */
export interface LearningModuleResponse {
  id: string;
  title: string;
  description: string;
  label?: string;
  jenjang: string;
  display_order: number;
  status: string;
  materials_count: number;
  completed_count: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

/**
 * Condensed material item inside a module detail response
 * Maps to backend: `dto.MaterialSummaryResponse`
 */
export interface MaterialSummaryResponse {
  id: string;
  title: string;
  type: MaterialType | string;
  display_order: number;
  competency_id?: string | null;
  status: string;
  is_completed: boolean;
}

/**
 * Detailed module response including nested materials
 * Maps to backend: `dto.LearningModuleDetailResponse`
 */
export interface LearningModuleDetailResponse extends LearningModuleResponse {
  materials: MaterialSummaryResponse[];
}

/**
 * Filter parameters for querying learning modules
 * Maps to backend: `dto.ListModuleFilter`
 */
export interface ListModuleFilter {
  search?: string;
  label?: string;
  jenjang?: SchoolLevel | string;
  status?: ContentStatus | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated list of modules
 * Maps to backend: `dto.PaginatedModulesResponse`
 */
export interface PaginatedModulesResponse {
  modules: LearningModuleResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Material DTOs
// ============================================================================

/**
 * Payload for creating a new learning material
 * Maps to backend: `dto.CreateMaterialRequest`
 */
export interface CreateMaterialRequest {
  module_id: string;
  competency_id?: string | null;
  title: string;
  description?: string;
  content: string;
  type: MaterialType | string;
  display_order?: number;
}

/**
 * Payload for updating learning material content
 * Maps to backend: `dto.UpdateMaterialRequest`
 */
export interface UpdateMaterialRequest {
  competency_id?: string | null;
  title?: string;
  description?: string;
  content?: string;
  type?: MaterialType | string;
  display_order?: number;
  status?: ContentStatus | string;
}

/**
 * Full details of a learning material
 * Maps to backend: `dto.MaterialResponse`
 */
export interface MaterialResponse {
  id: string;
  module_id: string;
  competency_id?: string | null;
  competency_name?: string | null;
  title: string;
  description: string;
  content: string;
  type: string;
  display_order: number;
  status: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Query filter for searching and listing materials
 * Maps to backend: `dto.ListMaterialFilter`
 */
export interface ListMaterialFilter {
  module_id?: string;
  competency_id?: string;
  status?: ContentStatus | string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated materials response
 * Maps to backend: `dto.PaginatedMaterialsResponse`
 */
export interface PaginatedMaterialsResponse {
  materials: MaterialResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Learning Progress DTOs
// ============================================================================

/**
 * Payload for updating completion status of a material
 * Maps to backend: `dto.UpdateProgressRequest`
 */
export interface UpdateProgressRequest {
  is_completed: boolean;
}

/**
 * Progress status of a single material
 * Maps to backend: `dto.LearningProgressResponse`
 */
export interface LearningProgressResponse {
  material_id: string;
  is_completed: boolean;
  completed_at?: string | null;
}

/**
 * Summary of a student's completion progress across an entire module
 * Maps to backend: `dto.ModuleProgressSummaryResponse`
 */
export interface ModuleProgressSummaryResponse {
  module_id: string;
  module_title: string;
  total_materials: number;
  completed_materials: number;
  progress_percentage: number;
}

// ============================================================================
// Material Student Activity & Inspection DTOs
// ============================================================================

export interface MaterialAccessLogItem {
  session_number: number;
  title: string;
  timestamp: string;
  formatted_time: string;
}

export interface MaterialStudentActivityItem {
  user_id: string;
  nis: string;
  student_name: string;
  student_email: string;
  school: string;
  grade: string;
  is_accessed: boolean;
  last_accessed_at?: string | null;
  formatted_last_accessed: string;
  access_count: number;
  device_browser: string;
  logs: MaterialAccessLogItem[];
}

export interface MaterialStudentActivitiesResponse {
  material_id: string;
  material_title: string;
  module_id: string;
  module_name: string;
  competency_name: string;
  status: string;
  total_students: number;
  accessed_students: number;
  unaccessed_students: number;
  participation_rate: number;
  last_updated_at: string;
  students: MaterialStudentActivityItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListMaterialActivityFilter {
  search?: string;
  status?: 'all' | 'accessed' | 'unaccessed' | string;
  sort?: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type LearningModuleApiResponse = ApiResponse<LearningModuleResponse>;
export type LearningModuleDetailApiResponse = ApiResponse<LearningModuleDetailResponse>;
export type PaginatedModulesApiResponse = ApiResponse<PaginatedModulesResponse>;
export type MaterialApiResponse = ApiResponse<MaterialResponse>;
export type PaginatedMaterialsApiResponse = ApiResponse<PaginatedMaterialsResponse>;
export type LearningProgressApiResponse = ApiResponse<LearningProgressResponse>;
export type ModuleProgressSummaryApiResponse = ApiResponse<ModuleProgressSummaryResponse>;
export type MaterialStudentActivitiesApiResponse = ApiResponse<MaterialStudentActivitiesResponse>;
