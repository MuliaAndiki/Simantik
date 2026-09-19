'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { PracticeCreatePage } from '@/components/page/private/content_manager/PracticeCreatePage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { PracticeQuestionType } from '@/types/ui/practice.types';
import type {
  PracticePackageEditorForm,
  QuestionEditorItemForm,
  QuestionStimulusForm,
} from '@/types/ui/practice-question-editor.types';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';

const createDefaultQuestion = (
  number: number,
  type: PracticeQuestionType = 'pilihan-ganda'
): QuestionEditorItemForm => ({
  id: `q-${Date.now()}-${number}`,
  questionNumber: number,
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

export const PracticeQuestionContainer: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const packageId = params?.id || '';

  const api = useApi();
  const ns = useAppNameSpace();

  // Queries
  const competenciesQuery = api.question.query.competencies({ limit: 100 });
  const questionTypesQuery = api.question.query.types();
  const packageDetailQuery = api.practice.query.packageDetail(packageId, {
    enabled: !!packageId,
  });

  // Mutations
  const updatePackageMutation = api.practice.mutate.updatePackage();
  const createQuestionMutation = api.question.mutate.create();
  const addQuestionsMutation = api.practice.mutate.addQuestions();

  // State: Package Form
  const [packageForm, setPackageForm] = useState<PracticePackageEditorForm>({
    id: packageId,
    title: '',
    competency_id: '',
    jenjang: 'sma',
    description: '',
    status: 'DRAFT',
    questions: [
      createDefaultQuestion(1, 'pilihan-ganda'),
      createDefaultQuestion(2, 'pilihan-ganda-kompleks'),
      createDefaultQuestion(3, 'benar-salah'),
    ],
    activeQuestionIndex: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Populate competencies
  const competencies = useMemo(() => {
    const list = competenciesQuery.data?.competencies ?? [];
    return list.map((c) => ({
      id: c.id,
      name: c.name,
    }));
  }, [competenciesQuery.data]);

  // Populate data when package details arrive
  useEffect(() => {
    if (packageDetailQuery.data) {
      const pkg = packageDetailQuery.data;

      const loadedQuestions: QuestionEditorItemForm[] =
        pkg.questions && pkg.questions.length > 0
          ? pkg.questions.map((q, idx) => {
              const options = (q.options || []).map((o) => ({
                id: o.id || String(o.display_order),
                label: o.option_label || 'A',
                text: o.option_text || '',
              }));

              return {
                id: q.id,
                questionNumber: idx + 1,
                questionType: 'pilihan-ganda' as PracticeQuestionType,
                stimulus: {
                  hasStimulus: false,
                  title: '',
                  content: '',
                  source: '',
                },
                questionText: q.question_text || '',
                options:
                  options.length > 0
                    ? options
                    : [
                        { id: '1', label: 'A', text: '' },
                        { id: '2', label: 'B', text: '' },
                        { id: '3', label: 'C', text: '' },
                        { id: '4', label: 'D', text: '' },
                      ],
                correctOptionLabel: options[0]?.label || 'A',
                correctOptionLabels: [options[0]?.label || 'A'],
                matrixStatements: [
                  { id: 'm1', label: 'A', statement: '', correctChoice: 'BENAR' },
                  { id: 'm2', label: 'B', statement: '', correctChoice: 'SALAH' },
                  { id: 'm3', label: 'C', statement: '', correctChoice: 'BENAR' },
                  { id: 'm4', label: 'D', statement: '', correctChoice: 'SALAH' },
                ],
                explanation: '',
                answeringTips: '',
              };
            })
          : [
              createDefaultQuestion(1, 'pilihan-ganda'),
              createDefaultQuestion(2, 'pilihan-ganda-kompleks'),
              createDefaultQuestion(3, 'benar-salah'),
            ];

      setPackageForm((prev) => ({
        ...prev,
        id: pkg.id,
        title: pkg.title || prev.title,
        competency_id: pkg.competency_id || prev.competency_id,
        jenjang: (pkg.jenjang as typeof prev.jenjang) || prev.jenjang,
        description: pkg.description || prev.description,
        status: (pkg.status || 'DRAFT').toUpperCase() as typeof prev.status,
        questions: loadedQuestions,
      }));
    }
  }, [packageDetailQuery.data]);

  const activeQuestion =
    packageForm.questions[packageForm.activeQuestionIndex] || packageForm.questions[0];

  // Helper: Update Active Question
  const updateActiveQuestion = (
    updater: (prev: QuestionEditorItemForm) => QuestionEditorItemForm
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

  // Handlers for Package Metadata
  const handlePackageTitleChange = (title: string) => {
    setPackageForm((prev) => ({ ...prev, title }));
  };

  const handlePackageCompetencyChange = (competency_id: string) => {
    setPackageForm((prev) => ({ ...prev, competency_id }));
  };

  const handlePackageDescriptionChange = (description: string) => {
    setPackageForm((prev) => ({ ...prev, description }));
  };

  // Handlers for Palette
  const handleSelectQuestion = (index: number) => {
    if (index >= 0 && index < packageForm.questions.length) {
      setPackageForm((prev) => ({ ...prev, activeQuestionIndex: index }));
    }
  };

  const handleAddQuestion = () => {
    setPackageForm((prev) => {
      const nextNumber = prev.questions.length + 1;
      const newQuestion = createDefaultQuestion(nextNumber, 'pilihan-ganda');
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
        message: 'Paket latihan minimal harus memiliki 1 butir soal.',
        icon: 'warning',
      });
      return;
    }

    ns.alert.confirm({
      title: 'Hapus Butir Soal',
      deskripsi: `Apakah Anda yakin ingin menghapus Soal ${String(index + 1).padStart(2, '0')}?`,
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

  // Handlers for Question Type Change
  const handleQuestionTypeChange = (type: PracticeQuestionType) => {
    updateActiveQuestion((prev) => {
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

  // Handlers for Stimulus
  const handleStimulusChange = <K extends keyof QuestionStimulusForm>(
    field: K,
    value: QuestionStimulusForm[K]
  ) => {
    updateActiveQuestion((prev) => ({
      ...prev,
      stimulus: {
        ...prev.stimulus,
        [field]: value,
      },
    }));
  };

  const handleToggleStimulus = (hasStimulus: boolean) => {
    updateActiveQuestion((prev) => ({
      ...prev,
      stimulus: {
        ...prev.stimulus,
        hasStimulus,
      },
    }));
  };

  // Handler for Stem
  const handleQuestionTextChange = (questionText: string) => {
    updateActiveQuestion((prev) => ({
      ...prev,
      questionText,
    }));
  };

  // Handlers for Single Choice Options
  const handleSingleChoiceOptionChange = (index: number, text: string) => {
    updateActiveQuestion((prev) => {
      const nextOptions = [...prev.options];
      if (nextOptions[index]) {
        nextOptions[index] = { ...nextOptions[index], text };
      }
      return { ...prev, options: nextOptions };
    });
  };

  const handleSelectSingleChoiceCorrect = (label: string) => {
    updateActiveQuestion((prev) => ({
      ...prev,
      correctOptionLabel: label,
    }));
  };

  const handleAddSingleChoiceOption = () => {
    updateActiveQuestion((prev) => {
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
    updateActiveQuestion((prev) => {
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

  // Handlers for Complex Choice
  const handleComplexChoiceOptionChange = (index: number, text: string) => {
    handleSingleChoiceOptionChange(index, text);
  };

  const handleToggleComplexChoiceCorrect = (label: string) => {
    updateActiveQuestion((prev) => {
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

  // Handlers for Matrix Category
  const handleMatrixStatementTextChange = (index: number, text: string) => {
    updateActiveQuestion((prev) => {
      const nextStatements = [...prev.matrixStatements];
      if (nextStatements[index]) {
        nextStatements[index] = { ...nextStatements[index], statement: text };
      }
      return { ...prev, matrixStatements: nextStatements };
    });
  };

  const handleMatrixStatementChoiceChange = (index: number, choice: string) => {
    updateActiveQuestion((prev) => {
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
    updateActiveQuestion((prev) => {
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
    updateActiveQuestion((prev) => {
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

  // Handler for Explanation
  const handleExplanationChange = (explanation: string) => {
    updateActiveQuestion((prev) => ({
      ...prev,
      explanation,
    }));
  };

  // Save Submission Handler
  const handleSavePackage = async () => {
    if (!packageForm.title.trim()) {
      ns.alert.toast({
        title: 'Form Belum Lengkap',
        message: 'Nama paket soal latihan wajib diisi.',
        icon: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update practice package metadata
      if (packageId) {
        await updatePackageMutation.mutateAsync({
          id: packageId,
          body: {
            title: packageForm.title.trim(),
            description: packageForm.description.trim() || undefined,
            competency_id: packageForm.competency_id || null,
            jenjang: packageForm.jenjang || 'sma',
          },
        });
      }

      // 2. Persist filled questions to question bank
      const validQuestions = packageForm.questions.filter((q) => q.questionText.trim().length > 0);

      const createdQuestionIds: string[] = [];
      const questionTypes = questionTypesQuery.data ?? [];
      const defaultTypeId = questionTypes[0]?.id || '1';

      for (const q of validQuestions) {
        const mappedOptions =
          q.questionType === 'benar-salah' ||
          q.questionType === 'tepat-tidak-tepat' ||
          q.questionType === 'setuju-tidak-setuju'
            ? q.matrixStatements.map((stmt, idx) => ({
                option_label: stmt.label,
                option_text: `${stmt.statement} [KUNCI: ${stmt.correctChoice}]`,
                is_correct: true,
                display_order: idx + 1,
              }))
            : q.options.map((opt, idx) => ({
                option_label: opt.label,
                option_text: opt.text || `Opsi ${opt.label}`,
                is_correct:
                  q.questionType === 'pilihan-ganda'
                    ? q.correctOptionLabel === opt.label
                    : q.correctOptionLabels.includes(opt.label),
                display_order: idx + 1,
              }));

        try {
          const fullQuestionText = q.stimulus.hasStimulus
            ? `[WACANA: ${q.stimulus.title || 'Wacana'}]\n${q.stimulus.content}\n\n${q.questionText}`
            : q.questionText;

          const res = await createQuestionMutation.mutateAsync({
            question_type_id: defaultTypeId,
            question_text: fullQuestionText,
            difficulty_level: 3,
            competency_ids: packageForm.competency_id ? [packageForm.competency_id] : undefined,
            options: mappedOptions,
            explanation: q.explanation
              ? {
                  explanation: q.explanation,
                  answering_tips: q.answeringTips || undefined,
                }
              : null,
          });

          if (res.data?.id) {
            createdQuestionIds.push(res.data.id);
          }
        } catch {
          // Continue saving remaining questions
        }
      }

      // 3. Attach created questions to package
      if (packageId && createdQuestionIds.length > 0) {
        try {
          await addQuestionsMutation.mutateAsync({
            id: packageId,
            body: { question_ids: createdQuestionIds },
          });
        } catch {
          // Handled
        }
      }

      ns.alert.toast({
        title: 'Berhasil Menyimpan',
        message: 'Paket latihan dan butir soal berhasil disimpan.',
        icon: 'success',
      });

      router.push('/content_manager/practice');
    } catch {
      // Handled by mutation toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for Image Upload in Question Editor & Stimulus
  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = await uploadAvatar(formData, 'practice');
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

  return (
    <PracticeCreatePage
      packageForm={packageForm}
      activeQuestion={activeQuestion}
      competencies={competencies}
      isSubmitting={isSubmitting}
      onPackageTitleChange={handlePackageTitleChange}
      onPackageCompetencyChange={handlePackageCompetencyChange}
      onPackageDescriptionChange={handlePackageDescriptionChange}
      onSaveDraft={handleSavePackage}
      onSelectQuestion={handleSelectQuestion}
      onAddQuestion={handleAddQuestion}
      onDeleteQuestion={handleDeleteQuestion}
      onSaveQuestions={handleSavePackage}
      onQuestionTypeChange={handleQuestionTypeChange}
      onStimulusChange={handleStimulusChange}
      onToggleStimulus={handleToggleStimulus}
      onUploadImage={handleUploadImage}
      onDeleteImage={handleDeleteImage}
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
    />
  );
};

export default PracticeQuestionContainer;
