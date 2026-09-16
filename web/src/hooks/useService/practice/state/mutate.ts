import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type {
  AddPracticeQuestionsRequest,
  AutoSubmitPracticeRequest,
  CompletePracticeResponse,
  CreatePracticePackageRequest,
  PracticePackageDetailResponse,
  PracticePackageResponse,
  StartPracticeResponse,
  SubmitPracticeAnswerRequest,
  SubmitPracticeAnswerResponse,
  UpdatePracticePackageRequest,
} from '@/types/service';
import { type PracticeCacheContext, readPracticeSnapshot } from '@/utils/cache/practice.cache';
import { ResponseTitles } from '@/utils/response-titles';

// ─── Student Execution Mutations ─────────────────────────────────────────────

export function useStartPractice() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<StartPracticeResponse>, Error, string, PracticeCacheContext>({
    mutationFn: (packageId: string) => Api.practice.StartPracticeService(packageId),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useSubmitPracticeAnswer() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<SubmitPracticeAnswerResponse>,
    Error,
    { attemptId: string; body: SubmitPracticeAnswerRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ attemptId, body }) => Api.practice.SubmitAnswerService(attemptId, body),
    onSettled: async (_, __, variables) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practice.attemptState(variables.attemptId),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useSubmitPractice() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<CompletePracticeResponse>, Error, string, PracticeCacheContext>({
    mutationFn: (attemptId: string) => Api.practice.SubmitPracticeService(attemptId),
    onSettled: async (_, __, attemptId) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practice.result(attemptId),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.evaluationRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useAutoSubmitPractice() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<CompletePracticeResponse>,
    Error,
    { attemptId: string; body?: AutoSubmitPracticeRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ attemptId, body }) => Api.practice.AutoSubmitPracticeService(attemptId, body),
    onSettled: async (_, __, variables) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practice.result(variables.attemptId),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.evaluationRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: 'Sesi Selesai (Otomatis)',
        message:
          res.message ||
          'Latihan dikumpulkan otomatis oleh sistem karena batas pelanggaran telah terlampaui.',
        icon: 'warning',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

// ─── Management Package Mutations (Admin / Content Manager) ──────────────────

export function useCreatePracticePackage() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<PracticePackageResponse>,
    Error,
    CreatePracticePackageRequest,
    PracticeCacheContext
  >({
    mutationFn: (body) => Api.practice.CreatePackageService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.practiceRoot(),
      });
      const previousPractices = readPracticeSnapshot(ns);
      return { previousPractices };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdatePracticePackage() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<PracticePackageResponse>,
    Error,
    { id: string; body: UpdatePracticePackageRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ id, body }) => Api.practice.UpdatePackageService(id, body),
    onSettled: async (_, __, variables) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practice.packageDetail(variables.id),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdatePracticePackageStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<PracticePackageResponse>,
    Error,
    { id: string; status: string },
    PracticeCacheContext
  >({
    mutationFn: ({ id, status }) => Api.practice.UpdatePackageStatusService(id, status),
    onSettled: async (_, __, variables) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practice.packageDetail(variables.id),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeletePracticePackage() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, PracticeCacheContext>({
    mutationFn: (id) => Api.practice.DeletePackageService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useAddQuestionsToPracticePackage() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<PracticePackageDetailResponse>,
    Error,
    { id: string; body: AddPracticeQuestionsRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ id, body }) => Api.practice.AddQuestionsService(id, body),
    onSettled: async (_, __, variables) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practice.packageDetail(variables.id),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useRemoveQuestionFromPracticePackage() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<null>,
    Error,
    { id: string; questionId: string },
    PracticeCacheContext
  >({
    mutationFn: ({ id, questionId }) => Api.practice.RemoveQuestionService(id, questionId),
    onSettled: async (_, __, variables) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practiceRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.practice.packageDetail(variables.id),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
