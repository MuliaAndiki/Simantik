import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedRecommendationsResponse } from '@/types/service';

export type RecommendationCacheContext = {
  previousRecommendations?: PaginatedRecommendationsResponse | null;
};

export function readRecommendationSnapshot(
  ns: AppNameSpace
): PaginatedRecommendationsResponse | null | undefined {
  return ns.queryClient.getQueryData<PaginatedRecommendationsResponse | null>(
    queryKey.recommendation.list()
  );
}
