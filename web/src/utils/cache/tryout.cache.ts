import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedTryoutsResponse } from '@/types/service';

export type TryoutCacheContext = {
  previousTryouts?: PaginatedTryoutsResponse | null;
};

export function readTryoutSnapshot(ns: AppNameSpace): PaginatedTryoutsResponse | null | undefined {
  return ns.queryClient.getQueryData<PaginatedTryoutsResponse | null>(queryKey.tryout.list());
}
