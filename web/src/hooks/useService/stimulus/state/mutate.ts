import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type {
  CreateStimulusRequest,
  StimulusResponse,
  UpdateStimulusRequest,
} from '@/types/service';

export function useCreateStimulus() {
  return useAppMutation<StimulusResponse, CreateStimulusRequest, unknown>({
    mutationFn: (body) => Api.stimulus.CreateStimulusService(body),
    invalidateKeys: [queryKey.stimulusRoot()],
  });
}

export function useUpdateStimulus() {
  return useAppMutation<StimulusResponse, { id: string; body: UpdateStimulusRequest }, unknown>({
    mutationFn: ({ id, body }) => Api.stimulus.UpdateStimulusService(id, body),
    invalidateKeys: [queryKey.stimulusRoot()],
  });
}

export function useDeleteStimulus() {
  return useAppMutation<null, string, unknown>({
    mutationFn: (id) => Api.stimulus.DeleteStimulusService(id),
    invalidateKeys: [queryKey.stimulusRoot()],
  });
}

export function useLinkStimulusQuestion() {
  return useAppMutation<
    { stimulus_id: string; question_id: string; warning?: string },
    { id: string; questionId: string },
    unknown
  >({
    mutationFn: ({ id, questionId }) => Api.stimulus.LinkQuestionService(id, questionId),
    invalidateKeys: [queryKey.stimulusRoot()],
  });
}

export function useUnlinkStimulusQuestion() {
  return useAppMutation<null, string, unknown>({
    mutationFn: (questionId) => Api.stimulus.UnlinkQuestionService(questionId),
    invalidateKeys: [queryKey.stimulusRoot()],
  });
}
