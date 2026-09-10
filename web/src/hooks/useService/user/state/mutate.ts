import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type {
  ChangePasswordRequest,
  UpdateAvatarRequest,
  UpdateMeRequest,
  UpdateUserStatusRequest,
  UserResponse,
} from '@/types/service';
import { readUserSnapshot, type UserCacheContext } from '@/utils/cache/user.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useUpdateProfile() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<UserResponse>, Error, UpdateMeRequest, UserCacheContext>({
    mutationFn: (body: UpdateMeRequest) => Api.user.UpdateMeService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.userRoot(),
      });
      const previousUser = readUserSnapshot(ns);
      return { previousUser };
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

export function useChangePassword() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, ChangePasswordRequest, UserCacheContext>({
    mutationFn: (body: ChangePasswordRequest) => Api.user.ChangePasswordService(body),
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

export function useUpdateAvatar() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<UserResponse>, Error, UpdateAvatarRequest, UserCacheContext>({
    mutationFn: (body: UpdateAvatarRequest) => Api.user.UpdateAvatarService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.userRoot(),
      });
      const previousUser = readUserSnapshot(ns);
      return { previousUser };
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

export function useUpdateUserStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<UserResponse>,
    Error,
    { id: string; body: UpdateUserStatusRequest },
    UserCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserStatusRequest }) =>
      Api.user.UpdateUserStatusService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
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
