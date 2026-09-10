import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { StudentCompetencyProfileResponse } from '@/types/service';

export type EvaluationCacheContext = {
  previousProfile?: StudentCompetencyProfileResponse | null;
};

export function readEvaluationSnapshot(
  ns: AppNameSpace
): StudentCompetencyProfileResponse | null | undefined {
  return ns.queryClient.getQueryData<StudentCompetencyProfileResponse | null>(
    queryKey.evaluation.profile()
  );
}
