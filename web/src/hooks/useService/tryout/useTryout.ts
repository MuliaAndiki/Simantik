import {
  useAddQuestionsToTryout,
  useAutoSubmitAttempt,
  useCompleteAttempt,
  useCreateTryout,
  useDeleteTryout,
  useRemoveQuestionFromTryout,
  useStartAttempt,
  useSubmitAnswer,
  useSyncTryoutQuestions,
  useUpdateTryout,
  useUpdateTryoutStatus,
} from './state/mutate';
import {
  useAttemptQuestion,
  useAttemptStatus,
  useMyAttempts,
  useTryoutDetail,
  useTryoutList,
  useTryoutPackageResults,
} from './state/query';

export const useTryout = () => {
  return {
    query: {
      list: useTryoutList,
      detail: useTryoutDetail,
      packageResults: useTryoutPackageResults,
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
      syncQuestions: useSyncTryoutQuestions,
      removeQuestion: useRemoveQuestionFromTryout,
      startAttempt: useStartAttempt,
      submitAnswer: useSubmitAnswer,
      completeAttempt: useCompleteAttempt,
      autoSubmit: useAutoSubmitAttempt,
    },
  };
};

export default useTryout;
