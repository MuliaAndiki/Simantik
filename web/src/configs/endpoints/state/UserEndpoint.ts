import { mountEntry } from '@/utils/mount.entry';

export const UserEndpoint = {
  getProfile: `${mountEntry.user}/me`,
  updateProfile: `${mountEntry.user}/me`,
  changePassword: `${mountEntry.user}/me/password`,
  updateAvatars: `${mountEntry.user}/me/avatar`,
  getRole: `${mountEntry.user}/me/roles`,

  adminGet: `${mountEntry.user}/`,
  adminGetById: (id: string) => `${mountEntry.user}/${id}`,
  adminPatch: (id: string) => `${mountEntry.user}/${id}/status`,
} as const;
