import { mountEntry } from '@/utils/mount.entry';

export const SchoolEndpoint = {
  create: `${mountEntry.schools}`,
  list: `${mountEntry.schools}`,
  listPublic: `${mountEntry.schoolPublik}`,
  propose: `${mountEntry.schoolPublik}/submissions`,
  mySubmissions: `${mountEntry.schoolPublik}/submissions/me`,
  detail: (id: string) => `${mountEntry.schools}/${id}`,
  update: (id: string) => `${mountEntry.schools}/${id}`,
  verify: (id: string) => `${mountEntry.schools}/${id}/verify`,
  reject: (id: string) => `${mountEntry.schools}/${id}/reject`,
  delete: (id: string) => `${mountEntry.schools}/${id}`,
} as const;
