import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '@/hooks/useService/useAlert/costum-alert';
import type { AlertContexType } from '@/types/ui';

export type AppNameSpace = {
  queryClient: QueryClient;
  alert: AlertContexType;
};

export function useAppNameSpace(): AppNameSpace {
  const queryClient = useQueryClient();
  const alert = useAlert();

  return {
    queryClient,
    alert,
  };
}

export default useAppNameSpace;
