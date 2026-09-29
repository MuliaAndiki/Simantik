import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  AttemptQuestionResponse,
  AttemptStatusResponse,
  ListTryoutFilter,
  ListTryoutResultFilter,
  MyAttemptsFilter,
  PaginatedAttemptsResponse,
  PaginatedTryoutsResponse,
  TryoutDetailResponse,
  TryoutPackageResultsResponse,
} from '@/types/service';

export function useTryoutList(query?: ListTryoutFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.tryout.list(query),
    queryFn: async () => {
      const res = await Api.tryout.ListTryoutsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useTryoutDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.tryout.detail(id),
    queryFn: async () => {
      const res = await Api.tryout.GetTryoutService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useTryoutPackageResults(
  id: string,
  query?: ListTryoutResultFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.tryout.packageResults(id, query),
    queryFn: async () => {
      const res = await Api.tryout.GetTryoutPackageResultsService(id, query);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useMyAttempts(query?: MyAttemptsFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.tryout.attempts(query),
    queryFn: async () => {
      const res = await Api.tryout.ListMyAttemptsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useAttemptStatus(attemptId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.tryout.attemptStatus(attemptId),
    queryFn: async () => {
      const res = await Api.tryout.GetAttemptStatusService(attemptId);
      return res.data;
    },
    enabled: !!attemptId && (options?.enabled ?? true),
  });
}

export function useAttemptQuestion(
  attemptId: string,
  number: number | string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.tryout.attemptQuestion(attemptId, number),
    queryFn: async () => {
      const res = await Api.tryout.GetAttemptQuestionService(attemptId, number);
      return res.data;
    },
    enabled: !!attemptId && number !== undefined && (options?.enabled ?? true),
  });
}
