import type { StimulusData } from './practice.types';

export type TryoutQuestionType =
  | 'pilihan-ganda'
  | 'pilihan-ganda-kompleks'
  | 'benar-salah'
  | 'tepat-tidak-tepat'
  | 'setuju-tidak-setuju';

export interface TryoutChoiceOption {
  id: string;
  label: string; // "A", "B", "C", "D", "E"
  title: string;
  description?: string;
}

export interface TryoutMatrixStatement {
  id: string;
  label: string;
  statement: string;
}

export interface TryoutQuestionItem {
  id: string;
  questionNumber: number;
  type: TryoutQuestionType;
  instruction?: string;
  questionText: string;
  stimulus?: StimulusData;
  options?: TryoutChoiceOption[];
  statements?: TryoutMatrixStatement[];
  difficultyLevel?: number;
}

export type TryoutPaletteStatus = 'answered' | 'active' | 'locked';

export interface TryoutPaletteItem {
  number: number;
  formattedNumber: string;
  status: TryoutPaletteStatus;
}

export type TryoutAnswerValue = string | string[] | Record<string, string>;

export interface TryoutTimerState {
  remainingSeconds: number;
  formattedTime: string;
  isUrgent: boolean;
}

export interface TryoutResultSummaryData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeTakenSeconds: number;
  formattedTimeTaken: string;
  testId: string;
  title: string;
  statusLabel: string;
  motivationText: string;
  isAutoSubmitted?: boolean;
  autoSubmitReason?: string;
}
