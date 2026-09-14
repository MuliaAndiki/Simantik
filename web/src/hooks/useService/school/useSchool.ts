import { useCreateSchool, useDeleteSchool, useUpdateSchool } from './state/mutate';
import { useSchoolDetail, useSchoolList, useSchoolPublicList } from './state/query';

export const useSchool = () => {
  return {
    query: {
      list: useSchoolList,
      listPublic: useSchoolPublicList,
      detail: useSchoolDetail,
    },
    mutate: {
      create: useCreateSchool,
      update: useUpdateSchool,
      delete: useDeleteSchool,
    },
  };
};

export default useSchool;
