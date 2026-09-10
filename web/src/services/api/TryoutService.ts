import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  AddTryoutQuestionsRequest,
  AttemptQuestionResponse,
  AttemptStatusResponse,
  CompleteAttemptResponse,
  CreateTryoutRequest,
  ListTryoutFilter,
  MyAttemptsFilter,
  PaginatedAttemptsResponse,
  PaginatedTryoutsResponse,
  PublishTryoutRequest,
  StartAttemptResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  TryoutDetailResponse,
  TryoutResponse,
  UpdateTryoutRequest,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class TryoutService {
  public async ListTryoutsService(
    filter?: ListTryoutFilter
  ): Promise<TResponse<PaginatedTryoutsResponse>> {
    const url = buildQueryString(EndpointEntry.tryout.tryouts, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedTryoutsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreateTryoutService(
    payload: CreateTryoutRequest
  ): Promise<TResponse<TryoutResponse>> {
    const res = await getHttp().PostResponse<TryoutResponse>(EndpointEntry.tryout.tryouts, payload);
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetTryoutService(id: string): Promise<TResponse<TryoutDetailResponse>> {
    const res = await getHttp().GetResponse<TryoutDetailResponse>(
      EndpointEntry.tryout.tryoutDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateTryoutService(
    id: string,
    payload: UpdateTryoutRequest
  ): Promise<TResponse<TryoutResponse>> {
    const res = await getHttp().PatchResponse<TryoutResponse>(
      EndpointEntry.tryout.tryoutDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateTryoutStatusService(
    id: string,
    payload: PublishTryoutRequest
  ): Promise<TResponse<TryoutResponse>> {
    const res = await getHttp().PatchResponse<TryoutResponse>(
      EndpointEntry.tryout.updateTryoutStatus(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteTryoutService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.tryout.tryoutDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async AddQuestionsService(
    id: string,
    payload: AddTryoutQuestionsRequest
  ): Promise<TResponse<TryoutDetailResponse>> {
    const res = await getHttp().PostResponse<TryoutDetailResponse>(
      EndpointEntry.tryout.addQuestions(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async RemoveQuestionService(id: string, questionId: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(
      EndpointEntry.tryout.removeQuestion(id, questionId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async StartAttemptService(id: string): Promise<TResponse<StartAttemptResponse>> {
    const res = await getHttp().PostResponse<StartAttemptResponse>(
      EndpointEntry.tryout.startAttempt(id)
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async ListMyAttemptsService(
    filter?: MyAttemptsFilter
  ): Promise<TResponse<PaginatedAttemptsResponse>> {
    const url = buildQueryString(EndpointEntry.tryout.attempts, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedAttemptsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetAttemptStatusService(
    attemptId: string
  ): Promise<TResponse<AttemptStatusResponse>> {
    const res = await getHttp().GetResponse<AttemptStatusResponse>(
      EndpointEntry.tryout.attemptStatus(attemptId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetAttemptQuestionService(
    attemptId: string,
    number: number | string
  ): Promise<TResponse<AttemptQuestionResponse>> {
    const res = await getHttp().GetResponse<AttemptQuestionResponse>(
      EndpointEntry.tryout.attemptQuestion(attemptId, number)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async SubmitAnswerService(
    attemptId: string,
    payload: SubmitAnswerRequest
  ): Promise<TResponse<SubmitAnswerResponse>> {
    const res = await getHttp().PostResponse<SubmitAnswerResponse>(
      EndpointEntry.tryout.submitAnswer(attemptId),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CompleteAttemptService(
    attemptId: string
  ): Promise<TResponse<CompleteAttemptResponse>> {
    const res = await getHttp().PostResponse<CompleteAttemptResponse>(
      EndpointEntry.tryout.completeAttempt(attemptId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new TryoutService();
