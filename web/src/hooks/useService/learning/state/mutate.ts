import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type {
  CreateLearningModuleRequest,
  CreateMaterialRequest,
  LearningModuleResponse,
  LearningProgressResponse,
  MaterialResponse,
  UpdateLearningModuleRequest,
  UpdateMaterialRequest,
  UpdateProgressRequest,
} from '@/types/service';
import { type LearningCacheContext, readLearningSnapshot } from '@/utils/cache/learning.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useCreateModule() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<LearningModuleResponse>,
    Error,
    CreateLearningModuleRequest,
    LearningCacheContext
  >({
    mutationFn: (body: CreateLearningModuleRequest) => Api.learning.CreateModuleService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.learningRoot(),
      });
      const previousModules = readLearningSnapshot(ns);
      return { previousModules };
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

export function useUpdateModule() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<LearningModuleResponse>,
    Error,
    { id: string; body: UpdateLearningModuleRequest },
    LearningCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateLearningModuleRequest }) =>
      Api.learning.UpdateModuleService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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

export function useUpdateModuleStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<LearningModuleResponse>,
    Error,
    { id: string; status: string },
    LearningCacheContext
  >({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      Api.learning.UpdateModuleStatusService(id, status),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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

export function useDeleteModule() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, LearningCacheContext>({
    mutationFn: (id: string) => Api.learning.DeleteModuleService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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

export function useCreateMaterial() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<MaterialResponse>,
    Error,
    CreateMaterialRequest,
    LearningCacheContext
  >({
    mutationFn: (body: CreateMaterialRequest) => Api.learning.CreateMaterialService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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

export function useUpdateMaterial() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<MaterialResponse>,
    Error,
    { id: string; body: UpdateMaterialRequest },
    LearningCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateMaterialRequest }) =>
      Api.learning.UpdateMaterialService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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

export function useUpdateMaterialStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<MaterialResponse>,
    Error,
    { id: string; status: string },
    LearningCacheContext
  >({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      Api.learning.UpdateMaterialStatusService(id, status),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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

export function useDeleteMaterial() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, LearningCacheContext>({
    mutationFn: (id: string) => Api.learning.DeleteMaterialService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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

export function useMarkMaterialProgress() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<LearningProgressResponse>,
    Error,
    { id: string; body: UpdateProgressRequest },
    LearningCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateProgressRequest }) =>
      Api.learning.MarkMaterialProgressService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.learningRoot(),
      });
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
