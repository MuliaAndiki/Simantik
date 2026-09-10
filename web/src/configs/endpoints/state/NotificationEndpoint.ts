import { mountEntry } from '@/utils/mount.entry';

export const NotificationEndpoint = {
  notifications: `${mountEntry.notifications}`,
  unreadCount: `${mountEntry.notifications}/unread-count`,
  readAll: `${mountEntry.notifications}/read-all`,
  markAsRead: (id: string) => `${mountEntry.notifications}/${id}/read`,
  broadcast: `${mountEntry.admin}/notifications/broadcast`,
} as const;
