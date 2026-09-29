import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  CreateLearningModuleRequest,
  CreateMaterialRequest,
  LearningModuleDetailResponse,
  LearningModuleResponse,
  LearningProgressResponse,
  ListMaterialActivityFilter,
  ListMaterialFilter,
  ListModuleFilter,
  MaterialResponse,
  MaterialStudentActivitiesResponse,
  ModuleProgressSummaryResponse,
  PaginatedMaterialsResponse,
  PaginatedModulesResponse,
  UpdateLearningModuleRequest,
  UpdateMaterialRequest,
  UpdateProgressRequest,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class LearningService {
  public async ListModulesService(
    filter?: ListModuleFilter
  ): Promise<TResponse<PaginatedModulesResponse>> {
    const url = buildQueryString(EndpointEntry.learning.modules, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedModulesResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListModuleLabelsService(): Promise<TResponse<string[]>> {
    const res = await getHttp().GetResponse<string[]>(EndpointEntry.learning.moduleLabels);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreateModuleService(
    payload: CreateLearningModuleRequest
  ): Promise<TResponse<LearningModuleResponse>> {
    const res = await getHttp().PostResponse<LearningModuleResponse>(
      EndpointEntry.learning.modules,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetModuleService(id: string): Promise<TResponse<LearningModuleDetailResponse>> {
    const res = await getHttp().GetResponse<LearningModuleDetailResponse>(
      EndpointEntry.learning.moduleDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateModuleService(
    id: string,
    payload: UpdateLearningModuleRequest
  ): Promise<TResponse<LearningModuleResponse>> {
    const res = await getHttp().PatchResponse<LearningModuleResponse>(
      EndpointEntry.learning.moduleDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateModuleStatusService(
    id: string,
    status: string
  ): Promise<TResponse<LearningModuleResponse>> {
    const res = await getHttp().PatchResponse<LearningModuleResponse>(
      EndpointEntry.learning.moduleStatus(id),
      { status }
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteModuleService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.learning.moduleDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetModuleProgressService(
    id: string
  ): Promise<TResponse<ModuleProgressSummaryResponse>> {
    const res = await getHttp().GetResponse<ModuleProgressSummaryResponse>(
      EndpointEntry.learning.moduleProgress(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListMaterialsService(
    filter?: ListMaterialFilter
  ): Promise<TResponse<PaginatedMaterialsResponse>> {
    const url = buildQueryString(
      EndpointEntry.learning.materials,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedMaterialsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreateMaterialService(
    payload: CreateMaterialRequest
  ): Promise<TResponse<MaterialResponse>> {
    const res = await getHttp().PostResponse<MaterialResponse>(
      EndpointEntry.learning.materials,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetMaterialService(id: string): Promise<TResponse<MaterialResponse>> {
    const res = await getHttp().GetResponse<MaterialResponse>(
      EndpointEntry.learning.materialDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateMaterialService(
    id: string,
    payload: UpdateMaterialRequest
  ): Promise<TResponse<MaterialResponse>> {
    const res = await getHttp().PatchResponse<MaterialResponse>(
      EndpointEntry.learning.materialDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateMaterialStatusService(
    id: string,
    status: string
  ): Promise<TResponse<MaterialResponse>> {
    const res = await getHttp().PatchResponse<MaterialResponse>(
      EndpointEntry.learning.materialStatus(id),
      { status }
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteMaterialService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.learning.materialDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async MarkMaterialProgressService(
    id: string,
    payload: UpdateProgressRequest
  ): Promise<TResponse<LearningProgressResponse>> {
    const res = await getHttp().PostResponse<LearningProgressResponse>(
      EndpointEntry.learning.materialProgress(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListMyProgressService(): Promise<TResponse<LearningProgressResponse[]>> {
    const res = await getHttp().GetResponse<LearningProgressResponse[]>(
      EndpointEntry.learning.myProgress
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetMaterialStudentActivitiesService(
    id: string,
    filter?: ListMaterialActivityFilter
  ): Promise<TResponse<MaterialStudentActivitiesResponse>> {
    const url = buildQueryString(
      EndpointEntry.learning.materialActivities(id),
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<MaterialStudentActivitiesResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new LearningService();
