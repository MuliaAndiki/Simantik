import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type { UserResponse } from '@/types/service';

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.auth.me(),
    queryFn: async () => {
      const res = await Api.user.GetMeService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}
