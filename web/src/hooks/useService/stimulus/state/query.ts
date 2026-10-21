import { queryKey } from '@/configs/query-key';
import { useAppQuery } from '@/hooks/_shared/useAppQuery';
import Api from '@/services/props.service';

export function useStimulusList(
  query?: {
    search?: string;
    limit?: number;
    offset?: number;
    package_id?: string;
    package_kind?: 'tryout' | 'practice';
  },
  options?: { enabled?: boolean }
) {
  return useAppQuery(
    queryKey.stimulus.list(query),
    async () => (await Api.stimulus.ListStimuliService(query)).data,
    options?.enabled
  );
}

export function useStimulusDetail(id: string, options?: { enabled?: boolean }) {
  return useAppQuery(
    queryKey.stimulus.detail(id),
    async () => (await Api.stimulus.GetStimulusService(id)).data,
    !!id && (options?.enabled ?? true)
  );
}
