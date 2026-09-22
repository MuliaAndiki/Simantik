import type { CreateTryoutRequest } from '@/types/service';

export type TryoutStatusType = 'PUBLISHED' | 'DRAFT' | 'UNPUBLISHED';

export interface TryoutPackageItem {
  id: string;
  number: string;
  title: string;
  author: string;
  jenjang: string;
  durationMinutes: number;
  totalQuestions: number;
  status: TryoutStatusType;
  updatedAt: string;
  description?: string;
}

export interface TryoutStats {
  totalTryouts: number;
  draftCount: number;
  publishedCount: number;
  unpublishedCount: number;
}

export interface TryoutFilterState {
  search: string;
  status: string;
  jenjang: string;
  page: number;
  perPage: number;
}

export type TryoutDialogForm = {
  id?: string;
  title: string;
  description: string;
  jenjang: string;
  duration_minutes: number;
  status: TryoutStatusType;
};
