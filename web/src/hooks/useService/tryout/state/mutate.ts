import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type {
  AddTryoutQuestionsRequest,
  CompleteAttemptResponse,
  CreateTryoutRequest,
  PublishTryoutRequest,
  StartAttemptResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  TryoutDetailResponse,
  TryoutResponse,
  UpdateTryoutRequest,
} from '@/types/service';
import { readTryoutSnapshot, type TryoutCacheContext } from '@/utils/cache/tryout.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useCreateTryout() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<TryoutResponse>, Error, CreateTryoutRequest, TryoutCacheContext>({
    mutationFn: (body: CreateTryoutRequest) => Api.tryout.CreateTryoutService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tryoutRoot(),
      });
      const previousTryouts = readTryoutSnapshot(ns);
      return { previousTryouts };
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

export function useUpdateTryout() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<TryoutResponse>,
    Error,
    { id: string; body: UpdateTryoutRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateTryoutRequest }) =>
      Api.tryout.UpdateTryoutService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
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

export function useUpdateTryoutStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<TryoutResponse>,
    Error,
    { id: string; body: PublishTryoutRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: PublishTryoutRequest }) =>
      Api.tryout.UpdateTryoutStatusService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
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

export function useDeleteTryout() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, TryoutCacheContext>({
    mutationFn: (id: string) => Api.tryout.DeleteTryoutService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
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

export function useAddQuestionsToTryout() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<TryoutDetailResponse>,
    Error,
    { id: string; body: AddTryoutQuestionsRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: AddTryoutQuestionsRequest }) =>
      Api.tryout.AddQuestionsService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
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

export function useRemoveQuestionFromTryout() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<null>,
    Error,
    { id: string; questionId: string },
    TryoutCacheContext
  >({
    mutationFn: ({ id, questionId }: { id: string; questionId: string }) =>
      Api.tryout.RemoveQuestionService(id, questionId),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
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

export function useStartAttempt() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<StartAttemptResponse>, Error, string, TryoutCacheContext>({
    mutationFn: (id: string) => Api.tryout.StartAttemptService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
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

export function useSubmitAnswer() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<SubmitAnswerResponse>,
    Error,
    { attemptId: string; body: SubmitAnswerRequest },
    TryoutCacheContext
  >({
    mutationFn: ({ attemptId, body }: { attemptId: string; body: SubmitAnswerRequest }) =>
      Api.tryout.SubmitAnswerService(attemptId, body),
    onSettled: async (_, __, variables) => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryout.attemptStatus(variables.attemptId),
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

export function useCompleteAttempt() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<CompleteAttemptResponse>, Error, string, TryoutCacheContext>({
    mutationFn: (attemptId: string) => Api.tryout.CompleteAttemptService(attemptId),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tryoutRoot(),
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
