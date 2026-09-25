import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type { UpdateUserRoleRequest, UpdateUserStatusRequest } from '@/types/service';
import { type AdminCacheContext, readAdminSnapshot } from '@/utils/cache/admin.cache';

export function useAdminUpdateUserStatus() {
  return useAppMutation<null, { id: string; body: UpdateUserStatusRequest }, AdminCacheContext>({
    mutationFn: ({ id, body }) => Api.admin.UpdateUserStatusService(id, body),
    invalidateKeys: [queryKey.adminRoot(), queryKey.userRoot()],
    optimistic: (ns) => ({ previousDashboard: readAdminSnapshot(ns) }),
  });
}

export function useAdminUpdateUserRole() {
  return useAppMutation<null, { id: string; body: UpdateUserRoleRequest }, AdminCacheContext>({
    mutationFn: ({ id, body }) => Api.admin.UpdateUserRoleService(id, body),
    invalidateKeys: [queryKey.adminRoot(), queryKey.userRoot()],
    optimistic: (ns) => ({ previousDashboard: readAdminSnapshot(ns) }),
  });
}
