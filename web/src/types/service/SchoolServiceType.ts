import { ApiResponse } from '@/server/type';

// ============================================================================
// School Service Types (Admin CRUD Master Data Sekolah)
// ============================================================================

/**
 * Jenjang pendidikan sekolah
 * Maps to backend: `models.SchoolLevel`
 */
export type SchoolLevel = 'sd' | 'smp' | 'sma' | 'smk';

/**
 * Status kepemilikan sekolah (negeri/swasta)
 * Maps to backend: `models.SchoolStatus`
 */
export type SchoolStatusType = 'negeri' | 'swasta';

/**
 * Status moderasi/verifikasi pengajuan sekolah
 * Maps to backend: `models.SchoolVerificationStatus`
 */
export type SchoolVerificationStatus = 'pending' | 'verified' | 'rejected';

/**
 * Payload for creating a school
 * Maps to backend: `dto.CreateSchoolRequest`
 */
export interface CreateSchoolRequest {
  npsn: string;
  nama: string;
  jenjang: SchoolLevel;
  status: SchoolStatusType;
  logo?: string;
  alamat: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Payload for submitting a school proposal by user/student
 * Maps to backend: `dto.ProposeSchoolRequest`
 */
export interface ProposeSchoolRequest extends CreateSchoolRequest {
  latitude: number;
  longitude: number;
}

/**
 * Payload for rejecting a school submission
 * Maps to backend: `dto.RejectSchoolRequest`
 */
export interface RejectSchoolRequest {
  reason: string;
}

/**
 * Payload for partially updating a school
 * Maps to backend: `dto.UpdateSchoolRequest`
 */
export interface UpdateSchoolRequest {
  npsn?: string;
  nama?: string;
  jenjang?: SchoolLevel;
  status?: SchoolStatusType;
  logo?: string;
  alamat?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Geocoded school/location item from /api/v1/geo/*
 * Maps to backend: `dto.GeoPlace`
 */
export interface GeoPlace {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
}

/**
 * Query filter for school management table
 * Maps to backend: `dto.ListSchoolFilter`
 */
export interface ListSchoolFilter {
  search?: string;
  jenjang?: SchoolLevel | string;
  status?: SchoolStatusType | string;
  verificationStatus?: SchoolVerificationStatus | 'all' | string;
  limit?: number;
  offset?: number;
}

/**
 * Global school verification counts summary for Admin dashboard/tabs
 * Maps to backend: `dto.SchoolVerificationSummary`
 */
export interface SchoolVerificationSummary {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  negeri: number;
  swasta: number;
  smaCount: number;
  smkCount: number;
}

/**
 * Safe, outward-facing representation of a School
 * Maps to backend: `dto.SchoolResponse`
 */
export interface SchoolResponse {
  id: string;
  npsn: string;
  nama: string;
  jenjang: string;
  status: string;
  logo: string | null;
  alamat: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  latitude?: number;
  longitude?: number;
  verificationStatus: SchoolVerificationStatus;
  submittedByUserId?: string;
  submittedByName?: string;
  submittedByEmail?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated school list
 * Maps to backend: `dto.PaginatedSchoolsResponse`
 */
export interface PaginatedSchoolsResponse {
  schools: SchoolResponse[];
  total: number;
  limit: number;
  offset: number;
  summary?: SchoolVerificationSummary;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type SchoolApiResponse = ApiResponse<SchoolResponse>;
export type PaginatedSchoolsApiResponse = ApiResponse<PaginatedSchoolsResponse>;
