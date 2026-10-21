'use client';

import { FileQuestion } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { QuestionPaletteItem } from '@/components/organisms/student/PracticeQuestionPalette';
import { StudentPracticeDetailPage } from '@/components/page/private/student/StudentPracticeDetailPage';
import { useApi } from '@/hooks/useApi';
import { ProctoringProvider, useProctoring } from '@/hooks/useProctoring';
import type { QuestionAdminResponse, QuestionStudentResponse } from '@/types/service';
import type {
  ChoiceOption,
  PracticeQuestionItem,
  PracticeQuestionType,
  QuestionAnswerValue,
  QuestionPaletteStatus,
} from '@/types/ui';
import { buildStimulusQuestionMap, getStimulusKey } from '@/utils/stimulus.util';
import { parseMatrixOptions, parseWacanaQuestion } from '@/utils/wacana';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

export type QuestionTypeMap = Map<string, { code: string; name: string }>;

function mapApiQuestionType(
  q: QuestionAdminResponse | QuestionStudentResponse,
  typeMap?: QuestionTypeMap
): PracticeQuestionType {
  // 1. Cek langsung dari response backend (jika ada relasi type preloaded)
  const code = (q.question_type_code || '').toLowerCase();
  const name = (q.question_type_name || '').toLowerCase();
  if (code.includes('complex') || code.includes('mcma') || name.includes('kompleks')) {
    return 'pilihan-ganda-kompleks';
  }
  if (code === 'true_false' || name.includes('benar') || name.includes('salah')) {
    return 'benar-salah';
  }

  // 2. Cek via mapping dari master question types (lookup UUID id)
  const rawId = (q.question_type_id || '').toLowerCase();
  const meta = typeMap?.get(rawId);
  if (meta) {
    if (
      meta.code.includes('complex') ||
      meta.code.includes('mcma') ||
      meta.name.includes('kompleks')
    ) {
      return 'pilihan-ganda-kompleks';
    }
    if (meta.code === 'true_false' || meta.name.includes('benar') || meta.name.includes('salah')) {
      return 'benar-salah';
    }
  }

  // 3. Fallback jika string question_type_id berupa label tipe
  if (rawId.includes('kompleks') || rawId.includes('mcma') || rawId.includes('complex')) {
    return 'pilihan-ganda-kompleks';
  }
  if (rawId.includes('benar') || rawId.includes('salah')) return 'benar-salah';
  if (rawId.includes('tepat') && rawId.includes('tidak')) return 'tepat-tidak-tepat';
  if (rawId.includes('setuju') && rawId.includes('tidak')) return 'setuju-tidak-setuju';

  // 4. Deteksi heuristik jika ada lebih dari satu opsi kunci jawaban benar (admin preview)
  const correctCount = (q.options || []).filter((opt) => (opt as any).is_correct === true).length;
  if (correctCount > 1) {
    return 'pilihan-ganda-kompleks';
  }

  // 5. Deteksi heuristik dari teks/instruksi pertanyaan jika tipe tersimpan secara default di DB
  const rawText = (q.question_text || '').toLowerCase();
  if (
    rawText.includes('jawaban benar lebih dari satu') ||
    rawText.includes('jawaban lebih dari satu') ||
    rawText.includes('pilihan ganda kompleks') ||
    rawText.includes('pilihlah lebih dari satu') ||
    rawText.includes('pilih lebih dari satu') ||
    rawText.includes('dapat memilih lebih dari satu')
  ) {
    return 'pilihan-ganda-kompleks';
  }

  return 'pilihan-ganda';
}

