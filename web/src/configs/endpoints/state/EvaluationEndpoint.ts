import { mountEntry } from '@/utils/mount.entry';

export const EvaluationEndpoint = {
  profile: `${mountEntry.evaluations}/profile`,
  evaluations: `${mountEntry.evaluations}`,
  evaluationDetail: (id: string) => `${mountEntry.evaluations}/${id}`,
  attemptEvaluation: (attemptId: string) => `${mountEntry.attempts}/${attemptId}/evaluation`,
  attemptReview: (attemptId: string) => `${mountEntry.attempts}/${attemptId}/review`,
} as const;
