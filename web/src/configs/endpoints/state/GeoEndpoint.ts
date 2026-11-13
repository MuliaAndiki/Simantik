import { mountEntry } from '@/utils/mount.entry';

export const GeoEndpoint = {
  searchSchools: `${mountEntry.geo}/schools/search`,
  reverse: `${mountEntry.geo}/reverse`,
} as const;
