import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type {
  CreateSchoolRequest,
  ProposeSchoolRequest,
  RejectSchoolRequest,
  SchoolResponse,
  UpdateSchoolRequest,
} from '@/types/service';
import { readSchoolSnapshot, type SchoolCacheContext } from '@/utils/cache/school.cache';

export function useCreateSchool() {
  return useAppMutation<SchoolResponse, CreateSchoolRequest, SchoolCacheContext>({
    mutationFn: (body: CreateSchoolRequest) => Api.school.CreateSchoolService(body),
    invalidateKeys: [queryKey.schoolRoot()],
    optimistic: (ns) => ({ previousSchools: readSchoolSnapshot(ns) }),
  });
}

export function useProposeSchool() {
  return useAppMutation<SchoolResponse, ProposeSchoolRequest, SchoolCacheContext>({
    mutationFn: (body: ProposeSchoolRequest) => Api.school.ProposeSchoolService(body),
    invalidateKeys: [queryKey.schoolRoot(), queryKey.userRoot()],
  });
}

export function useUpdateSchool() {
  return useAppMutation<
    SchoolResponse,
    { id: string; body: UpdateSchoolRequest },
    SchoolCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateSchoolRequest }) =>
      Api.school.UpdateSchoolService(id, body),
    invalidateKeys: [queryKey.schoolRoot()],
    optimistic: (ns) => ({ previousSchools: readSchoolSnapshot(ns) }),
  });
}

export function useVerifySchool() {
  return useAppMutation<SchoolResponse, string, SchoolCacheContext>({
    mutationFn: (id: string) => Api.school.VerifySchoolService(id),
    invalidateKeys: [queryKey.schoolRoot()],
    optimistic: (ns) => ({ previousSchools: readSchoolSnapshot(ns) }),
  });
}

export function useRejectSchool() {
  return useAppMutation<
    SchoolResponse,
    { id: string; body: RejectSchoolRequest },
    SchoolCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: RejectSchoolRequest }) =>
      Api.school.RejectSchoolService(id, body),
    invalidateKeys: [queryKey.schoolRoot()],
    optimistic: (ns) => ({ previousSchools: readSchoolSnapshot(ns) }),
  });
}

export function useDeleteSchool() {
  return useAppMutation<null, string, SchoolCacheContext>({
    mutationFn: (id: string) => Api.school.DeleteSchoolService(id),
    invalidateKeys: [queryKey.schoolRoot()],
    optimistic: (ns) => ({ previousSchools: readSchoolSnapshot(ns) }),
  });
}
