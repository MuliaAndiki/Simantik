import { useDismissRecommendation, useGenerateRecommendations } from './state/mutate';
import { useRecommendationList } from './state/query';

export const useRecommendation = () => {
  return {
    query: {
      list: useRecommendationList,
    },
    mutate: {
      generate: useGenerateRecommendations,
      dismiss: useDismissRecommendation,
    },
  };
};

export default useRecommendation;
