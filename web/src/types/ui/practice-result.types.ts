export type PracticeReviewFilter = 'all' | 'correct' | 'wrong' | 'unanswered';

export type PracticeReviewStatus = 'correct' | 'wrong' | 'unanswered';

export type PracticeReviewQuestionType = 'pilihan-ganda' | 'mcma' | 'matriks-tabel' | 'infografis';

export interface PracticeResultSummaryData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredCount: number;
  accuracy: number;
  testId: string;
  packageName: string;
  statusLabel: string;
  motivationText: string;
}

export interface PracticeResultPaletteItem {
  number: number;
  formattedNumber: string;
  status: PracticeReviewStatus;
}

export interface PracticeReviewOption {
  id: string;
  text: string;
  isUserChoice: boolean;
  isCorrect: boolean;
  badgeText?: string;
  tagText?: string;
}

export interface PracticeMatrixRow {
  statement: string;
  userChoice: string;
  validKey: string;
  isCorrect: boolean;
}

export interface PracticeInfographicData {
  caption: string;
  dataPoints: Array<{ year: string; score: number }>;
}

export interface PracticeDiscussionData {
  type: 'analitis' | 'kekeliruan' | 'skor' | 'visual';
  title: string;
  content: string;
}

export interface PracticeReviewItem {
  number: number;
  formattedNumber: string;
  status: PracticeReviewStatus;
  statusLabel: string;
  type: PracticeReviewQuestionType;
  typeLabel: string;
  subtest: string;
  title: string;
  stimulus?: {
    label: string;
    content: string;
  };
  prompt: string;
  options?: PracticeReviewOption[];
  matrixRows?: PracticeMatrixRow[];
  suggestedMaterials?: { id: string; title: string }[];
  infographic?: PracticeInfographicData;
  discussion: PracticeDiscussionData;
}
