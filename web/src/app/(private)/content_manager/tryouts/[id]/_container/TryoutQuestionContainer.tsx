'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TryoutCreatePage } from '@/components/page/private/content_manager/TryoutCreatePage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { CreateQuestionRequest, QuestionAdminResponse, SchoolLevel } from '@/types/service';
import type { PracticeQuestionType } from '@/types/ui/practice.types';
import type {
  QuestionChoiceOptionForm,
  QuestionMatrixStatementForm,
  QuestionStimulusForm,
} from '@/types/ui/practice-question-editor.types';
import type {
  TryoutAdaptiveQuestionItemForm,
  TryoutDifficultyLevel,
  TryoutPackageEditorForm,
  TryoutQuestionVariantForm,
} from '@/types/ui/tryout-question-editor.types';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';

const createDefaultVariant = (
  level: TryoutDifficultyLevel,
  type: PracticeQuestionType = 'pilihan-ganda'
): TryoutQuestionVariantForm => ({
  id: `v-${Date.now()}-${level}`,
  difficultyLevel: level,
  questionType: type,
  stimulus: {
    hasStimulus: false,
    title: '',
    content: '',
    source: '',
  },
  questionText: '',
  options: [
    { id: '1', label: 'A', text: '', sublabel: 'Pernyataan wacana eksplisit' },
    { id: '2', label: 'B', text: '', sublabel: 'Pernyataan pengecoh inferensial' },
    { id: '3', label: 'C', text: '', sublabel: 'Pernyataan kontradiktif' },
    { id: '4', label: 'D', text: '', sublabel: 'Pernyataan generalisasi bias' },
  ],
  correctOptionLabel: 'A',
  correctOptionLabels: ['A', 'B'],
  matrixStatements: [
    { id: 'm1', label: 'A', statement: '', correctChoice: 'BENAR' },
    { id: 'm2', label: 'B', statement: '', correctChoice: 'SALAH' },
    { id: 'm3', label: 'C', statement: '', correctChoice: 'BENAR' },
    { id: 'm4', label: 'D', statement: '', correctChoice: 'SALAH' },
  ],
  explanation: '',
  answeringTips: '',
});

const createDefaultAdaptiveQuestion = (number: number): TryoutAdaptiveQuestionItemForm => ({
  id: `q-${Date.now()}-${number}`,
  questionNumber: number,
  activeLevel: 1,
  variants: {
    1: createDefaultVariant(1, 'pilihan-ganda'),
    2: createDefaultVariant(2, 'pilihan-ganda'),
    3: createDefaultVariant(3, 'pilihan-ganda-kompleks'),
    4: createDefaultVariant(4, 'pilihan-ganda-kompleks'),
    5: createDefaultVariant(5, 'benar-salah'),
  },
});

const mapQuestionTypeCode = (type: PracticeQuestionType): string => {
  switch (type) {
    case 'pilihan-ganda':
      return 'multiple_choice';
    case 'pilihan-ganda-kompleks':
      return 'complex_multiple_choice';
    default:
      return 'true_false';
  }
};

