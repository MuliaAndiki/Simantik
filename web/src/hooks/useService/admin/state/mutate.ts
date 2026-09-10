import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type { UpdateUserRoleRequest, UpdateUserStatusRequest } from '@/types/service';
import { type AdminCacheContext, readAdminSnapshot } from '@/utils/cache/admin.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useAdminUpdateUserStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<null>,
    Error,
    { id: string; body: UpdateUserStatusRequest },
    AdminCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserStatusRequest }) =>
      Api.admin.UpdateUserStatusService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.adminRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.adminRoot(),
      });
      const previousDashboard = readAdminSnapshot(ns);
      return { previousDashboard };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useAdminUpdateUserRole() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<null>,
    Error,
    { id: string; body: UpdateUserRoleRequest },
    AdminCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserRoleRequest }) =>
      Api.admin.UpdateUserRoleService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.adminRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.adminRoot(),
      });
      const previousDashboard = readAdminSnapshot(ns);
      return { previousDashboard };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
