import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  ChangePasswordRequest,
  PaginatedUsersResponse,
  UpdateAvatarRequest,
  UpdateMeRequest,
  UpdateUserStatusRequest,
  UserFilter,
  UserResponse,
  UserRolesResponse,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class UserService {
  public async GetMeService(): Promise<TResponse<UserResponse>> {
    const res = await getHttp().GetResponse<UserResponse>(EndpointEntry.user.getProfile);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateMeService(payload: UpdateMeRequest): Promise<TResponse<UserResponse>> {
    const res = await getHttp().PatchResponse<UserResponse>(
      EndpointEntry.user.updateProfile,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ChangePasswordService(payload: ChangePasswordRequest): Promise<TResponse<null>> {
    const res = await getHttp().PatchResponse<null>(EndpointEntry.user.changePassword, payload);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateAvatarService(payload: UpdateAvatarRequest): Promise<TResponse<UserResponse>> {
    const res = await getHttp().PatchResponse<UserResponse>(
      EndpointEntry.user.updateAvatars,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetMyRolesService(): Promise<TResponse<UserRolesResponse>> {
    const res = await getHttp().GetResponse<UserRolesResponse>(EndpointEntry.user.getRole);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListUsersService(filter?: UserFilter): Promise<TResponse<PaginatedUsersResponse>> {
    const url = buildQueryString(EndpointEntry.user.adminGet, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedUsersResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetUserByIdService(id: string): Promise<TResponse<UserResponse>> {
    const res = await getHttp().GetResponse<UserResponse>(EndpointEntry.user.adminGetById(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateUserStatusService(
    id: string,
    payload: UpdateUserStatusRequest
  ): Promise<TResponse<UserResponse>> {
    const res = await getHttp().PatchResponse<UserResponse>(
      EndpointEntry.user.adminPatch(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new UserService();
