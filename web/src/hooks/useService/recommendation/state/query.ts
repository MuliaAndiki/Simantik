import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type { ListRecommendationFilter } from '@/types/service';

export function useRecommendationList(
  query?: ListRecommendationFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.recommendation.list(query),
    queryFn: async () => {
      const res = await Api.recommendation.ListRecommendationsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}
