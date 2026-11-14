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

const JENJANG_AFFECTED_CONTENT_KEYS = [
  queryKey.learningRoot(),
  queryKey.practiceRoot(),
  queryKey.tryoutRoot(),
  queryKey.evaluationRoot(),
  queryKey.recommendationRoot(),
];

export function useUpdateProfile() {
  return useAppMutation<UserResponse, UpdateMeRequest, UserCacheContext>({
    mutationFn: (body: UpdateMeRequest) => Api.user.UpdateMeService(body),
    invalidateKeys: (_data, variables) =>
      variables?.jenjang
        ? [queryKey.userRoot(), queryKey.authRoot(), ...JENJANG_AFFECTED_CONTENT_KEYS]
        : [queryKey.userRoot()],
    optimistic: (ns) => ({ previousUser: readUserSnapshot(ns) }),
  });
}

export function useUpdateMySchool() {
  return useAppMutation<UserResponse, UpdateMySchoolRequest, UserCacheContext>({
    mutationFn: (body: UpdateMySchoolRequest) => Api.user.UpdateMySchoolService(body),
    invalidateKeys: [
      queryKey.userRoot(),
      queryKey.authRoot(),
      queryKey.schoolRoot(),
      ...JENJANG_AFFECTED_CONTENT_KEYS,
    ],
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
