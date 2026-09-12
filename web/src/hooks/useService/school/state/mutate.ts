import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type { CreateSchoolRequest, SchoolResponse, UpdateSchoolRequest } from '@/types/service';
import { readSchoolSnapshot, type SchoolCacheContext } from '@/utils/cache/school.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useCreateSchool() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<SchoolResponse>, Error, CreateSchoolRequest, SchoolCacheContext>({
    mutationFn: (body: CreateSchoolRequest) => Api.school.CreateSchoolService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.schoolRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.schoolRoot(),
      });
      const previousSchools = readSchoolSnapshot(ns);
      return { previousSchools };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateSchool() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<SchoolResponse>,
    Error,
    { id: string; body: UpdateSchoolRequest },
    SchoolCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateSchoolRequest }) =>
      Api.school.UpdateSchoolService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.schoolRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.schoolRoot(),
      });
      const previousSchools = readSchoolSnapshot(ns);
      return { previousSchools };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteSchool() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, SchoolCacheContext>({
    mutationFn: (id: string) => Api.school.DeleteSchoolService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.schoolRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.schoolRoot(),
      });
      const previousSchools = readSchoolSnapshot(ns);
      return { previousSchools };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
