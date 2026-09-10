import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { AdminDashboardStatsResponse } from '@/types/service';

export type AdminCacheContext = {
  previousDashboard?: AdminDashboardStatsResponse | null;
};

export function readAdminSnapshot(
  ns: AppNameSpace
): AdminDashboardStatsResponse | null | undefined {
  return ns.queryClient.getQueryData<AdminDashboardStatsResponse | null>(
    queryKey.admin.dashboard()
  );
}
