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
}

/**
 * Query filter for school management table
 * Maps to backend: `dto.ListSchoolFilter`
 */
export interface ListSchoolFilter {
  search?: string;
  jenjang?: SchoolLevel | string;
  status?: SchoolStatusType | string;
  limit?: number;
  offset?: number;
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
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type SchoolApiResponse = ApiResponse<SchoolResponse>;
export type PaginatedSchoolsApiResponse = ApiResponse<PaginatedSchoolsResponse>;
