import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  AttemptReviewResponse,
  EvaluationResponse,
  ListEvaluationFilter,
  PaginatedEvaluationsResponse,
  StudentCompetencyProfileResponse,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class EvaluationService {
  public async GetCompetencyProfileService(): Promise<TResponse<StudentCompetencyProfileResponse>> {
    const res = await getHttp().GetResponse<StudentCompetencyProfileResponse>(
      EndpointEntry.evaluation.profile
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListMyEvaluationsService(
    filter?: ListEvaluationFilter
  ): Promise<TResponse<PaginatedEvaluationsResponse>> {
    const url = buildQueryString(
      EndpointEntry.evaluation.evaluations,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedEvaluationsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetEvaluationByIdService(id: string): Promise<TResponse<EvaluationResponse>> {
    const res = await getHttp().GetResponse<EvaluationResponse>(
      EndpointEntry.evaluation.evaluationDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetAttemptEvaluationService(
    attemptId: string
  ): Promise<TResponse<EvaluationResponse>> {
    const res = await getHttp().GetResponse<EvaluationResponse>(
      EndpointEntry.evaluation.attemptEvaluation(attemptId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetAttemptReviewService(
    attemptId: string
  ): Promise<TResponse<AttemptReviewResponse>> {
    const res = await getHttp().GetResponse<AttemptReviewResponse>(
      EndpointEntry.evaluation.attemptReview(attemptId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new EvaluationService();
