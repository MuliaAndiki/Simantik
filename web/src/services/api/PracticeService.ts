import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  AddPracticeQuestionsRequest,
  AutoSubmitPracticeRequest,
  CompletePracticeResponse,
  CreatePracticePackageRequest,
  ListPracticePackageFilter,
  MyPracticesFilter,
  PaginatedPracticePackagesResponse,
  PaginatedPracticesResponse,
  PracticeAttemptDetailResponse,
  PracticePackageDetailResponse,
  PracticePackageResponse,
  PracticeResultResponse,
  StartPracticeResponse,
  SubmitPracticeAnswerRequest,
  SubmitPracticeAnswerResponse,
  SubmitPracticeRequest,
  UpdatePracticePackageRequest,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class PracticeService {
  // ─── Student Practice Catalog & Details ────────────────────────────────────

  public async ListPracticesService(
    filter?: ListPracticePackageFilter
  ): Promise<TResponse<PaginatedPracticePackagesResponse>> {
    const url = buildQueryString(
      EndpointEntry.practice.practices,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedPracticePackagesResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetPracticeService(id: string): Promise<TResponse<PracticePackageDetailResponse>> {
    const res = await getHttp().GetResponse<PracticePackageDetailResponse>(
      EndpointEntry.practice.practiceDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  // ─── Student Practice Execution ────────────────────────────────────────────

  public async StartPracticeService(id: string): Promise<TResponse<StartPracticeResponse>> {
    const res = await getHttp().PostResponse<StartPracticeResponse>(
      EndpointEntry.practice.startPractice(id)
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetAttemptStateService(
    attemptId: string
  ): Promise<TResponse<PracticeAttemptDetailResponse>> {
    const res = await getHttp().GetResponse<PracticeAttemptDetailResponse>(
      EndpointEntry.practice.attemptState(attemptId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async SubmitAnswerService(
    attemptId: string,
    payload: SubmitPracticeAnswerRequest
  ): Promise<TResponse<SubmitPracticeAnswerResponse>> {
    const res = await getHttp().PostResponse<SubmitPracticeAnswerResponse>(
      EndpointEntry.practice.submitAnswer(attemptId),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async SubmitPracticeService(
    attemptId: string,
    payload?: SubmitPracticeRequest
  ): Promise<TResponse<CompletePracticeResponse>> {
    const res = await getHttp().PostResponse<CompletePracticeResponse>(
      EndpointEntry.practice.submitPractice(attemptId),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async AutoSubmitPracticeService(
    attemptId: string,
    payload?: AutoSubmitPracticeRequest
  ): Promise<TResponse<CompletePracticeResponse>> {
    const res = await getHttp().PostResponse<CompletePracticeResponse>(
      EndpointEntry.practice.autoSubmit(attemptId),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetPracticeResultService(
    attemptId: string
  ): Promise<TResponse<PracticeResultResponse>> {
    const res = await getHttp().GetResponse<PracticeResultResponse>(
      EndpointEntry.practice.practiceResult(attemptId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListMyAttemptsService(
    filter?: MyPracticesFilter
  ): Promise<TResponse<PaginatedPracticesResponse>> {
    const url = buildQueryString(
      EndpointEntry.practice.attempts,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedPracticesResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  // ─── Management Packages (Admin / Content Manager) ─────────────────────────

  public async ListPackagesService(
    filter?: ListPracticePackageFilter
  ): Promise<TResponse<PaginatedPracticePackagesResponse>> {
    const url = buildQueryString(
      EndpointEntry.practice.packages,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedPracticePackagesResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreatePackageService(
    payload: CreatePracticePackageRequest
  ): Promise<TResponse<PracticePackageResponse>> {
    const res = await getHttp().PostResponse<PracticePackageResponse>(
      EndpointEntry.practice.packages,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetPackageService(id: string): Promise<TResponse<PracticePackageDetailResponse>> {
    const res = await getHttp().GetResponse<PracticePackageDetailResponse>(
      EndpointEntry.practice.packageDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdatePackageService(
    id: string,
    payload: UpdatePracticePackageRequest
  ): Promise<TResponse<PracticePackageResponse>> {
    const res = await getHttp().PatchResponse<PracticePackageResponse>(
      EndpointEntry.practice.packageDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdatePackageStatusService(
    id: string,
    status: string
  ): Promise<TResponse<PracticePackageResponse>> {
    const res = await getHttp().PatchResponse<PracticePackageResponse>(
      EndpointEntry.practice.packageStatus(id),
      { status }
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeletePackageService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.practice.packageDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async AddQuestionsService(
    id: string,
    payload: AddPracticeQuestionsRequest
  ): Promise<TResponse<PracticePackageDetailResponse>> {
    const res = await getHttp().PostResponse<PracticePackageDetailResponse>(
      EndpointEntry.practice.packageQuestions(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async RemoveQuestionService(id: string, questionId: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(
      EndpointEntry.practice.removePackageQuestion(id, questionId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new PracticeService();
