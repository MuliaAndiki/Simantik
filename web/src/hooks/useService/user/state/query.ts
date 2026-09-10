import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  PaginatedUsersResponse,
  UserFilter,
  UserResponse,
  UserRolesResponse,
} from '@/types/service';

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.user.me(),
    queryFn: async () => {
      const res = await Api.user.GetMeService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useMyRoles(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.user.roles(),
    queryFn: async () => {
      const res = await Api.user.GetMyRolesService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useUserList(query?: UserFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.user.list(query),
    queryFn: async () => {
      const res = await Api.user.ListUsersService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useUserDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.user.detail(id),
    queryFn: async () => {
      const res = await Api.user.GetUserByIdService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}
