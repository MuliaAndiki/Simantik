import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  AdminOverviewAnalyticsResponse,
  CompetencyAnalyticsResponse,
  DifficultyAnalyticsResponse,
  QuestionItemAnalysisResponse,
  StudentReportCardResponse,
  TryoutAnalyticsResponse,
} from '@/types/service';

export function useStudentReportCard(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.reporting.studentReportCard(),
    queryFn: async () => {
      const res = await Api.reporting.GetStudentReportCardService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useAdminOverviewAnalytics(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.reporting.adminOverview(),
    queryFn: async () => {
      const res = await Api.reporting.GetAdminOverviewService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useTryoutAnalytics(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.reporting.tryoutAnalytics(id),
    queryFn: async () => {
      const res = await Api.reporting.GetTryoutAnalyticsService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useQuestionAnalytics(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.reporting.questionAnalytics(id),
    queryFn: async () => {
      const res = await Api.reporting.GetQuestionAnalyticsService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useCompetenciesAnalytics(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.reporting.competencyAnalytics(),
    queryFn: async () => {
      const res = await Api.reporting.GetCompetenciesAnalyticsService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useDifficultyAnalytics(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.reporting.difficultyAnalytics(),
    queryFn: async () => {
      const res = await Api.reporting.GetDifficultyAnalyticsService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}
