import { queryKey } from '@/configs/query-key';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';
import type { StudentReportCardResponse } from '@/types/service';

export type ReportingCacheContext = {
  previousReport?: StudentReportCardResponse | null;
};

export function readReportingSnapshot(
  ns: AppNameSpace
): StudentReportCardResponse | null | undefined {
  return ns.queryClient.getQueryData<StudentReportCardResponse | null>(
    queryKey.reporting.studentReportCard()
  );
}
