import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedPracticePackagesResponse } from '@/types/service';

export type PracticeCacheContext = {
  previousPractices?: PaginatedPracticePackagesResponse | null;
};

export const readPracticeSnapshot = (
  ns: AppNameSpace
): PaginatedPracticePackagesResponse | null => {
  return (
    ns.queryClient.getQueryData<PaginatedPracticePackagesResponse>(['practice', 'list']) ?? null
  );
};
