import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
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
  SubmitPracticeRequest,
  UpdatePracticePackageRequest,
} from '@/types/service';
import { type PracticeCacheContext, readPracticeSnapshot } from '@/utils/cache/practice.cache';

// ─── Student Execution Mutations ─────────────────────────────────────────────

export function useStartPractice() {
  return useAppMutation<StartPracticeResponse, string, PracticeCacheContext>({
    mutationFn: (packageId: string) => Api.practice.StartPracticeService(packageId),
    invalidateKeys: [queryKey.practiceRoot()],
  });
}

export function useSubmitPracticeAnswer() {
  return useAppMutation<
    SubmitPracticeAnswerResponse,
    { attemptId: string; body: SubmitPracticeAnswerRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ attemptId, body }) => Api.practice.SubmitAnswerService(attemptId, body),
    invalidateKeys: (_data, variables) => [queryKey.practice.attemptState(variables.attemptId)],
    showSuccessToast: false,
  });
}

export function useSubmitPractice() {
  return useAppMutation<
    CompletePracticeResponse,
    string | { attemptId: string; body?: SubmitPracticeRequest },
    PracticeCacheContext
  >({
    mutationFn: (variables) => {
      const attemptId = typeof variables === 'string' ? variables : variables.attemptId;
      const body = typeof variables === 'string' ? undefined : variables.body;
      return Api.practice.SubmitPracticeService(attemptId, body);
    },
    invalidateKeys: (_data, variables) => {
      const attemptId = typeof variables === 'string' ? variables : variables.attemptId;
      return [
        queryKey.practiceRoot(),
        queryKey.practice.result(attemptId),
        queryKey.evaluationRoot(),
      ];
    },
  });
}

export function useAutoSubmitPractice() {
  return useAppMutation<
    CompletePracticeResponse,
    { attemptId: string; body?: AutoSubmitPracticeRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ attemptId, body }) => Api.practice.AutoSubmitPracticeService(attemptId, body),
    invalidateKeys: (_data, variables) => [
      queryKey.practiceRoot(),
      queryKey.practice.result(variables.attemptId),
      queryKey.evaluationRoot(),
    ],
    showSuccessToast: false,
    onSuccess: (res, _variables, _context, ns) => {
      ns.alert.toast({
        title: 'Sesi Selesai (Otomatis)',
        message:
          res.message ||
          'Latihan dikumpulkan otomatis oleh sistem karena batas pelanggaran telah terlampaui.',
        icon: 'warning',
      });
    },
  });
}

// ─── Management Package Mutations (Admin / Content Manager) ──────────────────

export function useCreatePracticePackage() {
  return useAppMutation<
    PracticePackageResponse,
    CreatePracticePackageRequest,
    PracticeCacheContext
  >({
    mutationFn: (body) => Api.practice.CreatePackageService(body),
    invalidateKeys: [queryKey.practiceRoot()],
    optimistic: (ns) => ({ previousPractices: readPracticeSnapshot(ns) }),
  });
}

export function useUpdatePracticePackage() {
  return useAppMutation<
    PracticePackageResponse,
    { id: string; body: UpdatePracticePackageRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ id, body }) => Api.practice.UpdatePackageService(id, body),
    invalidateKeys: (_data, variables) => [
      queryKey.practiceRoot(),
      queryKey.practice.packageDetail(variables.id),
    ],
  });
}

export function useUpdatePracticePackageStatus() {
  return useAppMutation<
    PracticePackageResponse,
    { id: string; status: string },
    PracticeCacheContext
  >({
    mutationFn: ({ id, status }) => Api.practice.UpdatePackageStatusService(id, status),
    invalidateKeys: (_data, variables) => [
      queryKey.practiceRoot(),
      queryKey.practice.packageDetail(variables.id),
    ],
  });
}

export function useDeletePracticePackage() {
  return useAppMutation<null, string, PracticeCacheContext>({
    mutationFn: (id) => Api.practice.DeletePackageService(id),
    invalidateKeys: [queryKey.practiceRoot()],
  });
}

export function useAddQuestionsToPracticePackage() {
  return useAppMutation<
    PracticePackageDetailResponse,
    { id: string; body: AddPracticeQuestionsRequest },
    PracticeCacheContext
  >({
    mutationFn: ({ id, body }) => Api.practice.AddQuestionsService(id, body),
    invalidateKeys: (_data, variables) => [
      queryKey.practiceRoot(),
      queryKey.practice.packageDetail(variables.id),
    ],
  });
}

export function useRemoveQuestionFromPracticePackage() {
  return useAppMutation<null, { id: string; questionId: string }, PracticeCacheContext>({
    mutationFn: ({ id, questionId }) => Api.practice.RemoveQuestionService(id, questionId),
    invalidateKeys: (_data, variables) => [
      queryKey.practiceRoot(),
      queryKey.practice.packageDetail(variables.id),
    ],
  });
}
