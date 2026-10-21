import type { SchoolLevel } from '../service';
import type { PracticeQuestionType } from './practice.types';

export interface QuestionChoiceOptionForm {
  id: string;
  label: string; // "A", "B", "C", "D", "E"
  text: string;
  sublabel?: string; // e.g. "(Pernyataan wacana eksplisit)"
}

export interface QuestionMatrixStatementForm {
  id: string;
  label: string; // "A", "B", "C", "D"
  statement: string;
  correctChoice: 'BENAR' | 'SALAH' | 'TEPAT' | 'TIDAK_TEPAT' | 'SETUJU' | 'TIDAK_SETUJU' | string;
}

export interface QuestionStimulusForm {
  hasStimulus: boolean;
  title: string;
  content: string;
  source: string;
  /** ID stimulus bersama bila dipilih dari bank (null = tulis baru/embed). */
  stimulusId?: string | null;
  /** Jumlah soal aktual yang terhubung dengan stimulus ini */
  questionCount?: number;
  /** Menandakan apakah stimulus ini dimiliki paket lain */
  isForeign?: boolean;
}

export interface QuestionEditorItemForm {
  id: string;
  questionNumber: number;
  questionType: PracticeQuestionType;
  stimulus: QuestionStimulusForm;
  questionText: string;
  options: QuestionChoiceOptionForm[];
  correctOptionLabel: string; // For Single Choice (e.g. "A")
  correctOptionLabels: string[]; // For Multi-Choice MCMA (e.g. ["A", "B", "E"])
  matrixStatements: QuestionMatrixStatementForm[]; // For Matrix Category (B/S, TP/TTP)
  explanation: string;
  answeringTips: string;
}

export interface PracticePackageEditorForm {
  id?: string;
  title: string;
  competency_id: string;
  jenjang: SchoolLevel;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  questions: QuestionEditorItemForm[];
  activeQuestionIndex: number;
}
