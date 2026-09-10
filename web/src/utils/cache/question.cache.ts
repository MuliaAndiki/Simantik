import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { PaginatedQuestionsAdminResponse } from '@/types/service';

export type QuestionCacheContext = {
  previousQuestions?: PaginatedQuestionsAdminResponse | null;
};

export function readQuestionSnapshot(
  ns: AppNameSpace
): PaginatedQuestionsAdminResponse | null | undefined {
  return ns.queryClient.getQueryData<PaginatedQuestionsAdminResponse | null>(
    queryKey.question.list()
  );
}
