import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type { ListSchoolFilter, SchoolResponse } from '@/types/service';

export function useSchoolList(query?: ListSchoolFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.school.list(query),
    queryFn: async () => {
      const res = await Api.school.ListSchoolsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useSchoolDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.school.detail(id),
    queryFn: async () => {
      const res = await Api.school.GetSchoolService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}
