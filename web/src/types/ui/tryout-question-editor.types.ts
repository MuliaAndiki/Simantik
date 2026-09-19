import type { SchoolLevel } from '../service';
import type { PracticeQuestionType } from './practice.types';
import type {
  QuestionChoiceOptionForm,
  QuestionMatrixStatementForm,
  QuestionStimulusForm,
} from './practice-question-editor.types';

export type TryoutDifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface TryoutQuestionVariantForm {
  id: string;
  difficultyLevel: TryoutDifficultyLevel;
  questionType: PracticeQuestionType;
  stimulus: QuestionStimulusForm;
  questionText: string;
  options: QuestionChoiceOptionForm[];
  correctOptionLabel: string;
  correctOptionLabels: string[];
  matrixStatements: QuestionMatrixStatementForm[];
  explanation: string;
  answeringTips: string;
}

export interface TryoutAdaptiveQuestionItemForm {
  id: string;
  questionNumber: number;
  activeLevel: TryoutDifficultyLevel;
  variants: Record<TryoutDifficultyLevel, TryoutQuestionVariantForm>;
}

export interface TryoutPackageEditorForm {
  id?: string;
  title: string;
  jenjang: SchoolLevel;
  description: string;
  duration_minutes: number;
  total_questions: number;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  questions: TryoutAdaptiveQuestionItemForm[];
  activeQuestionIndex: number;
}
