import { mountEntry } from '@/utils/mount.entry';

export const ReportingEndpoint = {
  studentReportCard: `${mountEntry.reports}/student`,
  adminOverview: `${mountEntry.admin}/reports/overview`,
  tryoutAnalytics: (id: string) => `${mountEntry.admin}/reports/tryouts/${id}`,
  questionAnalytics: (id: string) => `${mountEntry.admin}/reports/questions/${id}`,
  competencyAnalytics: `${mountEntry.admin}/reports/competencies`,
  difficultyAnalytics: `${mountEntry.admin}/reports/difficulties`,
} as const;