function transformApiQuestions(
  apiQuestions: (QuestionAdminResponse | QuestionStudentResponse)[] | undefined,
  competencyName: string,
  typeMap?: QuestionTypeMap
): PracticeQuestionItem[] {
  if (!apiQuestions || apiQuestions.length === 0) {
    return [];
  }

  const items: PracticeQuestionItem[] = apiQuestions.map((q, idx) => {
    const compBadge =
      q.competencies && q.competencies.length > 0
        ? q.competencies.map((c) => c.name.toUpperCase()).join(' • ')
        : competencyName.toUpperCase();

    // Relasi stimulus diutamakan; fallback ke marker embedded lama
    // `[WACANA: title]\n<html>\n\n<html>`.
    const parsed = parseWacanaQuestion(q.question_text);
    // QuestionAdminResponse tak punya relasi stimulus — narrow aman.
    const related = 'stimulus' in q ? q.stimulus : undefined;
    const stimulus =
      related ??
      (parsed.hasStimulus
        ? { title: parsed.stimulusTitle, content: parsed.stimulusHtml }
        : undefined);

    // Opsi bertanda `[KUNCI: ...]` = soal matriks (benar-salah / tepat / setuju).
    const matrix = parseMatrixOptions(q.options);
    if (matrix) {
      return {
        id: q.id,
        questionNumber: idx + 1,
        competencyBadge: compBadge,
        type: matrix.kind,
        instruction:
          'Petunjuk: Baca pertanyaan dengan teliti, lalu pilih opsi jawaban yang paling tepat.',
        questionText: parsed.bodyHtml,
        stimulus,
        statements: matrix.statements,
      };
    }

    const options: ChoiceOption[] = (q.options ?? []).map((opt) => ({
      id: opt.id,
      label: opt.option_label,
      title: opt.option_text,
    }));

    return {
      id: q.id,
      questionNumber: idx + 1,
      competencyBadge: compBadge,
      type: mapApiQuestionType(q, typeMap),
      instruction:
        'Petunjuk: Baca pertanyaan dengan teliti, lalu pilih opsi jawaban yang paling tepat.',
      questionText: parsed.bodyHtml,
      stimulus,
      options,
    };
  });

  // Hitung relasi nomor soal secara dinamis untuk stimulus bersama
  const stimulusMap = buildStimulusQuestionMap(items);

  return items.map((item) => {
    if (!item.stimulus) return item;
    const key = getStimulusKey(item.stimulus);
    const relatedNumbers = (key ? stimulusMap.get(key) : undefined) || [item.questionNumber];
    return {
      ...item,
      relatedQuestionNumbers: relatedNumbers,
      stimulus: {
        ...item.stimulus,
        relatedQuestionNumbers: relatedNumbers,
      },
    };
  });
}

export interface StudentPracticeDetailProps {
  packageId: string;
}

