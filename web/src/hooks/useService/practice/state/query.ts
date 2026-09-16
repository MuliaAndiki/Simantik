import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  ListPracticePackageFilter,
  MyPracticesFilter,
  PaginatedPracticePackagesResponse,
  PaginatedPracticesResponse,
  PracticeAttemptDetailResponse,
  PracticePackageDetailResponse,
  PracticeResultResponse,
} from '@/types/service';

export function usePracticeList(
  query?: ListPracticePackageFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.practice.list(query),
    queryFn: async () => {
      const res = await Api.practice.ListPracticesService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function usePracticeDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.practice.detail(id),
    queryFn: async () => {
      const res = await Api.practice.GetPracticeService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function usePracticeAttemptState(attemptId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.practice.attemptState(attemptId),
    queryFn: async () => {
      const res = await Api.practice.GetAttemptStateService(attemptId);
      return res.data;
    },
    enabled: !!attemptId && (options?.enabled ?? true),
  });
}

export function usePracticeResult(attemptId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.practice.result(attemptId),
    queryFn: async () => {
      const res = await Api.practice.GetPracticeResultService(attemptId);
      return res.data;
    },
    enabled: !!attemptId && (options?.enabled ?? true),
  });
}

export function useMyPracticeAttempts(query?: MyPracticesFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.practice.attempts(query),
    queryFn: async () => {
      const res = await Api.practice.ListMyAttemptsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useManagementPracticePackages(
  query?: ListPracticePackageFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.practice.packages(query),
    queryFn: async () => {
      const res = await Api.practice.ListPackagesService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useManagementPracticePackageDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.practice.packageDetail(id),
    queryFn: async () => {
      const res = await Api.practice.GetPackageService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}