const mapApiToVariantForm = (
  apiQ: QuestionAdminResponse,
  level: TryoutDifficultyLevel
): TryoutQuestionVariantForm => {
  let hasStimulus = false;
  let stimulusTitle = '';
  let stimulusContent = '';
  let questionText = apiQ.question_text || '';

  const stimulusMatch = questionText.match(/^\[WACANA:\s*(.*?)\]\n([\s\S]*?)\n\n([\s\S]*)$/);
  if (stimulusMatch) {
    hasStimulus = true;
    stimulusTitle = stimulusMatch[1] || '';
    stimulusContent = stimulusMatch[2] || '';
    questionText = stimulusMatch[3] || '';
  }

  const options = apiQ.options || [];
  const hasMatrixKey = options.some((opt) =>
    /\[KUNCI:\s*(BENAR|SALAH|TEPAT|TIDAK TEPAT|SETUJU|TIDAK SETUJU)\]/i.test(opt.option_text)
  );

  let questionType: PracticeQuestionType = 'pilihan-ganda';
  let matrixStatements: QuestionMatrixStatementForm[] = [
    { id: 'm1', label: 'A', statement: '', correctChoice: 'BENAR' },
    { id: 'm2', label: 'B', statement: '', correctChoice: 'SALAH' },
    { id: 'm3', label: 'C', statement: '', correctChoice: 'BENAR' },
    { id: 'm4', label: 'D', statement: '', correctChoice: 'SALAH' },
  ];
  let choiceOptions: QuestionChoiceOptionForm[] = [
    { id: '1', label: 'A', text: '', sublabel: 'Pernyataan wacana eksplisit' },
    { id: '2', label: 'B', text: '', sublabel: 'Pernyataan pengecoh inferensial' },
    { id: '3', label: 'C', text: '', sublabel: 'Pernyataan kontradiktif' },
    { id: '4', label: 'D', text: '', sublabel: 'Pernyataan generalisasi bias' },
  ];
  let correctOptionLabel = 'A';
  let correctOptionLabels: string[] = ['A', 'B'];

  if (hasMatrixKey) {
    let isTepat = false;
    let isSetuju = false;

    matrixStatements = options.map((opt, idx) => {
      const match = opt.option_text.match(
        /^(.*?)\s*\[KUNCI:\s*(BENAR|SALAH|TEPAT|TIDAK TEPAT|SETUJU|TIDAK SETUJU)\]$/i
      );
      const stmt = match ? match[1].trim() : opt.option_text;
      const choice = (match ? match[2].toUpperCase() : 'BENAR') as
        | 'BENAR'
        | 'SALAH'
        | 'TEPAT'
        | 'TIDAK TEPAT'
        | 'SETUJU'
        | 'TIDAK SETUJU';
      if (choice === 'TEPAT' || choice === 'TIDAK TEPAT') isTepat = true;
      if (choice === 'SETUJU' || choice === 'TIDAK SETUJU') isSetuju = true;
      return {
        id: opt.id || `m-${idx + 1}`,
        label: opt.option_label || String.fromCharCode(65 + idx),
        statement: stmt,
        correctChoice: choice,
      };
    });

    if (isTepat) questionType = 'tepat-tidak-tepat';
    else if (isSetuju) questionType = 'setuju-tidak-setuju';
    else questionType = 'benar-salah';
  } else if (options.length > 0) {
    choiceOptions = options.map((opt, idx) => ({
      id: opt.id || String(idx + 1),
      label: opt.option_label || String.fromCharCode(65 + idx),
      text: opt.option_text || '',
      sublabel:
        idx === 0
          ? 'Pernyataan wacana eksplisit'
          : idx === 1
            ? 'Pernyataan pengecoh inferensial'
            : idx === 2
              ? 'Pernyataan kontradiktif'
              : 'Pernyataan generalisasi bias',
    }));

    const correctOpts = options.filter((opt) => opt.is_correct);
    if (correctOpts.length > 1) {
      questionType = 'pilihan-ganda-kompleks';
      correctOptionLabels = correctOpts.map((o) => o.option_label);
      correctOptionLabel = correctOpts[0]?.option_label || 'A';
    } else {
      questionType = 'pilihan-ganda';
      correctOptionLabel = correctOpts[0]?.option_label || options[0]?.option_label || 'A';
      correctOptionLabels = [correctOptionLabel];
    }
  }

  return {
    id: apiQ.id || `v-${Date.now()}-${level}`,
    difficultyLevel: level,
    questionType,
    stimulus: {
      hasStimulus,
      title: stimulusTitle,
      content: stimulusContent,
      source: '',
    },
    questionText,
    options: choiceOptions,
    correctOptionLabel,
    correctOptionLabels,
    matrixStatements,
    explanation: apiQ.explanation?.explanation || '',
    answeringTips: apiQ.explanation?.answering_tips || '',
  };
};

