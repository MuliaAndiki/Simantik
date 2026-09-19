import type { CreatePracticePackageRequest } from '@/types/service';

export type PracticeStatusType = 'PUBLISHED' | 'DRAFT' | 'UNPUBLISHED';

export interface PracticePackageItem {
  id: string;
  number: string;
  title: string;
  description?: string;
  competencyId?: string | null;
  competencyName: string;
  jenjang: string;
  totalQuestions: number;
  status: PracticeStatusType;
  updatedAt: string;
}

export interface PracticeStats {
  totalPackages: number;
  draftCount: number;
  publishedCount: number;
  unpublishedCount: number;
}

export interface PracticeFilterState {
  search: string;
  status: string;
  competencyId: string;
  jenjang: string;
  quota: string;
  page: number;
  perPage: number;
}

export type PracticeDialogForm = CreatePracticePackageRequest & {
  id?: string;
  description: string;
  competency_id: string;
  status: PracticeStatusType;
};
