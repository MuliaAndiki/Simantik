import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  CreateSchoolRequest,
  ListSchoolFilter,
  PaginatedSchoolsResponse,
  ProposeSchoolRequest,
  RejectSchoolRequest,
  SchoolResponse,
  UpdateSchoolRequest,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class SchoolService {
  public async CreateSchoolService(
    payload: CreateSchoolRequest
  ): Promise<TResponse<SchoolResponse>> {
    const res = await getHttp().PostResponse<SchoolResponse>(EndpointEntry.school.create, payload);
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async ProposeSchoolService(
    payload: ProposeSchoolRequest
  ): Promise<TResponse<SchoolResponse>> {
    const res = await getHttp().PostResponse<SchoolResponse>(EndpointEntry.school.propose, payload);
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async ListMySchoolSubmissionsService(): Promise<TResponse<SchoolResponse[]>> {
    const res = await getHttp().GetResponse<SchoolResponse[]>(EndpointEntry.school.mySubmissions);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListSchoolsService(
    filter?: ListSchoolFilter
  ): Promise<TResponse<PaginatedSchoolsResponse>> {
    const url = buildQueryString(EndpointEntry.school.list, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedSchoolsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListSchoolsPublicService(
    filter?: ListSchoolFilter
  ): Promise<TResponse<PaginatedSchoolsResponse>> {
    const url = buildQueryString(
      EndpointEntry.school.listPublic,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedSchoolsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetSchoolService(id: string): Promise<TResponse<SchoolResponse>> {
    const res = await getHttp().GetResponse<SchoolResponse>(EndpointEntry.school.detail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateSchoolService(
    id: string,
    payload: UpdateSchoolRequest
  ): Promise<TResponse<SchoolResponse>> {
    const res = await getHttp().PatchResponse<SchoolResponse>(
      EndpointEntry.school.update(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async VerifySchoolService(id: string): Promise<TResponse<SchoolResponse>> {
    const res = await getHttp().PatchResponse<SchoolResponse>(EndpointEntry.school.verify(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async RejectSchoolService(
    id: string,
    payload: RejectSchoolRequest
  ): Promise<TResponse<SchoolResponse>> {
    const res = await getHttp().PatchResponse<SchoolResponse>(
      EndpointEntry.school.reject(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteSchoolService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.school.delete(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new SchoolService();
