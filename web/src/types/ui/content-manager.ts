export type ContentStatus = 'draft' | 'published' | 'archived' | 'in_review';

export interface NewsFilterState {
  search: string;
  status: string;
  page: number;
  perPage: number;
}

export interface NewsStats {
  total: number;
  totalChange: string;
  published: number;
  draft: number;
  unpublished: number;
}

export const NEWS_STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'Semua', label: 'Semua' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
];

export interface DocsFilterState {
  search: string;
  status: string;
  category: string;
  page: number;
  perPage: number;
}

export interface DocsStats {
  total: number;
  published: number;
  draft: number;
  unpublished: number;
}

export const DOCS_STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'Semua', label: 'Semua' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
];

export interface TutorialFilterState {
  search: string;
  status: string;
  category: string;
  page: number;
  perPage: number;
}

export interface TutorialStats {
  total: number;
  published: number;
  draft: number;
  unpublished: number;
}

export const TUTORIAL_STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'Semua', label: 'Semua' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
];

export type TestimonialFilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export interface TestimonialsStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const TESTIMONIAL_STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu Review' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
];

export const CONTET_STATUS_OPTIONS = [
  {
    value: 'published',
    label: 'Published',
    color: 'bg-[#10B981]',
  },
  {
    value: 'in_review',
    label: 'In Review',
    color: 'bg-[#F5B731]',
  },
  {
    value: 'draft',
    label: 'Draft',
    color: 'bg-[#94A3B8]',
  },
] satisfies {
  value: ContentStatus;
  label: string;
  color: string;
}[];
