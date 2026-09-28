import {
  useAddQuestionsToPracticePackage,
  useAutoSubmitPractice,
  useCreatePracticePackage,
  useDeletePracticePackage,
  useRemoveQuestionFromPracticePackage,
  useStartPractice,
  useSubmitPractice,
  useSubmitPracticeAnswer,
  useUpdatePracticePackage,
  useUpdatePracticePackageStatus,
} from './state/mutate';
import {
  useManagementPracticePackageDetail,
  useManagementPracticePackageResults,
  useManagementPracticePackages,
  useMyPracticeAttempts,
  usePracticeAttemptState,
  usePracticeDetail,
  usePracticeList,
  usePracticeResult,
} from './state/query';

export const usePractice = () => {
  return {
    query: {
      list: usePracticeList,
      detail: usePracticeDetail,
      attemptState: usePracticeAttemptState,
      result: usePracticeResult,
      attempts: useMyPracticeAttempts,
      packages: useManagementPracticePackages,
      packageDetail: useManagementPracticePackageDetail,
      packageResults: useManagementPracticePackageResults,
    },
    mutate: {
      start: useStartPractice,
      submitAnswer: useSubmitPracticeAnswer,
      submitPractice: useSubmitPractice,
      autoSubmit: useAutoSubmitPractice,
      createPackage: useCreatePracticePackage,
      updatePackage: useUpdatePracticePackage,
      updatePackageStatus: useUpdatePracticePackageStatus,
      deletePackage: useDeletePracticePackage,
      addQuestions: useAddQuestionsToPracticePackage,
      removeQuestion: useRemoveQuestionFromPracticePackage,
    },
  };
};

export default usePractice;
