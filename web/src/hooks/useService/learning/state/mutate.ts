import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
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

export function useCreateModule() {
  return useAppMutation<LearningModuleResponse, CreateLearningModuleRequest, LearningCacheContext>({
    mutationFn: (body: CreateLearningModuleRequest) => Api.learning.CreateModuleService(body),
    invalidateKeys: [queryKey.learningRoot()],
    optimistic: (ns) => ({ previousModules: readLearningSnapshot(ns) }),
  });
}

export function useUpdateModule() {
  return useAppMutation<
    LearningModuleResponse,
    { id: string; body: UpdateLearningModuleRequest },
    LearningCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateLearningModuleRequest }) =>
      Api.learning.UpdateModuleService(id, body),
    invalidateKeys: [queryKey.learningRoot()],
  });
}

export function useUpdateModuleStatus() {
  return useAppMutation<
    LearningModuleResponse,
    { id: string; status: string },
    LearningCacheContext
  >({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      Api.learning.UpdateModuleStatusService(id, status),
    invalidateKeys: [queryKey.learningRoot()],
  });
}

export function useDeleteModule() {
  return useAppMutation<null, string, LearningCacheContext>({
    mutationFn: (id: string) => Api.learning.DeleteModuleService(id),
    invalidateKeys: [queryKey.learningRoot()],
  });
}

export function useCreateMaterial() {
  return useAppMutation<MaterialResponse, CreateMaterialRequest, LearningCacheContext>({
    mutationFn: (body: CreateMaterialRequest) => Api.learning.CreateMaterialService(body),
    invalidateKeys: [queryKey.learningRoot()],
  });
}

export function useUpdateMaterial() {
  return useAppMutation<
    MaterialResponse,
    { id: string; body: UpdateMaterialRequest },
    LearningCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateMaterialRequest }) =>
      Api.learning.UpdateMaterialService(id, body),
    invalidateKeys: [queryKey.learningRoot()],
  });
}

export function useUpdateMaterialStatus() {
  return useAppMutation<MaterialResponse, { id: string; status: string }, LearningCacheContext>({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      Api.learning.UpdateMaterialStatusService(id, status),
    invalidateKeys: [queryKey.learningRoot()],
  });
}

export function useDeleteMaterial() {
  return useAppMutation<null, string, LearningCacheContext>({
    mutationFn: (id: string) => Api.learning.DeleteMaterialService(id),
    invalidateKeys: [queryKey.learningRoot()],
  });
}

export function useMarkMaterialProgress() {
  return useAppMutation<
    LearningProgressResponse,
    { id: string; body: UpdateProgressRequest },
    LearningCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateProgressRequest }) =>
      Api.learning.MarkMaterialProgressService(id, body),
    invalidateKeys: [queryKey.learningRoot()],
  });
}
