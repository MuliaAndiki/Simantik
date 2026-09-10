import { mountEntry } from '@/utils/mount.entry';

export const RecommendationEndpoint = {
  generate: `${mountEntry.recommendations}/generate`,
  recommendations: `${mountEntry.recommendations}`,
  dismiss: (id: string) => `${mountEntry.recommendations}/${id}`,
} as const;
