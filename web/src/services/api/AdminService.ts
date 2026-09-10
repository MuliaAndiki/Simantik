import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  AdminDashboardStatsResponse,
  AdminUserDetailResponse,
  ListAdminUserFilter,
  PaginatedAdminUsersResponse,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from '@/types/service';
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class AdminService {
  public async GetDashboardService(): Promise<TResponse<AdminDashboardStatsResponse>> {
    const res = await getHttp().GetResponse<AdminDashboardStatsResponse>(
      EndpointEntry.admin.dashboard
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListUsersService(
    filter?: ListAdminUserFilter
  ): Promise<TResponse<PaginatedAdminUsersResponse>> {
    const url = buildQueryString(EndpointEntry.admin.users, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedAdminUsersResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetUserDetailService(id: string): Promise<TResponse<AdminUserDetailResponse>> {
    const res = await getHttp().GetResponse<AdminUserDetailResponse>(
      EndpointEntry.admin.userDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateUserStatusService(
    id: string,
    payload: UpdateUserStatusRequest
  ): Promise<TResponse<null>> {
    const res = await getHttp().PatchResponse<null>(
      EndpointEntry.admin.updateUserStatus(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateUserRoleService(
    id: string,
    payload: UpdateUserRoleRequest
  ): Promise<TResponse<null>> {
    const res = await getHttp().PatchResponse<null>(
      EndpointEntry.admin.updateUserRole(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new AdminService();
