import type React from 'react';
import {
  PracticeExplanationSection,
  PracticeOptionComplexMultipleChoiceSection,
  PracticeOptionMatrixCategorySection,
  PracticeOptionMultipleChoiceSection,
  PracticeQuestionEditorHeader,
  PracticeStemSection,
  PracticeStimulusSection,
} from '@/components/organisms/content_manager/practice_create';
import {
  TryoutCreateTopBar,
  TryoutLevelTabs,
  TryoutPackageMetadataCard,
  TryoutQuestionPaletteCard,
} from '@/components/organisms/content_manager/tryouts';
import type { SchoolLevel } from '@/types/service';
import type { PracticeQuestionType } from '@/types/ui/practice.types';
import type { QuestionStimulusForm } from '@/types/ui/practice-question-editor.types';
import type {
  TryoutAdaptiveQuestionItemForm,
  TryoutDifficultyLevel,
  TryoutPackageEditorForm,
} from '@/types/ui/tryout-question-editor.types';

export interface TryoutCreateTemplateProps {
  packageForm: TryoutPackageEditorForm;
  activeQuestion: TryoutAdaptiveQuestionItemForm;
  isSubmitting?: boolean;
  onPackageTitleChange: (val: string) => void;
  onPackageDurationChange: (val: number) => void;
  onPackageTotalQuestionsChange: (val: number) => void;
  onPackageJenjangChange: (val: SchoolLevel) => void;
  onPackageDescriptionChange: (val: string) => void;
  onSaveDraft: () => void;
  onSelectQuestion: (index: number) => void;
  onAddQuestion: () => void;
  onDeleteQuestion?: (index: number) => void;
  onSaveQuestions: () => void;
  onLevelChange: (level: TryoutDifficultyLevel) => void;
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
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
}

export const TryoutCreateTemplate: React.FC<TryoutCreateTemplateProps> = ({
  packageForm,
  activeQuestion,
  isSubmitting = false,
  onPackageTitleChange,
  onPackageDurationChange,
  onPackageTotalQuestionsChange,
  onPackageJenjangChange,
  onPackageDescriptionChange,
  onSaveDraft,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onSaveQuestions,
  onLevelChange,
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
  const activeVariant =
    activeQuestion.variants[activeQuestion.activeLevel] || activeQuestion.variants[1];

  const isMultipleChoice = activeVariant.questionType === 'pilihan-ganda';
  const isComplexMultipleChoice = activeVariant.questionType === 'pilihan-ganda-kompleks';
  const isMatrixCategory =
    activeVariant.questionType === 'benar-salah' ||
    activeVariant.questionType === 'tepat-tidak-tepat' ||
    activeVariant.questionType === 'setuju-tidak-setuju';

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* 1. Top Bar */}
      <TryoutCreateTopBar
        status={packageForm.status}
        isSubmitting={isSubmitting}
        onSaveDraft={onSaveDraft}
      />

      {/* 2. Tryout Package Metadata Card */}
      <TryoutPackageMetadataCard
        title={packageForm.title}
        durationMinutes={packageForm.duration_minutes}
        totalQuestions={packageForm.questions.length}
        jenjang={packageForm.jenjang}
        description={packageForm.description}
        onTitleChange={onPackageTitleChange}
        onDurationChange={onPackageDurationChange}
        onTotalQuestionsChange={onPackageTotalQuestionsChange}
        onJenjangChange={onPackageJenjangChange}
        onDescriptionChange={onPackageDescriptionChange}
      />

      {/* 3. Main Workspace: Question Palette (Left) + Question Editor (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Palette (4 cols on xl) */}
        <div className="xl:col-span-4 2xl:col-span-3 sticky top-6">
          <TryoutQuestionPaletteCard
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
          {/* Question Header */}
          <PracticeQuestionEditorHeader
            questionNumber={activeQuestion.questionNumber}
            questionType={activeVariant.questionType}
            onQuestionTypeChange={onQuestionTypeChange}
          />

          {/* Tryout Difficulty Level Tabs (C1 to C5) */}
          <TryoutLevelTabs question={activeQuestion} onLevelChange={onLevelChange} />

          {/* Section 1: Stimulus Wacana */}
          <PracticeStimulusSection
            stimulus={activeVariant.stimulus}
            onStimulusChange={onStimulusChange}
            onToggleStimulus={onToggleStimulus}
            onUploadImage={onUploadImage}
            onDeleteImage={onDeleteImage}
          />

          {/* Section 2: Pertanyaan (Stem) */}
          <PracticeStemSection
            questionText={activeVariant.questionText}
            onQuestionTextChange={onQuestionTextChange}
            onUploadImage={onUploadImage}
            onDeleteImage={onDeleteImage}
          />

          {/* Section 3 & 4: Pilihan Jawaban & Kunci Jawaban Valid */}
          {isMultipleChoice && (
            <PracticeOptionMultipleChoiceSection
              options={activeVariant.options}
              correctOptionLabel={activeVariant.correctOptionLabel}
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
              options={activeVariant.options}
              correctOptionLabels={activeVariant.correctOptionLabels}
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
              questionType={activeVariant.questionType}
              statements={activeVariant.matrixStatements}
              onStatementTextChange={onMatrixStatementTextChange}
              onStatementChoiceChange={onMatrixStatementChoiceChange}
              onAddStatement={onAddMatrixStatement}
              onRemoveStatement={onRemoveMatrixStatement}
            />
          )}

          {/* Section 5: Pembahasan Soal */}
          <PracticeExplanationSection
            explanation={activeVariant.explanation}
            answeringTips={activeVariant.answeringTips}
            onExplanationChange={onExplanationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TryoutCreateTemplate;
