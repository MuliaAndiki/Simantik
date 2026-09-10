import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  GenerateRecommendationsRequest,
  ListRecommendationFilter,
  PaginatedRecommendationsResponse,
  RecommendationResponse,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class RecommendationService {
  public async GenerateRecommendationsService(
    payload?: GenerateRecommendationsRequest
  ): Promise<TResponse<RecommendationResponse[]>> {
    const res = await getHttp().PostResponse<RecommendationResponse[]>(
      EndpointEntry.recommendation.generate,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async ListRecommendationsService(
    filter?: ListRecommendationFilter
  ): Promise<TResponse<PaginatedRecommendationsResponse>> {
    const url = buildQueryString(
      EndpointEntry.recommendation.recommendations,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedRecommendationsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DismissRecommendationService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.recommendation.dismiss(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new RecommendationService();
