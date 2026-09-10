import {
  useBroadcastNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from './state/mutate';
import { useNotificationList, useUnreadCount } from './state/query';

export const useNotification = () => {
  return {
    query: {
      list: useNotificationList,
      unreadCount: useUnreadCount,
    },
    mutate: {
      markAllAsRead: useMarkAllNotificationsAsRead,
      markAsRead: useMarkNotificationAsRead,
      broadcast: useBroadcastNotification,
    },
  };
};

export default useNotification;
