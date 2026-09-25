import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type { GenerateRecommendationsRequest, RecommendationResponse } from '@/types/service';
import {
  type RecommendationCacheContext,
  readRecommendationSnapshot,
} from '@/utils/cache/recommendation.cache';

export function useGenerateRecommendations() {
  return useAppMutation<
    RecommendationResponse[],
    GenerateRecommendationsRequest | undefined,
    RecommendationCacheContext
  >({
    mutationFn: (body?: GenerateRecommendationsRequest) =>
      Api.recommendation.GenerateRecommendationsService(body),
    invalidateKeys: [queryKey.recommendationRoot()],
    optimistic: (ns) => ({ previousRecommendations: readRecommendationSnapshot(ns) }),
  });
}

export function useDismissRecommendation() {
  return useAppMutation<null, string, RecommendationCacheContext>({
    mutationFn: (id: string) => Api.recommendation.DismissRecommendationService(id),
    invalidateKeys: [queryKey.recommendationRoot()],
  });
}
