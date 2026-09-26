import type React from 'react';
import type { PracticeManagerCompetencyOption } from '@/components/organisms/content_manager/practice';
import {
  PracticeCreateTopBar,
  PracticeExplanationSection,
  PracticeOptionComplexMultipleChoiceSection,
  PracticeOptionMatrixCategorySection,
  PracticeOptionMultipleChoiceSection,
  PracticePackageMetadataCard,
  PracticeQuestionEditorHeader,
  PracticeQuestionPaletteCard,
  PracticeStemSection,
  PracticeStimulusSection,
} from '@/components/organisms/content_manager/practice_create';
import type { PracticeQuestionType } from '@/types/ui/practice.types';
import type {
  PracticePackageEditorForm,
  QuestionEditorItemForm,
  QuestionStimulusForm,
} from '@/types/ui/practice-question-editor.types';

export interface PracticeCreateTemplateProps {
  packageForm: PracticePackageEditorForm;
  activeQuestion: QuestionEditorItemForm;
  competencies: PracticeManagerCompetencyOption[];
  isSubmitting?: boolean;
  onPackageTitleChange: (val: string) => void;
  onPackageCompetencyChange: (val: string) => void;
  onPackageDescriptionChange: (val: string) => void;
  onSaveDraft: () => void;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
  onDeleteQuestion?: (index: number) => void;
  onSaveQuestions: () => void;
  onQuestionTypeChange: (type: PracticeQuestionType) => void;
  onStimulusChange: <K extends keyof QuestionStimulusForm>(
    field: K,
    value: QuestionStimulusForm[K]
  ) => void;
  onToggleStimulus: (hasStimulus: boolean) => void;
  onQuestionTextChange: (text: string) => void;
  onSingleChoiceOptionChange: (index: number, text: string) => void;
  onSelectSingleChoiceCorrect: (label: string) => void;
  onAddSingleChoiceOption: () => void;
  onRemoveSingleChoiceOption: (index: number) => void;
  onComplexChoiceOptionChange: (index: number, text: string) => void;
  onToggleComplexChoiceCorrect: (label: string) => void;
  onAddComplexChoiceOption: () => void;
  onRemoveComplexChoiceOption: (index: number) => void;
  onMatrixStatementTextChange: (index: number, text: string) => void;
  onMatrixStatementChoiceChange: (index: number, choice: string) => void;
  onAddMatrixStatement: () => void;
  onRemoveMatrixStatement: (index: number) => void;
  onExplanationChange: (text: string) => void;
  onAnsweringTipsChange?: (text: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
}

export const PracticeCreateTemplate: React.FC<PracticeCreateTemplateProps> = ({
  packageForm,
  activeQuestion,
  competencies,
  isSubmitting = false,
  onPackageTitleChange,
  onPackageCompetencyChange,
  onPackageDescriptionChange,
  onSaveDraft,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onSaveQuestions,
  onQuestionTypeChange,
  onStimulusChange,
  onToggleStimulus,
  onQuestionTextChange,
  onSingleChoiceOptionChange,
  onSelectSingleChoiceCorrect,
  onAddSingleChoiceOption,
  onRemoveSingleChoiceOption,
  onComplexChoiceOptionChange,
  onToggleComplexChoiceCorrect,
  onAddComplexChoiceOption,
  onRemoveComplexChoiceOption,
  onMatrixStatementTextChange,
  onMatrixStatementChoiceChange,
  onAddMatrixStatement,
  onRemoveMatrixStatement,
  onExplanationChange,
  onUploadImage,
  onDeleteImage,
}) => {
  const isMultipleChoice = activeQuestion.questionType === 'pilihan-ganda';
  const isComplexMultipleChoice = activeQuestion.questionType === 'pilihan-ganda-kompleks';
  const isMatrixCategory =
    activeQuestion.questionType === 'benar-salah' ||
    activeQuestion.questionType === 'tepat-tidak-tepat' ||
    activeQuestion.questionType === 'setuju-tidak-setuju';

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* 1. Top Bar */}
      <PracticeCreateTopBar
        status={packageForm.status}
        isSubmitting={isSubmitting}
        onSaveDraft={onSaveDraft}
      />

