import { queryKey } from '@/configs/query-key';
import { useAppQuery } from '@/hooks/_shared/useAppQuery';
import Api from '@/services/props.service';
import type { ListTryoutFilter, ListTryoutResultFilter, MyAttemptsFilter } from '@/types/service';

export function useTryoutList(query?: ListTryoutFilter, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.tryout.list(query),
    async () => (await Api.tryout.ListTryoutsService(query)).data,
    options?.enabled
  );
}

export function useTryoutDetail(id: string, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.tryout.detail(id),
    async () => (await Api.tryout.GetTryoutService(id)).data,
    !!id && (options?.enabled ?? true)
  );
}

export function useTryoutPackageResults(
  id: string,
  query?: ListTryoutResultFilter,
  options?: { enabled?: boolean }
) {
  return useAppQuery(
    queryKey.tryout.packageResults(id, query),
    async () => (await Api.tryout.GetTryoutPackageResultsService(id, query)).data,
    !!id && (options?.enabled ?? true)
  );
}

export function useMyAttempts(query?: MyAttemptsFilter, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.tryout.attempts(query),
    async () => (await Api.tryout.ListMyAttemptsService(query)).data,
    options?.enabled
  );
}

export function useAttemptStatus(attemptId: string, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.tryout.attemptStatus(attemptId),
    async () => (await Api.tryout.GetAttemptStatusService(attemptId)).data,
    !!attemptId && (options?.enabled ?? true)
  );
}

export function useAttemptQuestion(
  attemptId: string,
  number: number | string,
  options?: { enabled?: boolean }
) {
  return useAppQuery(
    queryKey.tryout.attemptQuestion(attemptId, number),
    async () => (await Api.tryout.GetAttemptQuestionService(attemptId, number)).data,
    !!attemptId && number !== undefined && (options?.enabled ?? true)
  );
}
