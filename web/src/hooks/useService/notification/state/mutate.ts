import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type { BroadcastNotificationRequest } from '@/types/service';
import {
  type NotificationCacheContext,
  readNotificationSnapshot,
} from '@/utils/cache/notification.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useMarkAllNotificationsAsRead() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, void, NotificationCacheContext>({
    mutationFn: () => Api.notification.MarkAllAsReadService(),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.notificationRoot(),
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

export function useMarkNotificationAsRead() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, NotificationCacheContext>({
    mutationFn: (id: string) => Api.notification.MarkAsReadService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.notificationRoot(),
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

export function useBroadcastNotification() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<{ recipients_count: number }>,
    Error,
    BroadcastNotificationRequest,
    NotificationCacheContext
  >({
    mutationFn: (body: BroadcastNotificationRequest) =>
      Api.notification.BroadcastNotificationService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.notificationRoot(),
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
