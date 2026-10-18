export type PracticeQuestionType =
  | 'pilihan-ganda'
  | 'pilihan-ganda-kompleks'
  | 'benar-salah'
  | 'tepat-tidak-tepat'
  | 'setuju-tidak-setuju';

export interface StimulusData {
  id?: string;
  title?: string;
  quote?: string;
  // string[] = legacy teks polos per paragraf, string = HTML dari RichTextEditor
  content?: string[] | string;
  source?: string;
  /** Daftar nomor soal yang menggunakan bacaan ini (dihitung dinamis) */
  relatedQuestionNumbers?: number[];
}

export interface ChoiceOption {
  id: string;
  label: string; // e.g. "A", "B", "C", "D", "E"
  title: string;
  description?: string;
}

export interface MatrixStatement {
  id: string;
  label: string; // e.g. "A", "B", "C"
  statement: string;
}

export interface PracticeQuestionItem {
  id: string;
  questionNumber: number;
  competencyBadge: string;
  type: PracticeQuestionType;
  instruction?: string;
  promptCategory?: string;
  questionText: string;
  stimulus?: StimulusData;
  /** Daftar nomor soal yang menggunakan bacaan ini (dihitung dinamis) */
  relatedQuestionNumbers?: number[];
  options?: ChoiceOption[];
  statements?: MatrixStatement[];
}

export type MatrixChoiceValue =
  | 'BENAR'
  | 'SALAH'
  | 'TEPAT'
  | 'TIDAK_TEPAT'
  | 'SETUJU'
  | 'TIDAK_SETUJU';

export type QuestionAnswerValue = string | string[] | Record<string, string>;

export interface PracticeSessionAnswerMap {
  [questionId: string]: QuestionAnswerValue;
}

export type QuestionPaletteStatus = 'active' | 'answered' | 'flagged' | 'unanswered';
