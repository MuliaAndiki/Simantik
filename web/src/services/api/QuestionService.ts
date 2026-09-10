import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  CompetencyResponse,
  CreateCompetencyRequest,
  CreateQuestionRequest,
  ListCompetencyFilter,
  ListQuestionFilter,
  PaginatedCompetenciesResponse,
  PaginatedQuestionsAdminResponse,
  PublishQuestionRequest,
  QuestionAdminResponse,
  QuestionTypeResponse,
  UpdateCompetencyRequest,
  UpdateQuestionRequest,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class QuestionService {
  public async ListCompetenciesService(
    filter?: ListCompetencyFilter
  ): Promise<TResponse<PaginatedCompetenciesResponse>> {
    const url = buildQueryString(
      EndpointEntry.question.competencies,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedCompetenciesResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreateCompetencyService(
    payload: CreateCompetencyRequest
  ): Promise<TResponse<CompetencyResponse>> {
    const res = await getHttp().PostResponse<CompetencyResponse>(
      EndpointEntry.question.competencies,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetCompetencyService(id: string): Promise<TResponse<CompetencyResponse>> {
    const res = await getHttp().GetResponse<CompetencyResponse>(
      EndpointEntry.question.competencyDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateCompetencyService(
    id: string,
    payload: UpdateCompetencyRequest
  ): Promise<TResponse<CompetencyResponse>> {
    const res = await getHttp().PatchResponse<CompetencyResponse>(
      EndpointEntry.question.competencyDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteCompetencyService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.question.competencyDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListQuestionTypesService(): Promise<TResponse<QuestionTypeResponse[]>> {
    const res = await getHttp().GetResponse<QuestionTypeResponse[]>(
      EndpointEntry.question.questionTypes
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListQuestionsService(
    filter?: ListQuestionFilter
  ): Promise<TResponse<PaginatedQuestionsAdminResponse>> {
    const url = buildQueryString(
      EndpointEntry.question.questions,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedQuestionsAdminResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreateQuestionService(
    payload: CreateQuestionRequest
  ): Promise<TResponse<QuestionAdminResponse>> {
    const res = await getHttp().PostResponse<QuestionAdminResponse>(
      EndpointEntry.question.questions,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetQuestionService(id: string): Promise<TResponse<QuestionAdminResponse>> {
    const res = await getHttp().GetResponse<QuestionAdminResponse>(
      EndpointEntry.question.questionDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateQuestionService(
    id: string,
    payload: UpdateQuestionRequest
  ): Promise<TResponse<QuestionAdminResponse>> {
    const res = await getHttp().PatchResponse<QuestionAdminResponse>(
      EndpointEntry.question.questionDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateQuestionStatusService(
    id: string,
    payload: PublishQuestionRequest
  ): Promise<TResponse<QuestionAdminResponse>> {
    const res = await getHttp().PatchResponse<QuestionAdminResponse>(
      EndpointEntry.question.updateQuestionStatus(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteQuestionService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.question.questionDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new QuestionService();
