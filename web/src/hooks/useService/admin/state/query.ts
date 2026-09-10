import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  AdminDashboardStatsResponse,
  AdminUserDetailResponse,
  ListAdminUserFilter,
  PaginatedAdminUsersResponse,
} from '@/types/service';

export function useAdminDashboard(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.admin.dashboard(),
    queryFn: async () => {
      const res = await Api.admin.GetDashboardService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useAdminUserList(query?: ListAdminUserFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.admin.users(query),
    queryFn: async () => {
      const res = await Api.admin.ListUsersService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useAdminUserDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.admin.detail(id),
    queryFn: async () => {
      const res = await Api.admin.GetUserDetailService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}
