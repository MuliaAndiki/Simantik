import {
  useAddQuestionsToTryout,
  useCompleteAttempt,
  useCreateTryout,
  useDeleteTryout,
  useRemoveQuestionFromTryout,
  useStartAttempt,
  useSubmitAnswer,
  useUpdateTryout,
  useUpdateTryoutStatus,
} from './state/mutate';
import {
  useAttemptQuestion,
  useAttemptStatus,
  useMyAttempts,
  useTryoutDetail,
  useTryoutList,
} from './state/query';

export const useTryout = () => {
  return {
    query: {
      list: useTryoutList,
      detail: useTryoutDetail,
      attempts: useMyAttempts,
      attemptStatus: useAttemptStatus,
      attemptQuestion: useAttemptQuestion,
    },
    mutate: {
      create: useCreateTryout,
      update: useUpdateTryout,
      updateStatus: useUpdateTryoutStatus,
      delete: useDeleteTryout,
      addQuestions: useAddQuestionsToTryout,
      removeQuestion: useRemoveQuestionFromTryout,
      startAttempt: useStartAttempt,
      submitAnswer: useSubmitAnswer,
      completeAttempt: useCompleteAttempt,
    },
  };
};

export default useTryout;
