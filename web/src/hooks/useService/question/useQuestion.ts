import {
  useCreateCompetency,
  useCreateQuestion,
  useDeleteCompetency,
  useDeleteQuestion,
  useUpdateCompetency,
  useUpdateQuestion,
  useUpdateQuestionStatus,
} from './state/mutate';
import {
  useCompetencyDetail,
  useCompetencyList,
  useQuestionDetail,
  useQuestionList,
  useQuestionTypes,
} from './state/query';

export const useQuestion = () => {
  return {
    query: {
      competencies: useCompetencyList,
      competencyDetail: useCompetencyDetail,
      types: useQuestionTypes,
      list: useQuestionList,
      detail: useQuestionDetail,
    },
    mutate: {
      createCompetency: useCreateCompetency,
      updateCompetency: useUpdateCompetency,
      deleteCompetency: useDeleteCompetency,
      create: useCreateQuestion,
      update: useUpdateQuestion,
      updateStatus: useUpdateQuestionStatus,
      delete: useDeleteQuestion,
    },
  };
};

export default useQuestion;
