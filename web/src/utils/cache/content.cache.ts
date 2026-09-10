import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedNewsResponse } from '@/types/service';

export type ContentCacheContext = {
  previousNews?: PaginatedNewsResponse | null;
};

export function readContentSnapshot(ns: AppNameSpace): PaginatedNewsResponse | null | undefined {
  return ns.queryClient.getQueryData<PaginatedNewsResponse | null>(queryKey.content.news());
}
