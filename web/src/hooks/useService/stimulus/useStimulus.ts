import {
  useCreateStimulus,
  useDeleteStimulus,
  useLinkStimulusQuestion,
  useUnlinkStimulusQuestion,
  useUpdateStimulus,
} from './state/mutate';
import { useStimulusDetail, useStimulusList } from './state/query';

export const useStimulus = () => {
  return {
    query: {
      list: useStimulusList,
      detail: useStimulusDetail,
    },
    mutate: {
      create: useCreateStimulus,
      update: useUpdateStimulus,
      delete: useDeleteStimulus,
      linkQuestion: useLinkStimulusQuestion,
      unlinkQuestion: useUnlinkStimulusQuestion,
    },
  };
};

export default useStimulus;
