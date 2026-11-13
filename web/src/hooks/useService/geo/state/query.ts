import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';

export function useGeoSearchSchools(q: string, options?: { enabled?: boolean }) {
  const trimmed = q.trim();
  return useQuery({
    queryKey: queryKey.geo.searchSchools(trimmed),
    queryFn: async () => {
      const res = await Api.geo.SearchSchoolsService(trimmed);
      return res.data ?? [];
    },
    enabled: trimmed.length >= 3 && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useGeoReverse(
  lat: number | null | undefined,
  lon: number | null | undefined,
  options?: { enabled?: boolean }
) {
  const hasCoords = typeof lat === 'number' && typeof lon === 'number';
  return useQuery({
    queryKey: hasCoords ? queryKey.geo.reverse(lat, lon) : ['geo', 'reverse', 'idle'],
    queryFn: async () => {
      const res = await Api.geo.ReverseService(lat as number, lon as number);
      return res.data;
    },
    enabled: hasCoords && (options?.enabled ?? true),
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
