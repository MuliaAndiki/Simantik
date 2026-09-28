import { mountEntry } from '@/utils/mount.entry';

export const PracticeEndpoint = {
  // Student practices
  practices: `${mountEntry.practices}`,
  practiceDetail: (id: string) => `${mountEntry.practices}/${id}`,
  startPractice: (id: string) => `${mountEntry.practices}/${id}/start`,

  // Student practice attempts
  attempts: `${mountEntry.practiceAttempts}`,
  attemptState: (attemptId: string) => `${mountEntry.practiceAttempts}/${attemptId}`,
  submitAnswer: (attemptId: string) => `${mountEntry.practiceAttempts}/${attemptId}/answer`,
  submitPractice: (attemptId: string) => `${mountEntry.practiceAttempts}/${attemptId}/submit`,
  autoSubmit: (attemptId: string) => `${mountEntry.practiceAttempts}/${attemptId}/auto-submit`,
  practiceResult: (attemptId: string) => `${mountEntry.practiceAttempts}/${attemptId}/result`,

  // Management packages
  packages: `${mountEntry.practicePackages}`,
  packageDetail: (id: string) => `${mountEntry.practicePackages}/${id}`,
  packageStatus: (id: string) => `${mountEntry.practicePackages}/${id}/status`,
  packageResults: (id: string) => `${mountEntry.practicePackages}/${id}/results`,
  packageQuestions: (id: string) => `${mountEntry.practicePackages}/${id}/questions`,
  removePackageQuestion: (id: string, questionId: string) =>
    `${mountEntry.practicePackages}/${id}/questions/${questionId}`,
} as const;
