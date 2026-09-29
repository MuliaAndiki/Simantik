'use client';

import { type QueryKey, type UseQueryResult, useQuery } from '@tanstack/react-query';

/**
 * Pasangan useAppMutation untuk query: seluruh hook query domain
 * (practice, tryout, ...) adalah bentukan yang sama — key + fetch + enabled.
 * Taruh logika `enabled` khusus (mis. `!!id && ...`) di call site.
 */
export function useAppQuery<TData>(
  key: QueryKey,
  fetch: () => Promise<TData>,
  enabled?: boolean
): UseQueryResult<TData, Error> {
  return useQuery({ queryKey: key, queryFn: fetch, enabled });
}
