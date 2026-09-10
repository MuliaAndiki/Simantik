import {
  useAttemptEvaluation,
  useAttemptReview,
  useCompetencyProfile,
  useEvaluationDetail,
  useEvaluationList,
} from './state/query';

export const useEvaluation = () => {
  return {
    query: {
      profile: useCompetencyProfile,
      list: useEvaluationList,
      detail: useEvaluationDetail,
      attemptEvaluation: useAttemptEvaluation,
      attemptReview: useAttemptReview,
    },
    mutate: {},
  };
};

export default useEvaluation;
