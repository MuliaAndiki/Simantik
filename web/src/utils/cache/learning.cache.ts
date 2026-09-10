import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedModulesResponse } from '@/types/service';

export type LearningCacheContext = {
  previousModules?: PaginatedModulesResponse | null;
};

export function readLearningSnapshot(
  ns: AppNameSpace
): PaginatedModulesResponse | null | undefined {
  return ns.queryClient.getQueryData<PaginatedModulesResponse | null>(queryKey.learning.modules());
}
