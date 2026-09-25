import { mountEntry } from '@/utils/mount.entry';

export const AdminEndpoint = {
  dashboard: `${mountEntry.admin}/dashboard`,
  users: `${mountEntry.admin}/users`,
  userDetail: (id: string) => `${mountEntry.admin}/users/${id}`,
  userActivities: (id: string) => `${mountEntry.admin}/users/${id}/activities`,
  userProgress: (id: string) => `${mountEntry.admin}/users/${id}/progress`,
  updateUserStatus: (id: string) => `${mountEntry.admin}/users/${id}/status`,
  updateUserRole: (id: string) => `${mountEntry.admin}/users/${id}/role`,
} as const;
