import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedNotificationsResponse } from '@/types/service';

export type NotificationCacheContext = {
  previousNotifications?: PaginatedNotificationsResponse | null;
};

export function readNotificationSnapshot(
  ns: AppNameSpace
): PaginatedNotificationsResponse | null | undefined {
  return ns.queryClient.getQueryData<PaginatedNotificationsResponse | null>(
    queryKey.notification.list()
  );
}
