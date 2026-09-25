import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
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

export function useCreateCompetency() {
  return useAppMutation<CompetencyResponse, CreateCompetencyRequest, QuestionCacheContext>({
    mutationFn: (body: CreateCompetencyRequest) => Api.question.CreateCompetencyService(body),
    invalidateKeys: [queryKey.questionRoot()],
  });
}

export function useUpdateCompetency() {
  return useAppMutation<
    CompetencyResponse,
    { id: string; body: UpdateCompetencyRequest },
    QuestionCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateCompetencyRequest }) =>
      Api.question.UpdateCompetencyService(id, body),
    invalidateKeys: [queryKey.questionRoot()],
  });
}

export function useDeleteCompetency() {
  return useAppMutation<null, string, QuestionCacheContext>({
    mutationFn: (id: string) => Api.question.DeleteCompetencyService(id),
    invalidateKeys: [queryKey.questionRoot()],
  });
}

export function useCreateQuestion() {
  return useAppMutation<QuestionAdminResponse, CreateQuestionRequest, QuestionCacheContext>({
    mutationFn: (body: CreateQuestionRequest) => Api.question.CreateQuestionService(body),
    invalidateKeys: [queryKey.questionRoot()],
    optimistic: (ns) => ({ previousQuestions: readQuestionSnapshot(ns) }),
  });
}

export function useUpdateQuestion() {
  return useAppMutation<
    QuestionAdminResponse,
    { id: string; body: UpdateQuestionRequest },
    QuestionCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateQuestionRequest }) =>
      Api.question.UpdateQuestionService(id, body),
    invalidateKeys: [queryKey.questionRoot()],
  });
}

export function useUpdateQuestionStatus() {
  return useAppMutation<
    QuestionAdminResponse,
    { id: string; body: PublishQuestionRequest },
    QuestionCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: PublishQuestionRequest }) =>
      Api.question.UpdateQuestionStatusService(id, body),
    invalidateKeys: [queryKey.questionRoot()],
  });
}

export function useDeleteQuestion() {
  return useAppMutation<null, string, QuestionCacheContext>({
    mutationFn: (id: string) => Api.question.DeleteQuestionService(id),
    invalidateKeys: [queryKey.questionRoot()],
  });
}
