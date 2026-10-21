'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { SharedStimulusOption } from '@/components/organisms/content_manager/practice_create';
import { PracticeCreatePage } from '@/components/page/private/content_manager/PracticeCreatePage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { QuestionStudentResponse } from '@/types/service';
import type { PracticeQuestionType } from '@/types/ui/practice.types';
import type {
  PracticePackageEditorForm,
  QuestionChoiceOptionForm,
  QuestionEditorItemForm,
  QuestionMatrixStatementForm,
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
    { id: '1', label: 'A', text: '' },
    { id: '2', label: 'B', text: '' },
    { id: '3', label: 'C', text: '' },
    { id: '4', label: 'D', text: '' },
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

const mapApiQuestionToEditorForm = (
  q: QuestionStudentResponse,
  idx: number
): QuestionEditorItemForm => {
  let hasStimulus = false;
  let stimulusTitle = '';
  let stimulusContent = '';
  let stimulusId: string | null = null;
  let questionText = q.question_text || '';

  if (q.stimulus) {
    hasStimulus = true;
    stimulusTitle = q.stimulus.title || '';
    stimulusContent = q.stimulus.content || '';
    stimulusId = q.stimulus.id || null;
  } else {
    const stimulusMatch = questionText.match(/^\[WACANA:\s*(.*?)\]\n([\s\S]*?)\n\n([\s\S]*)$/);
    if (stimulusMatch) {
      hasStimulus = true;
      stimulusTitle = stimulusMatch[1] || '';
      stimulusContent = stimulusMatch[2] || '';
      questionText = stimulusMatch[3] || '';
    }
  }

  const options = q.options || [];
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

    matrixStatements = options.map((opt, oIdx) => {
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
        id: opt.id || `m-${oIdx + 1}`,
        label: opt.option_label || String.fromCharCode(65 + oIdx),
        statement: stmt,
        correctChoice: choice,
      };
    });

    if (isTepat) questionType = 'tepat-tidak-tepat';
    else if (isSetuju) questionType = 'setuju-tidak-setuju';
    else questionType = 'benar-salah';
  } else if (options.length > 0) {
    choiceOptions = options.map((opt, oIdx) => ({
      id: opt.id || String(oIdx + 1),
      label: opt.option_label || String.fromCharCode(65 + oIdx),
      text: opt.option_text || '',
      sublabel:
        oIdx === 0
          ? 'Pernyataan wacana eksplisit'
          : oIdx === 1
            ? 'Pernyataan pengecoh inferensial'
            : oIdx === 2
              ? 'Pernyataan kontradiktif'
              : 'Pernyataan generalisasi bias',
    }));

    const correctOpts = options.filter((opt) => opt.is_correct);
    const isComplex =
      q.question_type_code === 'complex_multiple_choice' ||
      (q.question_type_code || '').includes('complex') ||
      (q.question_type_name || '').toLowerCase().includes('kompleks') ||
      correctOpts.length > 1;

    if (isComplex) {
      questionType = 'pilihan-ganda-kompleks';
      correctOptionLabels =
        correctOpts.length > 0
          ? correctOpts.map((o) => o.option_label)
          : [options[0]?.option_label || 'A', options[1]?.option_label || 'B'];
      correctOptionLabel = correctOptionLabels[0] || 'A';
    } else {
      questionType = 'pilihan-ganda';
      correctOptionLabel = correctOpts[0]?.option_label || options[0]?.option_label || 'A';
      correctOptionLabels = [correctOptionLabel];
    }
  }

  return {
    id: q.id,
    questionNumber: idx + 1,
    questionType,
    stimulus: {
      hasStimulus,
      title: stimulusTitle,
      content: stimulusContent,
      source: '',
      stimulusId,
    },
    questionText,
    options: choiceOptions,
    correctOptionLabel,
    correctOptionLabels,
    matrixStatements,
    explanation: q.explanation?.explanation || '',
    answeringTips: q.explanation?.answering_tips || '',
  };
};

const hasMeaningfulPracticeDraft = (form: PracticePackageEditorForm): boolean => {
  if (form.title?.trim()) return true;
  if (form.questions.length > 1) return true;
  const q0 = form.questions[0];
  if (!q0) return false;
  if (q0.questionText?.trim()) return true;
  if (q0.explanation?.trim()) return true;
  if (q0.stimulus?.hasStimulus && (q0.stimulus.title?.trim() || q0.stimulus.content?.trim()))
    return true;
  if (q0.options?.some((o) => o.text?.trim())) return true;
  return false;
};

