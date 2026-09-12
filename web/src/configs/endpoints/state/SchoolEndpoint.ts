import { mountEntry } from '@/utils/mount.entry';

export const SchoolEndpoint = {
  create: `${mountEntry.schools}`,
  list: `${mountEntry.schools}`,
  detail: (id: string) => `${mountEntry.schools}/${id}`,
  update: (id: string) => `${mountEntry.schools}/${id}`,
  delete: (id: string) => `${mountEntry.schools}/${id}`,
} as const;
