import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  LearningModuleDetailResponse,
  LearningProgressResponse,
  ListMaterialActivityFilter,
  ListMaterialFilter,
  ListModuleFilter,
  MaterialResponse,
  MaterialStudentActivitiesResponse,
  ModuleProgressSummaryResponse,
  PaginatedMaterialsResponse,
  PaginatedModulesResponse,
} from '@/types/service';

export function useModuleList(query?: ListModuleFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.learning.modules(query),
    queryFn: async () => {
      const res = await Api.learning.ListModulesService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useModuleLabelList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.learning.moduleLabels(),
    queryFn: async () => {
      const res = await Api.learning.ListModuleLabelsService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useModuleDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.learning.moduleDetail(id),
    queryFn: async () => {
      const res = await Api.learning.GetModuleService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useModuleProgress(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.learning.moduleProgress(id),
    queryFn: async () => {
      const res = await Api.learning.GetModuleProgressService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useMaterialList(query?: ListMaterialFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.learning.materials(query),
    queryFn: async () => {
      const res = await Api.learning.ListMaterialsService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useMaterialDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.learning.materialDetail(id),
    queryFn: async () => {
      const res = await Api.learning.GetMaterialService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useMyLearningProgress(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.learning.myProgress(),
    queryFn: async () => {
      const res = await Api.learning.ListMyProgressService();
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useMaterialActivities(
  id: string,
  query?: ListMaterialActivityFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.learning.materialActivities(id, query),
    queryFn: async () => {
      const res = await Api.learning.GetMaterialStudentActivitiesService(id, query);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}
