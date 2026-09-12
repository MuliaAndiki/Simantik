import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedSchoolsResponse } from '@/types/service';

export type SchoolCacheContext = {
  previousSchools?: PaginatedSchoolsResponse | null;
};

export function readSchoolSnapshot(ns: AppNameSpace): PaginatedSchoolsResponse | null | undefined {
  return ns.queryClient.getQueryData<PaginatedSchoolsResponse | null>(queryKey.school.list());
}
