import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type {
  ChangePasswordRequest,
  UpdateAvatarRequest,
  UpdateMeRequest,
  UpdateMySchoolRequest,
  UpdateUserStatusRequest,
  UserResponse,
} from '@/types/service';
import { readUserSnapshot, type UserCacheContext } from '@/utils/cache/user.cache';

export function useUpdateProfile() {
  return useAppMutation<UserResponse, UpdateMeRequest, UserCacheContext>({
    mutationFn: (body: UpdateMeRequest) => Api.user.UpdateMeService(body),
    invalidateKeys: [queryKey.userRoot()],
    optimistic: (ns) => ({ previousUser: readUserSnapshot(ns) }),
  });
}

export function useUpdateMySchool() {
  return useAppMutation<UserResponse, UpdateMySchoolRequest, UserCacheContext>({
    mutationFn: (body: UpdateMySchoolRequest) => Api.user.UpdateMySchoolService(body),
    invalidateKeys: [queryKey.userRoot(), queryKey.authRoot()],
    optimistic: (ns) => ({ previousUser: readUserSnapshot(ns) }),
  });
}

export function useChangePassword() {
  return useAppMutation<null, ChangePasswordRequest, UserCacheContext>({
    mutationFn: (body: ChangePasswordRequest) => Api.user.ChangePasswordService(body),
  });
}

export function useUpdateAvatar() {
  return useAppMutation<UserResponse, UpdateAvatarRequest, UserCacheContext>({
    mutationFn: (body: UpdateAvatarRequest) => Api.user.UpdateAvatarService(body),
    invalidateKeys: [queryKey.userRoot()],
    optimistic: (ns) => ({ previousUser: readUserSnapshot(ns) }),
  });
}

export function useUpdateUserStatus() {
  return useAppMutation<
    UserResponse,
    { id: string; body: UpdateUserStatusRequest },
    UserCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserStatusRequest }) =>
      Api.user.UpdateUserStatusService(id, body),
    invalidateKeys: [queryKey.userRoot()],
  });
}
