import {
  useCreateSchool,
  useDeleteSchool,
  useProposeSchool,
  useRejectSchool,
  useUpdateSchool,
  useVerifySchool,
} from './state/mutate';
import {
  useMySchoolSubmissions,
  useSchoolDetail,
  useSchoolList,
  useSchoolPublicList,
} from './state/query';

export const useSchool = () => {
  return {
    query: {
      list: useSchoolList,
      listPublic: useSchoolPublicList,
      mySubmissions: useMySchoolSubmissions,
      detail: useSchoolDetail,
    },
    mutate: {
      create: useCreateSchool,
      propose: useProposeSchool,
      update: useUpdateSchool,
      verify: useVerifySchool,
      reject: useRejectSchool,
      delete: useDeleteSchool,
    },
  };
};

export default useSchool;
