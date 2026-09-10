import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedUsersResponse, UserResponse } from '@/types/service';

export type UserCacheContext = {
  previousUser?: UserResponse | null;
  previousList?: PaginatedUsersResponse | null;
};

export function readUserSnapshot(ns: AppNameSpace): UserResponse | null | undefined {
  return ns.queryClient.getQueryData<UserResponse | null>(queryKey.user.me());
}