      {/* 2. Package Metadata Card */}
      <PracticePackageMetadataCard
        title={packageForm.title}
        competencyId={packageForm.competency_id}
        description={packageForm.description}
        competencies={competencies}
        onTitleChange={onPackageTitleChange}
        onCompetencyChange={onPackageCompetencyChange}
        onDescriptionChange={onPackageDescriptionChange}
      />

      {/* 3. Main Workspace: Question Palette (Left) + Question Editor (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Palette (4 cols on xl) */}
        <div className="xl:col-span-4 2xl:col-span-3 sticky top-6">
          <PracticeQuestionPaletteCard
            questions={packageForm.questions}
            activeQuestionIndex={packageForm.activeQuestionIndex}
            onSelectQuestion={onSelectQuestion}
            onAddQuestion={onAddQuestion}
            onDeleteQuestion={onDeleteQuestion}
            onSaveQuestions={onSaveQuestions}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Column: Active Question Form (8 cols on xl) */}
        <div className="xl:col-span-8 2xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs space-y-6">
          {/* Question Header (Active Badge, Type Select) */}
          <PracticeQuestionEditorHeader
            questionNumber={activeQuestion.questionNumber}
            questionType={activeQuestion.questionType}
            onQuestionTypeChange={onQuestionTypeChange}
          />

          {/* Section 1: Stimulus Wacana */}
          <PracticeStimulusSection
            stimulus={activeQuestion.stimulus}
            onStimulusChange={onStimulusChange}
            onToggleStimulus={onToggleStimulus}
            onUploadImage={onUploadImage}
            onDeleteImage={onDeleteImage}
          />

          {/* Section 2: Pertanyaan (Stem) */}
          <PracticeStemSection
            questionText={activeQuestion.questionText}
            onQuestionTextChange={onQuestionTextChange}
            onUploadImage={onUploadImage}
            onDeleteImage={onDeleteImage}
          />

          {/* Section 3 & 4: Pilihan Jawaban & Kunci Jawaban Valid */}
          {isMultipleChoice && (
            <PracticeOptionMultipleChoiceSection
              options={activeQuestion.options}
              correctOptionLabel={activeQuestion.correctOptionLabel}
              onOptionTextChange={onSingleChoiceOptionChange}
              onSelectCorrectOption={onSelectSingleChoiceCorrect}
              onAddOption={onAddSingleChoiceOption}
              onRemoveOption={onRemoveSingleChoiceOption}
              onUploadImage={onUploadImage}
              onDeleteImage={onDeleteImage}
            />
          )}

          {isComplexMultipleChoice && (
            <PracticeOptionComplexMultipleChoiceSection
              options={activeQuestion.options}
              correctOptionLabels={activeQuestion.correctOptionLabels}
              onOptionTextChange={onComplexChoiceOptionChange}
              onToggleCorrectOption={onToggleComplexChoiceCorrect}
              onAddOption={onAddComplexChoiceOption}
              onRemoveOption={onRemoveComplexChoiceOption}
              onUploadImage={onUploadImage}
              onDeleteImage={onDeleteImage}
            />
          )}

          {isMatrixCategory && (
            <PracticeOptionMatrixCategorySection
              questionType={activeQuestion.questionType}
              statements={activeQuestion.matrixStatements}
              onStatementTextChange={onMatrixStatementTextChange}
              onStatementChoiceChange={onMatrixStatementChoiceChange}
              onAddStatement={onAddMatrixStatement}
              onRemoveStatement={onRemoveMatrixStatement}
            />
          )}

          {/* Section 5: Pembahasan Soal */}
          <PracticeExplanationSection
            explanation={activeQuestion.explanation}
            answeringTips={activeQuestion.answeringTips}
            onExplanationChange={onExplanationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeCreateTemplate;
