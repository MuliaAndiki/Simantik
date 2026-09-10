import {
  useAdminOverviewAnalytics,
  useCompetenciesAnalytics,
  useDifficultyAnalytics,
  useQuestionAnalytics,
  useStudentReportCard,
  useTryoutAnalytics,
} from './state/query';

export const useReporting = () => {
  return {
    query: {
      studentReportCard: useStudentReportCard,
      adminOverview: useAdminOverviewAnalytics,
      tryoutAnalytics: useTryoutAnalytics,
      questionAnalytics: useQuestionAnalytics,
      competenciesAnalytics: useCompetenciesAnalytics,
      difficultyAnalytics: useDifficultyAnalytics,
    },
    mutate: {},
  };
};

export default useReporting;
