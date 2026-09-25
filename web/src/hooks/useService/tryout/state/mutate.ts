import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type {
  AddTryoutQuestionsRequest,
  AutoSubmitAttemptRequest,
  CompleteAttemptResponse,
  CreateTryoutRequest,
  PublishTryoutRequest,
  StartAttemptResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  SyncTryoutQuestionsRequest,
  TryoutDetailResponse,
  TryoutResponse,
  UpdateTryoutRequest,
} from '@/types/service';
import { readTryoutSnapshot, type TryoutCacheContext } from '@/utils/cache/tryout.cache';

export function useCreateTryout() {
  return useAppMutation<TryoutResponse, CreateTryoutRequest, TryoutCacheContext>({
    mutationFn: (body: CreateTryoutRequest) => Api.tryout.CreateTryoutService(body),
    invalidateKeys: [queryKey.tryoutRoot()],
    optimistic: (ns) => ({ previousTryouts: readTryoutSnapshot(ns) }),
  });
}

export function useUpdateTryout() {
  return useAppMutation<
    TryoutResponse,
    { id: string; body: UpdateTryoutRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateTryoutRequest }) =>
      Api.tryout.UpdateTryoutService(id, body),
    invalidateKeys: [queryKey.tryoutRoot()],
  });
}

export function useUpdateTryoutStatus() {
  return useAppMutation<
    TryoutResponse,
    { id: string; body: PublishTryoutRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: PublishTryoutRequest }) =>
      Api.tryout.UpdateTryoutStatusService(id, body),
    invalidateKeys: [queryKey.tryoutRoot()],
  });
}

export function useDeleteTryout() {
  return useAppMutation<null, string, TryoutCacheContext>({
    mutationFn: (id: string) => Api.tryout.DeleteTryoutService(id),
    invalidateKeys: [queryKey.tryoutRoot()],
  });
}

export function useAddQuestionsToTryout() {
  return useAppMutation<
    TryoutDetailResponse,
    { id: string; body: AddTryoutQuestionsRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: AddTryoutQuestionsRequest }) =>
      Api.tryout.AddQuestionsService(id, body),
    invalidateKeys: [queryKey.tryoutRoot()],
  });
}

export function useSyncTryoutQuestions() {
  return useAppMutation<
    TryoutDetailResponse,
    { id: string; body: SyncTryoutQuestionsRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: SyncTryoutQuestionsRequest }) =>
      Api.tryout.SyncQuestionsService(id, body),
    invalidateKeys: [queryKey.tryoutRoot()],
  });
}

export function useRemoveQuestionFromTryout() {
  return useAppMutation<null, { id: string; questionId: string }, TryoutCacheContext>({
    mutationFn: ({ id, questionId }: { id: string; questionId: string }) =>
      Api.tryout.RemoveQuestionService(id, questionId),
    invalidateKeys: [queryKey.tryoutRoot()],
  });
}

export function useStartAttempt() {
  return useAppMutation<StartAttemptResponse, string, TryoutCacheContext>({
    mutationFn: (id: string) => Api.tryout.StartAttemptService(id),
    invalidateKeys: [queryKey.tryoutRoot()],
  });
}

export function useSubmitAnswer() {
  return useAppMutation<
    SubmitAnswerResponse,
    { attemptId: string; body: SubmitAnswerRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ attemptId, body }: { attemptId: string; body: SubmitAnswerRequest }) =>
      Api.tryout.SubmitAnswerService(attemptId, body),
    invalidateKeys: (_data, variables) => [queryKey.tryout.attemptStatus(variables.attemptId)],
    showSuccessToast: false,
  });
}

export function useCompleteAttempt() {
  return useAppMutation<CompleteAttemptResponse, string, TryoutCacheContext>({
    mutationFn: (attemptId: string) => Api.tryout.CompleteAttemptService(attemptId),
    invalidateKeys: [queryKey.tryoutRoot(), queryKey.evaluationRoot()],
  });
}

export function useAutoSubmitAttempt() {
  return useAppMutation<
    CompleteAttemptResponse,
    { attemptId: string; body?: AutoSubmitAttemptRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ attemptId, body }) => Api.tryout.AutoSubmitAttemptService(attemptId, body),
    invalidateKeys: [queryKey.tryoutRoot(), queryKey.evaluationRoot()],
    showSuccessToast: false,
  });
}
