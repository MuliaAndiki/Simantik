import { mountEntry } from '@/utils/mount.entry';

export const QuestionEndpoint = {
  competencies: `${mountEntry.competencies}`,
  competencyDetail: (id: string) => `${mountEntry.competencies}/${id}`,
  questionTypes: `${mountEntry.questionTypes}`,
  questions: `${mountEntry.questions}`,
  questionDetail: (id: string) => `${mountEntry.questions}/${id}`,
  updateQuestionStatus: (id: string) => `${mountEntry.questions}/${id}/status`,
} as const;
