import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { UserResponse } from '@/types/service';

export type AuthCacheContext = {
  previousData?: UserResponse | null;
};

export function readAuthSnapshot(ns: AppNameSpace): UserResponse | null | undefined {
  return ns.queryClient.getQueryData<UserResponse | null>(queryKey.auth.me());
}
