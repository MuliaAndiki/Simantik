import type { ApiResponse, UserRole, UserStatus } from '../model';
import type { SchoolLevel } from './SchoolServiceType';

// ============================================================================
// User Service Request Payloads
// ============================================================================

/**
 * Payload for updating authenticated user's own profile
 * Maps to backend: `dto.UpdateMeRequest`
 */
export interface UpdateMeRequest {
  fullName?: string;
  jenjang?: SchoolLevel;
}

/**
 * Payload for changing current user's password
 * Maps to backend: `dto.ChangePasswordRequest`
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Payload for updating user avatar URL
 * Maps to backend: `dto.UpdateAvatarRequest`
 */
export interface UpdateAvatarRequest {
  avatarURL: string;
}

/**
 * Payload for admin updating user account status
 * Maps to backend: `dto.UpdateUserStatusRequest`
 */
export interface UpdateUserStatusRequest {
  status: UserStatus | string;
}

/**
 * Query filter parameters for listing users
 * Maps to backend: `dto.UserFilter`
 */
export interface UserFilter {
  search?: string;
  status?: UserStatus | string;
  role?: UserRole | string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// User Service Response Payloads
// ============================================================================

/**
 * Safe, outward-facing representation of a User
 * Maps to backend: `dto.UserResponse`
 */
export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  otp?: string;
  avatarURL: string | null;
  role: string;
  status: string;
  hasSchool: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;

  studentProfile?: {
    schoolId?: string;
    school: string;
    grade: string;
    jenjang?: string;
    schoolJenjang?: string;
    effectiveJenjang?: string;
  };
}

/**
 * Sets the student's school on their profile (student role only)
 * Maps to backend: `dto.UpdateMySchoolRequest`
 */
export interface UpdateMySchoolRequest {
  schoolId: string;
}

/**
 * Exposes role and derived permissions for frontend RBAC
 * Maps to backend: `dto.UserRolesResponse`
 */
export interface UserRolesResponse {
  role: string;
  permissions: string[];
}

/**
 * Paginated user list with metadata
 * Maps to backend: `dto.PaginatedUsersResponse`
 */
export interface PaginatedUsersResponse {
  users: UserResponse[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type UserApiResponse = ApiResponse<UserResponse>;
export type UserRolesApiResponse = ApiResponse<UserRolesResponse>;
export type PaginatedUsersApiResponse = ApiResponse<PaginatedUsersResponse>;
