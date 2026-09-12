import { useCreateSchool, useDeleteSchool, useUpdateSchool } from './state/mutate';
import { useSchoolDetail, useSchoolList } from './state/query';

export const useSchool = () => {
  return {
    query: {
      list: useSchoolList,
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