function StudentPracticeSessionContent({ packageId }: StudentPracticeDetailProps) {
  const router = useRouter();
  const proctoring = useProctoring();
  const { practice, question } = useApi();

  const isPackageUUID = isUUID(packageId);

  // 1. Fetch practice package detail from GET /api/v1/practices/:id
  const { data: practicePackage, isLoading: isPackageLoading } = practice.query.detail(packageId, {
    enabled: isPackageUUID,
  });

  // Mutations
  const startPracticeMutation = practice.mutate.start();
  const submitPracticeMutation = practice.mutate.submitPractice();
  const autoSubmitPracticeMutation = practice.mutate.autoSubmit();

  // 2. Competency detail query (fallback if direct package detail is empty)
  const { data: competencyData } = question.query.competencyDetail(packageId, {
    enabled: isPackageUUID && !practicePackage,
  });

  // 3. Fallback questions query by competency if package has no pre-bound questions
  const { data: questionsPage, isLoading: isQuestionsLoading } = question.query.list(
    {
      competency_id: isPackageUUID ? packageId : undefined,
      limit: 20,
    },
    {
      enabled:
        isPackageUUID && (!practicePackage?.questions || practicePackage.questions.length === 0),
    }
  );

  const competencyName =
    practicePackage?.competency_name || competencyData?.name || 'Menemukan Informasi Tersurat';

  const categoryLabel = practicePackage?.competency_code
    ? `PEMAHAMAN ${practicePackage.competency_code.replace(/-/g, ' ').toUpperCase()}`
    : competencyData?.code
      ? `PEMAHAMAN ${competencyData.code.replace(/-/g, ' ').toUpperCase()}`
      : 'PEMAHAMAN TEKSTUAL';

  const title = (
    practicePackage?.title ||
    competencyData?.name ||
    'MENEMUKAN INFORMASI TERSURAT'
  ).toUpperCase();

  // 4. Question Types Master Query
  const questionTypesQuery = question.query.types();

  const typeMap = useMemo<QuestionTypeMap>(() => {
    const map = new Map<string, { code: string; name: string }>();
    for (const qt of questionTypesQuery.data ?? []) {
      map.set(qt.id.toLowerCase(), {
        code: (qt.code || '').toLowerCase(),
        name: (qt.name || '').toLowerCase(),
      });
    }
    return map;
  }, [questionTypesQuery.data]);

  // 5. Questions dataset: prioritize package questions, then competency questions, fallback to defaults
  const questions: PracticeQuestionItem[] = useMemo(() => {
    if (practicePackage?.questions && practicePackage.questions.length > 0) {
      return transformApiQuestions(practicePackage.questions, competencyName, typeMap);
    }
    return transformApiQuestions(questionsPage?.questions, competencyName, typeMap);
  }, [practicePackage?.questions, questionsPage?.questions, competencyName, typeMap]);

  const totalQuestions = questions.length;

  // Session navigation & answers state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswerValue>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const attemptIdRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    attemptIdRef.current = attemptId;
  }, [attemptId]);

  const startPracticeMutationRef = useRef(startPracticeMutation);
  startPracticeMutationRef.current = startPracticeMutation;
  const proctoringRef = useRef(proctoring);
  proctoringRef.current = proctoring;
  const hasStartedPracticeRef = useRef(false);

  // Start practice attempt & proctoring automatically on mount once
  useEffect(() => {
    if (hasStartedPracticeRef.current) return;
    hasStartedPracticeRef.current = true;

    if (isPackageUUID && !attemptIdRef.current) {
      startPracticeMutationRef.current
        .mutateAsync(packageId)
        .then((startRes) => {
          if (startRes?.data?.attempt_id) {
            setAttemptId(startRes.data.attempt_id);
            attemptIdRef.current = startRes.data.attempt_id;
          }
        })
        .catch(() => {});
    }

    proctoringRef.current.startProctoring().catch(() => {});
  }, [packageId, isPackageUUID]);

  // Pre-Start Rules Modal State (default false as modal is confirmed before navigation)
  const [isPreStartModalOpen, setIsPreStartModalOpen] = useState(false);
  const [isPreStartChecked, setIsPreStartChecked] = useState(false);

  // Proctoring Warning Modal State
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningLevel, setWarningLevel] = useState<number>(1);
  const lastViolationHandledRef = useRef(0);

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState<'exit' | 'submit'>('exit');

  // Safe boundary check on questions
  const safeIndex = Math.min(currentIndex, Math.max(0, totalQuestions - 1));
  const currentQuestion = questions[safeIndex] ?? questions[0];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isCurrentFlagged = flaggedQuestions.has(safeIndex + 1);

  // Toggle flagged status for current question
  const handleToggleFlag = useCallback(() => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      const qNum = safeIndex + 1;
      if (next.has(qNum)) {
        next.delete(qNum);
      } else {
        next.add(qNum);
      }
      return next;
    });
  }, [safeIndex]);

  // Answer selection handlers (pure local state, zero network request per choice)
  const [feedback] = useState<
    Record<string, { isCorrect?: boolean; explanation?: string; answeringTips?: string }>
  >({});

  const handleSelectSingleChoice = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    },
    [currentQuestion]
  );

  const handleToggleComplexChoice = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => {
        const currentList = (prev[currentQuestion.id] as string[]) || [];
        const nextList = currentList.includes(optionId)
          ? currentList.filter((id) => id !== optionId)
          : [...currentList, optionId];

        return {
          ...prev,
          [currentQuestion.id]: nextList,
        };
      });
    },
    [currentQuestion]
  );

  const handleSelectMatrixChoice = useCallback(
    (statementId: string, value: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => {
        const currentMatrix = (prev[currentQuestion.id] as Record<string, string>) || {};
        return {
          ...prev,
          [currentQuestion.id]: {
            ...currentMatrix,
            [statementId]: value,
          },
        };
      });
    },
    [currentQuestion]
  );

  // Pre-Start Rules confirmation + Start Practice on backend
  const handlePreStartConfirm = useCallback(async () => {
    setIsPreStartModalOpen(false);
    setCurrentIndex(0);
    setAnswers({});
    setFlaggedQuestions(new Set());
    lastViolationHandledRef.current = 0;
    isSubmittingRef.current = false;

    // Start practice attempt on backend: POST /api/v1/practices/:id/start
    if (isPackageUUID) {
      try {
        const startRes = await startPracticeMutation.mutateAsync(packageId);
        if (startRes?.data?.attempt_id) {
          setAttemptId(startRes.data.attempt_id);
          attemptIdRef.current = startRes.data.attempt_id;
        }
      } catch {
        // graceful offline/local fallback
      }
    }

    try {
      await proctoring.startProctoring();
    } catch {
      // ignore
    }
  }, [packageId, isPackageUUID, startPracticeMutation, proctoring]);

  const handlePreStartClose = useCallback(() => {
    router.push('/student/practice');
  }, [router]);

  const handlePreStartCheckChange = useCallback((checked: boolean) => {
    setIsPreStartChecked(checked);
  }, []);

  // Direct Submission execution (Sends final bulk answers payload to backend)
  const executeSubmission = useCallback(
    async (isAutoSubmit = false) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      proctoring.stopProctoring();
      setIsConfirmModalOpen(false);
      setIsWarningModalOpen(false);

      let targetAttemptId = attemptId || attemptIdRef.current;

      if (!targetAttemptId && isPackageUUID) {
        try {
          const startRes = await startPracticeMutation.mutateAsync(packageId);
          if (startRes?.data?.attempt_id) {
            targetAttemptId = startRes.data.attempt_id;
            setAttemptId(targetAttemptId);
            attemptIdRef.current = targetAttemptId;
          }
        } catch {
          // ignore
        }
      }

      if (targetAttemptId && isUUID(targetAttemptId)) {
        try {
          const answersPayload = Object.entries(answers).map(([qId, val]) => {
            if (typeof val === 'string') {
              return {
                question_id: qId,
                selected_option_id: isUUID(val) ? val : undefined,
                answer_data: val,
              };
            }
            return {
              question_id: qId,
              answer_data: JSON.stringify(val),
            };
          });

          if (isAutoSubmit) {
            await autoSubmitPracticeMutation.mutateAsync({
              attemptId: targetAttemptId,
              body: {
                reason:
                  'Batas toleransi pelanggaran tata tertib terlampaui (> 3 kali perpindahan tab/layar)',
                violation_count: Math.max(proctoring.violationCount, 4),
                answers: answersPayload,
              },
            });
          } else {
            await submitPracticeMutation.mutateAsync({
              attemptId: targetAttemptId,
              body: answersPayload,
            });
          }
        } catch {
          // ignore error to ensure student is redirected to result page
        }
      }

      const queryParam = targetAttemptId ? `?attemptId=${targetAttemptId}` : '';
      router.push(`/student/practice/${packageId}/result${queryParam}`);
    },
    [
      proctoring,
      router,
      packageId,
      attemptId,
      answers,
      isPackageUUID,
      startPracticeMutation,
      submitPracticeMutation,
      autoSubmitPracticeMutation,
    ]
  );

  // Proctoring tab-switch / cheat detection watcher
  // Auto-submit triggers when violations exceed 3 (> 3 kali)
  useEffect(() => {
    if (!proctoring.isActive) return;

    const count = proctoring.violationCount;
    if (count > lastViolationHandledRef.current) {
      lastViolationHandledRef.current = count;

      if (count === 1) {
        setWarningLevel(1);
        setIsWarningModalOpen(true);
      } else if (count === 2) {
        setWarningLevel(2);
        setIsWarningModalOpen(true);
      } else if (count === 3) {
        setWarningLevel(3);
        setIsWarningModalOpen(true);
      } else if (count > 3) {
        setIsWarningModalOpen(false);
        executeSubmission(true);
      }
    }
  }, [proctoring.violationCount, proctoring.isActive, executeSubmission]);

  // Palette item calculation
  const paletteItems: QuestionPaletteItem[] = useMemo(() => {
    return questions.map((q, idx) => {
      const qNum = idx + 1;
      const ans = answers[q.id];
      let hasAnswer = false;
      if (q.type === 'pilihan-ganda') {
        hasAnswer = typeof ans === 'string' && ans !== '';
      } else if (q.type === 'pilihan-ganda-kompleks') {
        hasAnswer = Array.isArray(ans) && ans.length > 0;
      } else if (
        q.type === 'benar-salah' ||
        q.type === 'tepat-tidak-tepat' ||
        q.type === 'setuju-tidak-setuju'
      ) {
        hasAnswer = typeof ans === 'object' && ans !== null && Object.keys(ans).length > 0;
      }

      let status: QuestionPaletteStatus = 'unanswered';

      // Soal aktif yang sudah dijawab tetap 'answered' agar kehitung di legend;
      // styling kuning aktif tetap diprioritaskan via isCurrent di palette.
      if (idx === safeIndex && !hasAnswer) {
        status = 'active';
      } else if (flaggedQuestions.has(qNum)) {
        status = 'flagged';
      } else if (hasAnswer) {
        status = 'answered';
      }

      return {
        number: qNum,
        status,
      };
    });
  }, [questions, safeIndex, flaggedQuestions, answers]);

  // Navigation button handlers
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
  }, [totalQuestions]);

  const handleSelectQuestionNumber = useCallback(
    (targetIndex: number) => {
      if (targetIndex >= 0 && targetIndex < totalQuestions) {
        setCurrentIndex(targetIndex);
      }
    },
    [totalQuestions]
  );

  // Modals actions
  const handleExitClick = useCallback(() => {
    setConfirmModalType('exit');
    setIsConfirmModalOpen(true);
  }, []);

  const handleSubmitClick = useCallback(() => {
    setConfirmModalType('submit');
    setIsConfirmModalOpen(true);
  }, []);

  const handleWarningDismiss = useCallback(() => {
    setIsWarningModalOpen(false);
  }, []);

  const handleConfirmModalCancel = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const handleConfirmModalProceed = useCallback(() => {
    if (confirmModalType === 'exit') {
      proctoring.stopProctoring();
      router.push('/student/practice');
    } else {
      executeSubmission(false);
    }
  }, [confirmModalType, proctoring, router, executeSubmission]);

  if (isPackageLoading || (isQuestionsLoading && !practicePackage?.questions?.length)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Memuat paket latihan...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="p-4 bg-slate-100 text-slate-500 rounded-full">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Belum Ada Soal Latihan</h2>
        <p className="text-sm text-slate-500 max-w-md">
          Paket latihan ini belum memiliki butir soal yang dipublikasikan. Silakan coba paket
          latihan lainnya.
        </p>
        <button
          type="button"
          onClick={() => router.push('/student/practice')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Kembali ke Daftar Latihan
        </button>
      </div>
    );
  }

  return (
    <StudentPracticeDetailPage
      competencyName={competencyName}
      title={title}
      categoryLabel={categoryLabel}
      subCategory="TKA Bahasa Indonesia"
      isFlagged={isCurrentFlagged}
      onToggleFlag={handleToggleFlag}
      onExit={handleExitClick}
      currentQuestion={currentQuestion}
      currentAnswer={currentAnswer}
      feedback={currentQuestion ? feedback[currentQuestion.id] : undefined}
      onSelectSingleChoice={handleSelectSingleChoice}
      onToggleComplexChoice={handleToggleComplexChoice}
      onSelectMatrixChoice={handleSelectMatrixChoice}
      currentIndex={safeIndex}
      totalQuestions={totalQuestions}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmitClick}
      paletteItems={paletteItems}
      onSelectQuestionNumber={handleSelectQuestionNumber}
      isPreStartModalOpen={isPreStartModalOpen}
      isPreStartChecked={isPreStartChecked}
      onPreStartCheckChange={handlePreStartCheckChange}
      onPreStartConfirm={handlePreStartConfirm}
      onPreStartClose={handlePreStartClose}
      isWarningModalOpen={isWarningModalOpen}
      violationCount={warningLevel}
      onWarningDismiss={handleWarningDismiss}
      isConfirmModalOpen={isConfirmModalOpen}
      confirmModalType={confirmModalType}
      isSubmitting={submitPracticeMutation.isPending || autoSubmitPracticeMutation.isPending}
      onConfirmModalCancel={handleConfirmModalCancel}
      onConfirmModalProceed={handleConfirmModalProceed}
    />
  );
}

export function StudentPracticeDetail({ packageId }: StudentPracticeDetailProps) {
  return (
    <ProctoringProvider
      config={{
        maxViolations: 4,
        requireFullscreen: false,
        preventCopy: true,
        preventPaste: true,
        preventContextMenu: true,
        preventDevtoolsShortcut: true,
      }}
    >
      <StudentPracticeSessionContent packageId={packageId} />
    </ProctoringProvider>
  );
}

export default StudentPracticeDetail;
