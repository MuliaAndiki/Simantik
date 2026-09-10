import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  AttemptReviewResponse,
  EvaluationResponse,
  ListEvaluationFilter,
  StudentCompetencyProfileResponse,
} from '@/types/service';

export function useCompetencyProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.evaluation.profile(),
    queryFn: async () => {
      const res = await Api.evaluation.GetCompetencyProfileService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useEvaluationList(query?: ListEvaluationFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.evaluation.list(query),
    queryFn: async () => {
      const res = await Api.evaluation.ListMyEvaluationsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useEvaluationDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.evaluation.detail(id),
    queryFn: async () => {
      const res = await Api.evaluation.GetEvaluationByIdService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useAttemptEvaluation(attemptId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.evaluation.attemptEvaluation(attemptId),
    queryFn: async () => {
      const res = await Api.evaluation.GetAttemptEvaluationService(attemptId);
      return res.data;
    },
    enabled: !!attemptId && (options?.enabled ?? true),
  });
}

export function useAttemptReview(attemptId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.evaluation.attemptReview(attemptId),
    queryFn: async () => {
      const res = await Api.evaluation.GetAttemptReviewService(attemptId);
      return res.data;
    },
    enabled: !!attemptId && (options?.enabled ?? true),
  });
}
