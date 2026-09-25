import type { ApiResponse, UserRole, UserStatus } from '../model';

export type { UserRole, UserStatus } from '../model';

// ============================================================================
// Admin Dashboard & Overview DTOs
// ============================================================================

/**
 * Activity feed item on the admin dashboard
 * Maps to backend: `dto.RecentAttemptItem`
 */
export interface RecentAttemptItem {
  attempt_id: string;
  user_id: string;
  student_name: string;
  student_email: string;
  tryout_title: string;
  score: number | null;
  status: string;
  submitted_at: string | null;
}

/**
 * Student academic profile for admin inspection
 * Maps to backend: `dto.StudentProfileResponse`
 */
export interface StudentProfileResponse {
  school: string;
  grade: string;
  major: string;
  target_university: string;
  target_major: string;
  bio: string;
}

/**
 * Aggregated platform metrics and KPIs for admin dashboard
 * Maps to backend: `dto.AdminDashboardStatsResponse`
 */
export interface AdminDashboardStatsResponse {
  total_students: number;
  total_questions: number;
  total_tryouts: number;
  total_modules: number;
  total_materials: number;
  total_attempts: number;
  completed_attempts: number;
  average_tryout_score: number;
  recent_activities: RecentAttemptItem[];
}

// ============================================================================
// Admin User Management DTOs
// ============================================================================

/**
 * User summary in admin user management table
 * Maps to backend: `dto.AdminUserListItem`
 */
export interface AdminUserListItem {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  is_email_verified: boolean;
  total_attempts: number;
  created_at: string;
  last_login_at: string | null;
}

/**
 * Comprehensive details about a user for administrators
 * Maps to backend: `dto.AdminUserDetailResponse`
 */
export interface AdminUserDetailResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
  is_email_verified: boolean;
  created_at: string;
  last_login_at: string | null;
  profile?: StudentProfileResponse;
  attempt_count: number;
  average_score: number;
  completed_materials_count: number;
}

/**
 * Query filter for administrator user management table
 * Maps to backend: `dto.ListAdminUserFilter`
 */
export interface ListAdminUserFilter {
  search?: string;
  role?: UserRole | string;
  status?: UserStatus | string;
  limit?: number;
  offset?: number;
}

/**
 * Paginated admin user list
 * Maps to backend: `dto.PaginatedAdminUsersResponse`
 */
export interface PaginatedAdminUsersResponse {
  users: AdminUserListItem[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Payload for changing user RBAC role
 * Maps to backend: `dto.UpdateUserRoleRequest`
 */
export interface UpdateUserRoleRequest {
  role: UserRole | string;
}

// ============================================================================
// Student Detailed Activity Log & Performance DTOs
// ============================================================================

/**
 * Activity log item for a specific student
 * Maps to backend: `dto.StudentActivityLogItem`
 */
export interface StudentActivityLogItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  formatted_time: string;
  score?: number | null;
}

/**
 * Data point for score progress curve
 * Maps to backend: `dto.StudentProgressChartPoint`
 */
export interface StudentProgressChartPoint {
  date: string;
  score: number;
  label: string;
}

/**
 * Diagnostic evaluation audit summary
 * Maps to backend: `dto.StudentAuditEvaluation`
 */
export interface StudentAuditEvaluation {
  evaluation_title: string;
  evaluation_date: string;
  result_status: string;
  test_domain: string;
  test_mode: string;
  score?: number | null;
  accuracy?: number | null;
}

/**
 * Aggregated student performance and progress curve
 * Maps to backend: `dto.StudentProgressResponse`
 */
export interface StudentProgressResponse {
  latest_score: number;
  previous_score: number;
  score_diff: number;
  trend_text: string;
  latest_practice_title: string;
  latest_practice_date: string;
  chart_data: StudentProgressChartPoint[];
  evaluation?: StudentAuditEvaluation;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type AdminDashboardStatsApiResponse = ApiResponse<AdminDashboardStatsResponse>;
export type AdminUserDetailApiResponse = ApiResponse<AdminUserDetailResponse>;
export type PaginatedAdminUsersApiResponse = ApiResponse<PaginatedAdminUsersResponse>;
export type StudentActivitiesApiResponse = ApiResponse<StudentActivityLogItem[]>;
export type StudentProgressApiResponse = ApiResponse<StudentProgressResponse>;
