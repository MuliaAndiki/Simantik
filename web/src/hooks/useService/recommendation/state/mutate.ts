import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type { GenerateRecommendationsRequest, RecommendationResponse } from '@/types/service';
import {
  type RecommendationCacheContext,
  readRecommendationSnapshot,
} from '@/utils/cache/recommendation.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useGenerateRecommendations() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<RecommendationResponse[]>,
    Error,
    GenerateRecommendationsRequest | undefined,
    RecommendationCacheContext
  >({
    mutationFn: (body?: GenerateRecommendationsRequest) =>
      Api.recommendation.GenerateRecommendationsService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.recommendationRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.recommendationRoot(),
      });
      const previousRecommendations = readRecommendationSnapshot(ns);
      return { previousRecommendations };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDismissRecommendation() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, RecommendationCacheContext>({
    mutationFn: (id: string) => Api.recommendation.DismissRecommendationService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.recommendationRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
