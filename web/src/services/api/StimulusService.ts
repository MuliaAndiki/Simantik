import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  CreateStimulusRequest,
  LinkStimulusQuestionResponse,
  PaginatedStimuliResponse,
  StimulusResponse,
  UpdateStimulusRequest,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class StimulusService {
  public async ListStimuliService(filter?: {
    search?: string;
    limit?: number;
    offset?: number;
    package_id?: string;
    package_kind?: 'tryout' | 'practice';
  }): Promise<TResponse<PaginatedStimuliResponse>> {
    const url = buildQueryString(EndpointEntry.stimulus.list, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedStimuliResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetStimulusService(id: string): Promise<TResponse<StimulusResponse>> {
    const res = await getHttp().GetResponse<StimulusResponse>(EndpointEntry.stimulus.detail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreateStimulusService(
    payload: CreateStimulusRequest
  ): Promise<TResponse<StimulusResponse>> {
    const res = await getHttp().PostResponse<StimulusResponse>(
      EndpointEntry.stimulus.list,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async UpdateStimulusService(
    id: string,
    payload: UpdateStimulusRequest
  ): Promise<TResponse<StimulusResponse>> {
    const res = await getHttp().PatchResponse<StimulusResponse>(
      EndpointEntry.stimulus.detail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteStimulusService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.stimulus.detail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async LinkQuestionService(
    id: string,
    questionId: string
  ): Promise<TResponse<LinkStimulusQuestionResponse>> {
    const res = await getHttp().PostResponse<LinkStimulusQuestionResponse>(
      EndpointEntry.stimulus.linkQuestion(id),
      { question_id: questionId }
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UnlinkQuestionService(questionId: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(
      EndpointEntry.stimulus.unlinkQuestion(questionId)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new StimulusService();
