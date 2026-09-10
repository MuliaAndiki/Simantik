import { mountEntry } from '@/utils/mount.entry';

export const TryoutEndpoint = {
  tryouts: `${mountEntry.tryouts}`,
  tryoutDetail: (id: string) => `${mountEntry.tryouts}/${id}`,
  updateTryoutStatus: (id: string) => `${mountEntry.tryouts}/${id}/status`,
  addQuestions: (id: string) => `${mountEntry.tryouts}/${id}/questions`,
  removeQuestion: (id: string, questionId: string) =>
    `${mountEntry.tryouts}/${id}/questions/${questionId}`,
  startAttempt: (id: string) => `${mountEntry.tryouts}/${id}/attempts`,
  attempts: `${mountEntry.attempts}`,
  attemptStatus: (attemptId: string) => `${mountEntry.attempts}/${attemptId}`,
  attemptQuestion: (attemptId: string, number: number | string) =>
    `${mountEntry.attempts}/${attemptId}/questions/${number}`,
  submitAnswer: (attemptId: string) => `${mountEntry.attempts}/${attemptId}/answers`,
  completeAttempt: (attemptId: string) => `${mountEntry.attempts}/${attemptId}/complete`,
} as const;