export const TryoutQuestionContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const tryoutId = params?.id || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const api = useApi();
  const ns = useAppNameSpace();

  // Queries
  const questionTypesQuery = api.question.query.types();
  const tryoutDetailQuery = api.tryout.query.detail(tryoutId, {
    enabled: !!tryoutId,
  });

  // Mutations
  const updateTryoutMutation = api.tryout.mutate.update();
  const syncQuestionsMutation = api.tryout.mutate.syncQuestions();

  // State: Tryout Form
  const [packageForm, setPackageForm] = useState<TryoutPackageEditorForm>({
    id: tryoutId,
    title: '',
    jenjang: 'sma',
    description: '',
    duration_minutes: 75,
    status: 'DRAFT',
    questions: [createDefaultAdaptiveQuestion(1)],
    activeQuestionIndex: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync state when tryout detail arrives
  useEffect(() => {
    if (tryoutDetailQuery.data) {
      const t = tryoutDetailQuery.data;
      const durationMinutes = t.duration_seconds ? Math.round(t.duration_seconds / 60) : 75;

      const loadedQuestions: QuestionAdminResponse[] = t.questions || [];
      let mappedAdaptiveQuestions: TryoutAdaptiveQuestionItemForm[] = [];

      if (loadedQuestions.length > 0) {
        let currentItem: TryoutAdaptiveQuestionItemForm | null = null;

        for (let i = 0; i < loadedQuestions.length; i++) {
          const apiQ = loadedQuestions[i];
          const level = Math.max(
            1,
            Math.min(5, apiQ.difficulty_level || 1)
          ) as TryoutDifficultyLevel;

          // If no current item or current item already has this level populated with text, start new item
          if (!currentItem || currentItem.variants[level]?.questionText.trim()) {
            if (currentItem) {
              mappedAdaptiveQuestions.push(currentItem);
            }
            const qNum = mappedAdaptiveQuestions.length + 1;
            currentItem = createDefaultAdaptiveQuestion(qNum);
          }

          currentItem.variants[level] = mapApiToVariantForm(apiQ, level);
        }

        if (currentItem) {
          mappedAdaptiveQuestions.push(currentItem);
        }
      }

      if (mappedAdaptiveQuestions.length === 0) {
        mappedAdaptiveQuestions = [createDefaultAdaptiveQuestion(1)];
      }

      setPackageForm((prev) => ({
        ...prev,
        id: t.id,
        title: t.title || prev.title,
        jenjang: (t.jenjang as SchoolLevel) || prev.jenjang,
        duration_minutes: durationMinutes,
        description: t.description || prev.description,
        status: (t.status || 'DRAFT').toUpperCase() as typeof prev.status,
        questions: mappedAdaptiveQuestions,
        activeQuestionIndex: 0,
      }));
    }
  }, [tryoutDetailQuery.data]);

  const activeQuestion =
    packageForm.questions[packageForm.activeQuestionIndex] || packageForm.questions[0];

  // Helper: Update Active Question
  const updateActiveQuestion = (
    updater: (prev: TryoutAdaptiveQuestionItemForm) => TryoutAdaptiveQuestionItemForm
  ) => {
    setPackageForm((prev) => {
      const nextQuestions = [...prev.questions];
      const current = nextQuestions[prev.activeQuestionIndex];
      if (current) {
        nextQuestions[prev.activeQuestionIndex] = updater(current);
      }
      return {
        ...prev,
        questions: nextQuestions,
      };
    });
  };

  // Helper: Update Active Variant of Active Question
  const updateActiveVariant = (
    updater: (prevVariant: TryoutQuestionVariantForm) => TryoutQuestionVariantForm
  ) => {
    updateActiveQuestion((prevQ) => {
      const currentVariant =
        prevQ.variants[prevQ.activeLevel] || createDefaultVariant(prevQ.activeLevel);
      const updatedVariant = updater(currentVariant);

      return {
        ...prevQ,
        variants: {
          ...prevQ.variants,
          [prevQ.activeLevel]: updatedVariant,
        },
      };
    });
  };

  // Package Metadata Handlers
  const handlePackageTitleChange = (title: string) => {
    setPackageForm((prev) => ({ ...prev, title }));
  };

  const handlePackageDurationChange = (duration_minutes: number) => {
    setPackageForm((prev) => ({ ...prev, duration_minutes }));
  };

  const handlePackageJenjangChange = (jenjang: SchoolLevel) => {
    setPackageForm((prev) => ({ ...prev, jenjang }));
  };

  const handlePackageDescriptionChange = (description: string) => {
    setPackageForm((prev) => ({ ...prev, description }));
  };

  // Question Palette Handlers
  const handleSelectQuestion = (index: number) => {
    if (index >= 0 && index < packageForm.questions.length) {
      setPackageForm((prev) => ({ ...prev, activeQuestionIndex: index }));
    }
  };

  const handleAddQuestion = () => {
    setPackageForm((prev) => {
      const nextNumber = prev.questions.length + 1;
      const newQuestion = createDefaultAdaptiveQuestion(nextNumber);
      return {
        ...prev,
        questions: [...prev.questions, newQuestion],
        activeQuestionIndex: prev.questions.length,
      };
    });
  };

  const handleDeleteQuestion = (index: number) => {
    if (packageForm.questions.length <= 1) {
      ns.alert.toast({
        title: 'Tidak Bisa Menghapus',
        message: 'Paket tryout minimal harus memiliki 1 butir soal.',
        icon: 'warning',
      });
      return;
    }

    ns.alert.confirm({
      title: 'Hapus Butir Soal',
      deskripsi: `Apakah Anda yakin ingin menghapus Soal ${String(index + 1).padStart(2, '0')} beserta seluruh variannya (C1–C5)?`,
      icon: 'error',
      onConfirm: () => {
        setPackageForm((prev) => {
          const filtered = prev.questions.filter((_, i) => i !== index);
          const reNumbered = filtered.map((q, i) => ({
            ...q,
            questionNumber: i + 1,
          }));

          const nextActiveIndex =
            prev.activeQuestionIndex >= reNumbered.length
              ? Math.max(0, reNumbered.length - 1)
              : prev.activeQuestionIndex === index
                ? Math.min(index, reNumbered.length - 1)
                : prev.activeQuestionIndex > index
                  ? prev.activeQuestionIndex - 1
                  : prev.activeQuestionIndex;

          return {
            ...prev,
            questions: reNumbered,
            activeQuestionIndex: nextActiveIndex,
          };
        });
      },
    });
  };

  // Level Change Handler
  const handleLevelChange = (level: TryoutDifficultyLevel) => {
    updateActiveQuestion((prev) => ({
      ...prev,
      activeLevel: level,
    }));
  };

  // Question Type Handler for Current Variant
  const handleQuestionTypeChange = (type: PracticeQuestionType) => {
    updateActiveVariant((prev) => {
      let nextOptions = prev.options;
      let nextMatrix = prev.matrixStatements;

      if (type === 'pilihan-ganda' && nextOptions.length < 4) {
        nextOptions = [
          { id: '1', label: 'A', text: '', sublabel: 'Pernyataan wacana eksplisit' },
          { id: '2', label: 'B', text: '', sublabel: 'Pernyataan pengecoh inferensial' },
          { id: '3', label: 'C', text: '', sublabel: 'Pernyataan kontradiktif' },
          { id: '4', label: 'D', text: '', sublabel: 'Pernyataan generalisasi bias' },
        ];
      } else if (type === 'pilihan-ganda-kompleks' && nextOptions.length < 5) {
        nextOptions = [
          { id: '1', label: 'A', text: '' },
          { id: '2', label: 'B', text: '' },
          { id: '3', label: 'C', text: '' },
          { id: '4', label: 'D', text: '' },
          { id: '5', label: 'E', text: '' },
        ];
      } else if (type === 'tepat-tidak-tepat') {
        nextMatrix = nextMatrix.map((m) => ({
          ...m,
          correctChoice: m.correctChoice === 'BENAR' ? 'TEPAT' : 'TIDAK TEPAT',
        }));
      } else if (type === 'setuju-tidak-setuju') {
        nextMatrix = nextMatrix.map((m) => ({
          ...m,
          correctChoice: m.correctChoice === 'BENAR' ? 'SETUJU' : 'TIDAK SETUJU',
        }));
      } else if (type === 'benar-salah') {
        nextMatrix = nextMatrix.map((m) => ({
          ...m,
          correctChoice: m.correctChoice === 'TEPAT' ? 'BENAR' : 'SALAH',
        }));
      }

      return {
        ...prev,
        questionType: type,
        options: nextOptions,
        matrixStatements: nextMatrix,
      };
    });
  };

  // Stimulus Handlers
  const handleStimulusChange = <K extends keyof QuestionStimulusForm>(
    field: K,
    value: QuestionStimulusForm[K]
  ) => {
    updateActiveVariant((prev) => ({
      ...prev,
      stimulus: {
        ...prev.stimulus,
        [field]: value,
      },
    }));
  };

  const handleToggleStimulus = (hasStimulus: boolean) => {
    updateActiveVariant((prev) => ({
      ...prev,
      stimulus: {
        ...prev.stimulus,
        hasStimulus,
      },
    }));
  };

  // Question Stem Handler
  const handleQuestionTextChange = (questionText: string) => {
    updateActiveVariant((prev) => ({
      ...prev,
      questionText,
    }));
  };

  // Options Handlers
  const handleSingleChoiceOptionChange = (index: number, text: string) => {
    updateActiveVariant((prev) => {
      const nextOptions = [...prev.options];
      if (nextOptions[index]) {
        nextOptions[index] = { ...nextOptions[index], text };
      }
      return { ...prev, options: nextOptions };
    });
  };

  const handleSelectSingleChoiceCorrect = (label: string) => {
    updateActiveVariant((prev) => ({
      ...prev,
      correctOptionLabel: label,
    }));
  };

  const handleAddSingleChoiceOption = () => {
    updateActiveVariant((prev) => {
      if (prev.options.length >= 5) return prev;
      const nextLabel = String.fromCharCode(65 + prev.options.length);
      return {
        ...prev,
        options: [
          ...prev.options,
          {
            id: String(prev.options.length + 1),
            label: nextLabel,
            text: '',
          },
        ],
      };
    });
  };

  const handleRemoveSingleChoiceOption = (index: number) => {
    updateActiveVariant((prev) => {
      if (prev.options.length <= 2) return prev;
      const filtered = prev.options.filter((_, i) => i !== index);
      const reIndexed = filtered.map((opt, i) => ({
        ...opt,
        label: String.fromCharCode(65 + i),
      }));
      return {
        ...prev,
        options: reIndexed,
        correctOptionLabel: reIndexed[0]?.label || 'A',
      };
    });
  };

  const handleComplexChoiceOptionChange = (index: number, text: string) => {
    handleSingleChoiceOptionChange(index, text);
  };

  const handleToggleComplexChoiceCorrect = (label: string) => {
    updateActiveVariant((prev) => {
      const current = prev.correctOptionLabels;
      const exists = current.includes(label);
      const updated = exists ? current.filter((l) => l !== label) : [...current, label];
      return {
        ...prev,
        correctOptionLabels: updated,
      };
    });
  };

  const handleAddComplexChoiceOption = () => {
    handleAddSingleChoiceOption();
  };

  const handleRemoveComplexChoiceOption = (index: number) => {
    handleRemoveSingleChoiceOption(index);
  };

  // Matrix Category Handlers
  const handleMatrixStatementTextChange = (index: number, text: string) => {
    updateActiveVariant((prev) => {
      const nextStatements = [...prev.matrixStatements];
      if (nextStatements[index]) {
        nextStatements[index] = { ...nextStatements[index], statement: text };
      }
      return { ...prev, matrixStatements: nextStatements };
    });
  };

  const handleMatrixStatementChoiceChange = (index: number, choice: string) => {
    updateActiveVariant((prev) => {
      const nextStatements = [...prev.matrixStatements];
      if (nextStatements[index]) {
        nextStatements[index] = {
          ...nextStatements[index],
          correctChoice: choice,
        };
      }
      return { ...prev, matrixStatements: nextStatements };
    });
  };

  const handleAddMatrixStatement = () => {
    updateActiveVariant((prev) => {
      const nextLabel = String.fromCharCode(65 + prev.matrixStatements.length);
      const defaultChoice =
        prev.questionType === 'tepat-tidak-tepat'
          ? 'TEPAT'
          : prev.questionType === 'setuju-tidak-setuju'
            ? 'SETUJU'
            : 'BENAR';

      return {
        ...prev,
        matrixStatements: [
          ...prev.matrixStatements,
          {
            id: `m-${Date.now()}-${prev.matrixStatements.length + 1}`,
            label: nextLabel,
            statement: '',
            correctChoice: defaultChoice,
          },
        ],
      };
    });
  };

  const handleRemoveMatrixStatement = (index: number) => {
    updateActiveVariant((prev) => {
      if (prev.matrixStatements.length <= 2) return prev;
      const filtered = prev.matrixStatements.filter((_, i) => i !== index);
      const reIndexed = filtered.map((stmt, i) => ({
        ...stmt,
        label: String.fromCharCode(65 + i),
      }));
      return {
        ...prev,
        matrixStatements: reIndexed,
      };
    });
  };

  // Explanation Handler
  const handleExplanationChange = (explanation: string) => {
    updateActiveVariant((prev) => ({
      ...prev,
      explanation,
    }));
  };

  // Image Handlers
  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const url = await uploadAvatar(formData, 'tryouts');
      return url;
    } catch (error) {
      ns.alert.toast({
        title: 'Upload Gagal',
        message: error instanceof Error ? error.message : 'Gagal mengunggah gambar',
        icon: 'error',
      });
      throw error;
    }
  };

  const handleDeleteImage = async (url: string): Promise<void> => {
    try {
      await deleteObject(url);
    } catch (error) {
      console.error('Failed to delete orphaned image:', error);
    }
  };

  // Save Tryout Package & Variants to Question Pool
  const handleSaveTryout = async () => {
    if (!packageForm.title.trim()) {
      ns.alert.toast({
        title: 'Form Belum Lengkap',
        message: 'Nama paket tryout wajib diisi.',
        icon: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update tryout metadata
      if (tryoutId) {
        await updateTryoutMutation.mutateAsync({
          id: tryoutId,
          body: {
            title: packageForm.title.trim(),
            description: packageForm.description.trim() || undefined,
            jenjang: packageForm.jenjang,
            duration_seconds: packageForm.duration_minutes * 60,
          },
        });
      }

      // 2. Prepare questions payload across all adaptive question items & variants
      const questionTypes = questionTypesQuery.data ?? [];
      if (questionTypes.length === 0) {
        ns.alert.toast({
          title: 'Tipe Soal Belum Siap',
          message: 'Daftar tipe soal belum dimuat. Muat ulang halaman lalu coba lagi.',
          icon: 'warning',
        });
        return;
      }

      const typeIdByCode = new Map(questionTypes.map((qt) => [qt.code, qt.id]));
      const fallbackTypeId = questionTypes[0]?.id;
      const questionsPayload: CreateQuestionRequest[] = [];

      for (const q of packageForm.questions) {
        for (const lvl of [1, 2, 3, 4, 5] as TryoutDifficultyLevel[]) {
          const v = q.variants[lvl];
          if (!v?.questionText.trim()) continue;

          const questionTypeId =
            typeIdByCode.get(mapQuestionTypeCode(v.questionType)) ?? fallbackTypeId;
          if (!questionTypeId) continue;

          const mappedOptions =
            v.questionType === 'benar-salah' ||
            v.questionType === 'tepat-tidak-tepat' ||
            v.questionType === 'setuju-tidak-setuju'
              ? v.matrixStatements.map((stmt, idx) => ({
                  option_label: stmt.label,
                  option_text: `${stmt.statement} [KUNCI: ${stmt.correctChoice}]`,
                  is_correct: true,
                  display_order: idx + 1,
                }))
              : v.options.map((opt, idx) => ({
                  option_label: opt.label,
                  option_text: opt.text || `Opsi ${opt.label}`,
                  is_correct:
                    v.questionType === 'pilihan-ganda'
                      ? v.correctOptionLabel === opt.label
                      : v.correctOptionLabels.includes(opt.label),
                  display_order: idx + 1,
                }));

          const fullQuestionText = v.stimulus.hasStimulus
            ? `[WACANA: ${v.stimulus.title || 'Wacana'}]\n${v.stimulus.content}\n\n${v.questionText}`
            : v.questionText;

          questionsPayload.push({
            question_type_id: questionTypeId,
            question_text: fullQuestionText,
            difficulty_level: lvl,
            options: mappedOptions,
            explanation: v.explanation
              ? {
                  explanation: v.explanation,
                  answering_tips: v.answeringTips || undefined,
                }
              : null,
          });
        }
      }

      // 3. Sync questions to tryout pool in one single batch request
      if (tryoutId && questionsPayload.length > 0) {
        await syncQuestionsMutation.mutateAsync({
          id: tryoutId,
          body: { questions: questionsPayload },
        });
      }

      router.push(`${basePath}/tryouts`);
    } catch {
      // Handled by mutation toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TryoutCreatePage
      packageForm={packageForm}
      activeQuestion={activeQuestion}
      isSubmitting={isSubmitting}
      onPackageTitleChange={handlePackageTitleChange}
      onPackageDurationChange={handlePackageDurationChange}
      onPackageJenjangChange={handlePackageJenjangChange}
      onPackageDescriptionChange={handlePackageDescriptionChange}
      onSaveDraft={handleSaveTryout}
      onSelectQuestion={handleSelectQuestion}
      onAddQuestion={handleAddQuestion}
      onDeleteQuestion={handleDeleteQuestion}
      onSaveQuestions={handleSaveTryout}
      onLevelChange={handleLevelChange}
      onQuestionTypeChange={handleQuestionTypeChange}
      onStimulusChange={handleStimulusChange}
      onToggleStimulus={handleToggleStimulus}
      onQuestionTextChange={handleQuestionTextChange}
      onSingleChoiceOptionChange={handleSingleChoiceOptionChange}
      onSelectSingleChoiceCorrect={handleSelectSingleChoiceCorrect}
      onAddSingleChoiceOption={handleAddSingleChoiceOption}
      onRemoveSingleChoiceOption={handleRemoveSingleChoiceOption}
      onComplexChoiceOptionChange={handleComplexChoiceOptionChange}
      onToggleComplexChoiceCorrect={handleToggleComplexChoiceCorrect}
      onAddComplexChoiceOption={handleAddComplexChoiceOption}
      onRemoveComplexChoiceOption={handleRemoveComplexChoiceOption}
      onMatrixStatementTextChange={handleMatrixStatementTextChange}
      onMatrixStatementChoiceChange={handleMatrixStatementChoiceChange}
      onAddMatrixStatement={handleAddMatrixStatement}
      onRemoveMatrixStatement={handleRemoveMatrixStatement}
      onExplanationChange={handleExplanationChange}
      onUploadImage={handleUploadImage}
      onDeleteImage={handleDeleteImage}
    />
  );
};

export default TryoutQuestionContainer;
