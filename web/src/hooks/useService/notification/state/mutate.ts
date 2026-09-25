import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type { BroadcastNotificationRequest } from '@/types/service';
import type { NotificationCacheContext } from '@/utils/cache/notification.cache';

export function useMarkAllNotificationsAsRead() {
  return useAppMutation<null, void, NotificationCacheContext>({
    mutationFn: () => Api.notification.MarkAllAsReadService(),
    invalidateKeys: [queryKey.notificationRoot()],
  });
}

export function useMarkNotificationAsRead() {
  return useAppMutation<null, string, NotificationCacheContext>({
    mutationFn: (id: string) => Api.notification.MarkAsReadService(id),
    invalidateKeys: [queryKey.notificationRoot()],
    showSuccessToast: false,
  });
}

export function useBroadcastNotification() {
  return useAppMutation<
    { recipients_count: number },
    BroadcastNotificationRequest,
    NotificationCacheContext
  >({
    mutationFn: (body: BroadcastNotificationRequest) =>
      Api.notification.BroadcastNotificationService(body),
    invalidateKeys: [queryKey.notificationRoot()],
  });
}
