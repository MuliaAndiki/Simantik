import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  ListNotificationFilter,
  PaginatedNotificationsResponse,
  UnreadCountResponse,
} from '@/types/service';

export function useNotificationList(
  query?: ListNotificationFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.notification.list(query),
    queryFn: async () => {
      const res = await Api.notification.GetMyNotificationsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useUnreadCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.notification.unreadCount(),
    queryFn: async () => {
      const res = await Api.notification.GetUnreadCountService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}
