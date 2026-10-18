const stimuli = '/stimuli';

export const StimulusEndpoint = {
  list: stimuli,
  detail: (id: string) => `${stimuli}/${id}`,
  linkQuestion: (id: string) => `${stimuli}/${id}/questions`,
  unlinkQuestion: (questionId: string) => `${stimuli}/questions/${questionId}`,
} as const;
