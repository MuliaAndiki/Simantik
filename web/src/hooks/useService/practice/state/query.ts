import { queryKey } from '@/configs/query-key';
import { useAppQuery } from '@/hooks/_shared/useAppQuery';
import Api from '@/services/props.service';
import type {
  ListPracticePackageFilter,
  ListPracticeResultFilter,
  MyPracticesFilter,
} from '@/types/service';

export function usePracticeList(
  query?: ListPracticePackageFilter,
  options?: { enabled?: boolean }
) {
  return useAppQuery(
    queryKey.practice.list(query),
    async () => (await Api.practice.ListPracticesService(query)).data,
    options?.enabled
  );
}

export function usePracticeDetail(id: string, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.practice.detail(id),
    async () => (await Api.practice.GetPracticeService(id)).data,
    !!id && (options?.enabled ?? true)
  );
}

export function usePracticeAttemptState(attemptId: string, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.practice.attemptState(attemptId),
    async () => (await Api.practice.GetAttemptStateService(attemptId)).data,
    !!attemptId && (options?.enabled ?? true)
  );
}

export function usePracticeResult(attemptId: string, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.practice.result(attemptId),
    async () => (await Api.practice.GetPracticeResultService(attemptId)).data,
    !!attemptId && (options?.enabled ?? true)
  );
}

export function useMyPracticeAttempts(query?: MyPracticesFilter, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.practice.attempts(query),
    async () => (await Api.practice.ListMyAttemptsService(query)).data,
    options?.enabled
  );
}

export function useManagementPracticePackages(
  query?: ListPracticePackageFilter,
  options?: { enabled?: boolean }
) {
  return useAppQuery(
    queryKey.practice.packages(query),
    async () => (await Api.practice.ListPackagesService(query)).data,
    options?.enabled
  );
}

export function useManagementPracticePackageDetail(id: string, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.practice.packageDetail(id),
    async () => (await Api.practice.GetPackageService(id)).data,
    !!id && (options?.enabled ?? true)
  );
}

export function useManagementPracticePackageResults(
  id: string,
  query?: ListPracticeResultFilter,
  options?: { enabled?: boolean }
) {
  return useAppQuery(
    queryKey.practice.packageResults(id, query),
    async () => (await Api.practice.GetPracticePackageResultsService(id, query)).data,
    !!id && (options?.enabled ?? true)
  );
}
