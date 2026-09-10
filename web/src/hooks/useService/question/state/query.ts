import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  CompetencyResponse,
  ListCompetencyFilter,
  ListQuestionFilter,
  PaginatedCompetenciesResponse,
  PaginatedQuestionsAdminResponse,
  QuestionAdminResponse,
  QuestionTypeResponse,
} from '@/types/service';

export function useCompetencyList(query?: ListCompetencyFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.question.competencies(query),
    queryFn: async () => {
      const res = await Api.question.ListCompetenciesService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useCompetencyDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.question.competencyDetail(id),
    queryFn: async () => {
      const res = await Api.question.GetCompetencyService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useQuestionTypes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.question.types(),
    queryFn: async () => {
      const res = await Api.question.ListQuestionTypesService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useQuestionList(query?: ListQuestionFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.question.list(query),
    queryFn: async () => {
      const res = await Api.question.ListQuestionsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useQuestionDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.question.detail(id),
    queryFn: async () => {
      const res = await Api.question.GetQuestionService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}