export const PracticeQuestionContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const packageId = params?.id || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

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
  const removeQuestionMutation = api.practice.mutate.removeQuestion();

  // Id soal yang sudah menempel di paket saat halaman dimuat.
  // Save hanya create soal baru + detach soal yang dihapus editor,
  // agar soal lama tidak terduplikasi setiap kali menyimpan.
  const initialQuestionIdsRef = useRef<string[]>([]);
  const draftStorageKey = useMemo(
    () => (packageId ? `simantik_draft_practice_${packageId}` : null),
    [packageId]
  );
  const isDraftRestoredRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);

  // State: Package Form
  const [packageForm, setPackageForm] = useState<PracticePackageEditorForm>(() => {
    if (typeof window !== 'undefined' && packageId) {
      try {
        const raw = window.localStorage.getItem(`simantik_draft_practice_${packageId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.questions) && hasMeaningfulPracticeDraft(parsed)) {
            isDraftRestoredRef.current = true;
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Gagal memulihkan draf lokal practice:', e);
      }
    }
    return {
      id: packageId,
      title: '',
      competency_id: '',
      jenjang: 'sma',
      description: '',
      status: 'DRAFT',
      questions: [createDefaultQuestion(1, 'pilihan-ganda')],
      activeQuestionIndex: 0,
    };
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Toast pemberitahuan draf dipulihkan
  useEffect(() => {
    if (isDraftRestoredRef.current) {
      ns.alert.toast({
        title: 'Draf Dipulihkan',
        message: 'Perubahan soal yang belum tersimpan telah dipulihkan otomatis.',
        icon: 'info',
      });
    }
  }, []);

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
      initialQuestionIdsRef.current = (pkg.questions ?? []).map((q) => q.id).filter(Boolean);

      // Jika user sudah memiliki draf lokal yang dipulihkan, jangan timpa soal yang sedang diedit
      if (isDraftRestoredRef.current) {
        setPackageForm((prev) => ({
          ...prev,
          id: pkg.id,
          title: prev.title || pkg.title || '',
          competency_id: prev.competency_id || pkg.competency_id || '',
          jenjang: prev.jenjang || (pkg.jenjang as typeof prev.jenjang) || 'sma',
          description: prev.description || pkg.description || '',
          status: (pkg.status || 'DRAFT').toUpperCase() as typeof prev.status,
        }));
        return;
      }

      const loadedQuestions: QuestionEditorItemForm[] =
        pkg.questions && pkg.questions.length > 0
          ? pkg.questions.map((q, idx) => mapApiQuestionToEditorForm(q, idx))
          : [createDefaultQuestion(1, 'pilihan-ganda')];

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

  // Debounced auto-save draf ke localStorage
  useEffect(() => {
    if (!draftStorageKey || typeof window === 'undefined') return;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    const handler = setTimeout(() => {
      try {
        if (hasMeaningfulPracticeDraft(packageForm)) {
          window.localStorage.setItem(draftStorageKey, JSON.stringify(packageForm));
        }
      } catch (e) {
        console.warn('Gagal menyimpan draf practice ke localStorage:', e);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [packageForm, draftStorageKey]);

  // Beforeunload listener agar browser mengonfirmasi bila ada draf yang belum disimpan
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasMeaningfulPracticeDraft(packageForm)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [packageForm]);

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
        // Matikan tautan bank saat stimulus dinonaktifkan.
        stimulusId: hasStimulus ? prev.stimulus.stimulusId : null,
      },
    }));
  };

  const createStimulusMutation = api.stimulus.mutate.create();
  const deleteStimulusMutation = api.stimulus.mutate.delete();

  // Hapus bacaan dari bank bersama + lepas tautan pada soal yang menggunakannya
  const handleDeleteSharedStimulus = (stimulusId: string) => {
    const opt = sharedStimulusOptions.find((o) => o.id === stimulusId);
    const title = opt?.title || 'bacaan bersama';
    ns.alert.confirm({
      title: 'Hapus Bacaan Bersama',
      deskripsi: `Apakah Anda yakin ingin menghapus "${title}" dari bank bacaan? Soal yang terhubung akan dilepas tautannya.`,
      icon: 'error',
      onConfirm: async () => {
        try {
          await deleteStimulusMutation.mutateAsync(stimulusId);
          setPackageForm((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
              q.stimulus?.stimulusId === stimulusId
                ? { ...q, stimulus: { ...q.stimulus, stimulusId: null } }
                : q
            ),
          }));
          ns.alert.toast({
            title: 'Stimulus Dihapus',
            message: 'Bacaan berhasil dihapus dari bank bersama.',
            icon: 'success',
          });
        } catch {
          // Handled by mutation toast
        }
      },
    });
  };

  // Simpan teks baru ke bank bersama + langsung tautkan ke soal aktif.
  const handleSaveSharedStimulus = async () => {
    const st = activeQuestion.stimulus;
    if (!st || st.stimulusId) return;
    try {
      const res = await createStimulusMutation.mutateAsync({
        title: st.title.trim(),
        content: st.content,
        package_id: packageId || undefined,
        package_kind: 'practice',
      });
      const id = res.data?.id;
      if (!id) return;
      updateActiveQuestion((prev) => ({
        ...prev,
        stimulus: { ...prev.stimulus, stimulusId: id },
      }));
      ns.alert.toast({
        title: 'Stimulus Tersimpan',
        message: 'Teks masuk bank bersama dan terhubung ke soal ini.',
        icon: 'success',
      });
    } catch {
      // Handled by mutation toast
    }
  };

  // Bank stimulus bersama (search + pilih untuk ditautkan saat save).
  const [stimulusSearch, setStimulusSearch] = useState('');
  const [stimulusLimit, setStimulusLimit] = useState(10);
  const stimuliQuery = api.stimulus.query.list({
    search: stimulusSearch.trim() || undefined,
    limit: stimulusLimit,
    // Scope per paket: stimulus milik paket lain disembunyikan.
    package_id: packageId || undefined,
    package_kind: 'practice',
  });
  const sharedStimulusOptions: SharedStimulusOption[] = useMemo(() => {
    return (stimuliQuery.data?.stimuli ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      questionCount: s.question_count,
      levelsCovered: s.levels_covered ?? [],
      isFull: false,
    }));
  }, [stimuliQuery.data]);

  const handleSelectSharedStimulus = (id: string | null) => {
    if (id === null) {
      updateActiveQuestion((prev) => ({
        ...prev,
        stimulus: { ...prev.stimulus, stimulusId: null },
      }));
      return;
    }
    const opt = sharedStimulusOptions.find((o) => o.id === id);
    if (!opt) return;
    updateActiveQuestion((prev) => ({
      ...prev,
      stimulus: {
        ...prev.stimulus,
        hasStimulus: true,
        title: opt.title,
        content: opt.content,
        stimulusId: opt.id,
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

      // 2. Sinkronisasi soal: hanya soal baru yang di-create,
      // soal lama yang dipertahankan dilewati, soal yang dihapus editor di-detach.
      const initialIds = initialQuestionIdsRef.current;
      const validQuestions = packageForm.questions.filter((q) => q.questionText.trim().length > 0);
      const validIds = new Set(validQuestions.map((q) => q.id));
      const newQuestions = validQuestions.filter((q) => !initialIds.includes(q.id));
      const removedIds = initialIds.filter((id) => !validIds.has(id));

      const createdQuestionIds: string[] = [];
      const questionTypes = questionTypesQuery.data ?? [];
      const typeIdByCode = new Map(questionTypes.map((qt) => [qt.code, qt.id]));
      const fallbackTypeId = questionTypes[0]?.id || '1';

      for (const q of newQuestions) {
        const mappedCode =
          q.questionType === 'pilihan-ganda-kompleks'
            ? 'complex_multiple_choice'
            : q.questionType === 'pilihan-ganda'
              ? 'multiple_choice'
              : 'true_false';
        const targetTypeId =
          typeIdByCode.get(mappedCode) ??
          questionTypes.find((qt) =>
            mappedCode === 'complex_multiple_choice'
              ? qt.code.includes('complex') || qt.name.toLowerCase().includes('kompleks')
              : mappedCode === 'multiple_choice'
                ? qt.code === 'multiple_choice'
                : qt.code === 'true_false' || qt.name.toLowerCase().includes('benar')
          )?.id ??
          fallbackTypeId;

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
          // Tertaut bank bersama -> teks polos (relasi di BE), tanpa marker duplikat.
          const fullQuestionText =
            q.stimulus.stimulusId || !q.stimulus.hasStimulus
              ? q.questionText
              : `[WACANA: ${q.stimulus.title || 'Wacana'}]\n${q.stimulus.content}\n\n${q.questionText}`;

          const res = await createQuestionMutation.mutateAsync({
            question_type_id: targetTypeId,
            question_text: fullQuestionText,
            difficulty_level: 3,
            competency_ids: packageForm.competency_id ? [packageForm.competency_id] : undefined,
            stimulus_id: q.stimulus.stimulusId || undefined,
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

      // 4. Detach questions deleted in editor
      if (packageId && removedIds.length > 0) {
        for (const questionId of removedIds) {
          try {
            await removeQuestionMutation.mutateAsync({ id: packageId, questionId });
          } catch {
            // Continue detaching remaining questions
          }
        }
      }

      initialQuestionIdsRef.current = [
        ...initialIds.filter((id) => validIds.has(id)),
        ...createdQuestionIds,
      ];

      // Bersihkan draf lokal karena paket sudah berhasil disimpan
      if (draftStorageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(draftStorageKey);
        } catch {
          // Ignore
        }
      }
      isDraftRestoredRef.current = false;

      ns.alert.toast({
        title: 'Berhasil Menyimpan',
        message: 'Paket latihan dan butir soal berhasil disimpan.',
        icon: 'success',
      });

      router.push(`${basePath}/practice`);
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
      sharedStimuli={sharedStimulusOptions}
      isLoadingSharedStimuli={stimuliQuery.isPending}
      stimulusSearch={stimulusSearch}
      onStimulusSearchChange={setStimulusSearch}
      onSelectSharedStimulus={handleSelectSharedStimulus}
      onSaveSharedStimulus={handleSaveSharedStimulus}
      isSavingSharedStimulus={createStimulusMutation.isPending}
      hasMoreSharedStimuli={(stimuliQuery.data?.total ?? 0) > sharedStimulusOptions.length}
      onLoadMoreSharedStimuli={() => setStimulusLimit((n) => n + 10)}
      onDeleteSharedStimulus={handleDeleteSharedStimulus}
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
