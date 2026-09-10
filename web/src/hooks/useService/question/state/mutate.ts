import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type {
  CompetencyResponse,
  CreateCompetencyRequest,
  CreateQuestionRequest,
  PublishQuestionRequest,
  QuestionAdminResponse,
  UpdateCompetencyRequest,
  UpdateQuestionRequest,
} from '@/types/service';
import { type QuestionCacheContext, readQuestionSnapshot } from '@/utils/cache/question.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useCreateCompetency() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<CompetencyResponse>,
    Error,
    CreateCompetencyRequest,
    QuestionCacheContext
  >({
    mutationFn: (body: CreateCompetencyRequest) => Api.question.CreateCompetencyService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.questionRoot(),
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

export function useUpdateCompetency() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<CompetencyResponse>,
    Error,
    { id: string; body: UpdateCompetencyRequest },
    QuestionCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateCompetencyRequest }) =>
      Api.question.UpdateCompetencyService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.questionRoot(),
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

export function useDeleteCompetency() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, QuestionCacheContext>({
    mutationFn: (id: string) => Api.question.DeleteCompetencyService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.questionRoot(),
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

export function useCreateQuestion() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<QuestionAdminResponse>,
    Error,
    CreateQuestionRequest,
    QuestionCacheContext
  >({
    mutationFn: (body: CreateQuestionRequest) => Api.question.CreateQuestionService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.questionRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.questionRoot(),
      });
      const previousQuestions = readQuestionSnapshot(ns);
      return { previousQuestions };
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

export function useUpdateQuestion() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<QuestionAdminResponse>,
    Error,
    { id: string; body: UpdateQuestionRequest },
    QuestionCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateQuestionRequest }) =>
      Api.question.UpdateQuestionService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.questionRoot(),
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

export function useUpdateQuestionStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<QuestionAdminResponse>,
    Error,
    { id: string; body: PublishQuestionRequest },
    QuestionCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: PublishQuestionRequest }) =>
      Api.question.UpdateQuestionStatusService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.questionRoot(),
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

export function useDeleteQuestion() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, QuestionCacheContext>({
    mutationFn: (id: string) => Api.question.DeleteQuestionService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.questionRoot(),
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
