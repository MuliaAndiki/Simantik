'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import StudentTryoutDetailPage from '@/components/page/private/student/StudentTryoutDetailPage';
import { ProctoringProvider } from '@/core/providers/proctoring';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useProctoring } from '@/hooks/useProctoring';
import type { QuestionStudentResponse, SubmitAnswerRequest } from '@/types/service';
import type {
  TryoutAnswerValue,
  TryoutChoiceOption,
  TryoutPaletteItem,
  TryoutPaletteStatus,
  TryoutQuestionItem,
  TryoutQuestionType,
} from '@/types/ui';
import { parseMatrixOptions, parseWacanaQuestion } from '@/utils/wacana';

function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Adaptive tryout wajib dijawab: engine butuh benar/salah tiap soal untuk
 * menentukan soal berikutnya. String kosong, array kosong, dan record
 * kosong semuanya berarti BELUM dijawab.
 */
function hasAnswerValue(answer: TryoutAnswerValue | undefined): boolean {
  if (answer === undefined || answer === null) return false;
  if (typeof answer === 'string') return answer.trim() !== '';
  if (Array.isArray(answer)) return answer.length > 0;
  return Object.keys(answer).length > 0;
}

function formatSecondsToDigital(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

function mapApiToTryoutQuestion(apiQ: QuestionStudentResponse, qNum: number): TryoutQuestionItem {
  let qType: TryoutQuestionType = 'pilihan-ganda';
  const code = (apiQ.question_type_code || '').toLowerCase();
  const name = (apiQ.question_type_name || '').toLowerCase();
  const typeStr = (apiQ.question_type_id || '').toLowerCase();

  if (
    code.includes('complex') ||
    code.includes('mcma') ||
    name.includes('kompleks') ||
    typeStr.includes('kompleks') ||
    typeStr.includes('mcma') ||
    typeStr.includes('complex')
  ) {
    qType = 'pilihan-ganda-kompleks';
  } else if (
    code === 'true_false' ||
    name.includes('benar') ||
    name.includes('salah') ||
    typeStr.includes('benar') ||
    typeStr.includes('salah')
  ) {
    qType = 'benar-salah';
  } else if (typeStr.includes('tepat')) {
    qType = 'tepat-tidak-tepat';
  } else if (typeStr.includes('setuju')) {
    qType = 'setuju-tidak-setuju';
  } else {
    const rawText = (apiQ.question_text || '').toLowerCase();
    if (
      rawText.includes('jawaban benar lebih dari satu') ||
      rawText.includes('jawaban lebih dari satu') ||
      rawText.includes('pilihan ganda kompleks') ||
      rawText.includes('pilihlah lebih dari satu') ||
      rawText.includes('pilih lebih dari satu') ||
      rawText.includes('dapat memilih lebih dari satu')
    ) {
      qType = 'pilihan-ganda-kompleks';
    }
  }

  const options: TryoutChoiceOption[] = (apiQ.options || []).map((o, idx) => ({
    id: o.id,
    label: o.option_label || String.fromCharCode(65 + idx),
    title: o.option_text,
    description: undefined,
  }));

  const parsed = parseWacanaQuestion(apiQ.question_text);
  // Relasi stimulus diutamakan; fallback ke marker embedded lama.
  const stimulus =
    apiQ.stimulus ??
    (parsed.hasStimulus
      ? { title: parsed.stimulusTitle, content: parsed.stimulusHtml }
      : undefined);

  // Opsi bertanda `[KUNCI: ...]` = soal matriks, bukan pilihan ganda.
  const matrix = parseMatrixOptions(apiQ.options);
  if (matrix) {
    return {
      id: apiQ.id,
      questionNumber: qNum,
      type: matrix.kind,
      questionText: parsed.bodyHtml,
      stimulus,
      statements: matrix.statements,
      difficultyLevel: apiQ.difficulty_level,
    };
  }

  return {
    id: apiQ.id,
    questionNumber: qNum,
    type: qType,
    questionText: parsed.bodyHtml,
    stimulus,
    options,
    difficultyLevel: apiQ.difficulty_level,
  };
}

export interface StudentTryoutDetailProps {
  tryoutId: string;
}

function StudentTryoutSessionContent({ tryoutId }: StudentTryoutDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Dari modal pre-start di halaman daftar: langsung mulai tanpa modal ganda.
  const preConfirmed = searchParams.get('confirmed') === '1';
  const proctoring = useProctoring();
  const ns = useAppNameSpace();
  const { tryout } = useApi();

  // Mutations
  const startAttemptMutation = tryout.mutate.startAttempt();
  const submitAnswerMutation = tryout.mutate.submitAnswer();
  const completeAttemptMutation = tryout.mutate.completeAttempt();
  const autoSubmitAttemptMutation = tryout.mutate.autoSubmit();

  // Primary Exam Session States
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const attemptIdRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(30);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(5400); // 90 minutes default
  const questionStartTimeRef = useRef<number>(Date.now());

  // User answers state: questionId -> choice value
  const [answers, setAnswers] = useState<Record<string, TryoutAnswerValue>>({});
  const [answeredNumbers, setAnsweredNumbers] = useState<Set<number>>(new Set());

  // Modal Dialogs State
  // (preConfirmed: konfirmasi sudah dilakukan di halaman daftar)
  const [isPreStartModalOpen, setIsPreStartModalOpen] = useState(!preConfirmed);
  const [isPreStartChecked, setIsPreStartChecked] = useState(preConfirmed);

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningLevel, setWarningLevel] = useState<number>(1);
  const lastViolationHandledRef = useRef<number>(0);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState<'exit' | 'submit'>('exit');
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
  const [totalDurationMinutes, setTotalDurationMinutes] = useState(75);

  // Sync attemptId to ref
  useEffect(() => {
    attemptIdRef.current = attemptId;
  }, [attemptId]);

  // Query question by number: GET /api/v1/attempts/:attemptId/questions/:number
  const isAttemptUUID = isUUID(attemptId);
  const { data: questionData, isLoading: isQuestionLoading } = tryout.query.attemptQuestion(
    attemptId || '',
    currentQuestionNumber,
    { enabled: isAttemptUUID }
  );

  // Active question derived strictly from API
  const activeQuestion: TryoutQuestionItem = useMemo(() => {
    if (questionData?.question) {
      return mapApiToTryoutQuestion(questionData.question, currentQuestionNumber);
    }
    return {
      id: `q-placeholder-${currentQuestionNumber}`,
      questionNumber: currentQuestionNumber,
      type: 'pilihan-ganda',
      questionText: isQuestionLoading ? 'Memuat butir soal...' : 'Butir soal tidak ditemukan.',
      options: [],
    };
  }, [questionData?.question, currentQuestionNumber, isQuestionLoading]);

  const currentAnswer = answers[activeQuestion.id];
  const hasCurrentAnswer = hasAnswerValue(currentAnswer);
  const isLastQuestion = currentQuestionNumber >= totalQuestions;

  // 1. Pre-Start Rules confirmation + Start Exam Attempt
  const handlePreStartConfirm = useCallback(async () => {
    setIsPreStartModalOpen(false);
    isSubmittingRef.current = false;
    lastViolationHandledRef.current = 0;
    questionStartTimeRef.current = Date.now();

    const targetTryoutParam =
      tryoutId === 'auto' || tryoutId === 'session' || !isUUID(tryoutId) ? 'auto' : tryoutId;

    try {
      const res = await startAttemptMutation.mutateAsync(targetTryoutParam);
      if (res?.data?.attempt_id) {
        setAttemptId(res.data.attempt_id);
        attemptIdRef.current = res.data.attempt_id;
        if (res.data.total_questions) {
          setTotalQuestions(res.data.total_questions);
        }
        if (res.data.duration_seconds) {
          // Rehydrate leftover timer based on StartedAt + duration - Date.now()
          const startMs = res.data.started_at
            ? new Date(res.data.started_at).getTime()
            : Date.now();
          const elapsed = Math.floor((Date.now() - startMs) / 1000);
          const leftover = Math.max(0, res.data.duration_seconds - elapsed);
          setRemainingSeconds(leftover);
          setTotalDurationMinutes(Math.round(res.data.duration_seconds / 60));

          if (leftover <= 0 || res.data.status === 'expired' || res.data.status === 'completed') {
            handleFinalizeSubmissionRef.current?.(true, 'EXPIRED_TIME');
            return;
          }
        }
        if (res.data.current_question_number) {
          setCurrentQuestionNumber(res.data.current_question_number);
          // Hydrate answered numbers
          const answered = new Set<number>();
          for (let i = 1; i < res.data.current_question_number; i++) {
            answered.add(i);
          }
          setAnsweredNumbers(answered);
        }
      }
    } catch {
      // Graceful local fallback for simulation
    }

    try {
      await proctoring.startProctoring();
    } catch {
      // ignore
    }
  }, [tryoutId, startAttemptMutation, proctoring]);

  const handlePreStartClose = useCallback(() => {
    router.push('/student/tryout');
  }, [router]);

  // Konfirmasi dari halaman daftar: mulai sesi otomatis sekali saat mount.
  const autoConfirmedRef = useRef(false);
  useEffect(() => {
    if (preConfirmed && !autoConfirmedRef.current) {
      autoConfirmedRef.current = true;
      handlePreStartConfirm();
    }
  }, [preConfirmed, handlePreStartConfirm]);

  const handlePreStartCheckChange = useCallback((checked: boolean) => {
    setIsPreStartChecked(checked);
  }, []);

  const handleTimeoutProceed = useCallback(() => {
    setIsTimeoutModalOpen(false);
    const targetAttemptId = attemptId || attemptIdRef.current;
    const queryParam = targetAttemptId ? `?attemptId=${targetAttemptId}` : '';
    router.push(`/student/tryout/${tryoutId}/result${queryParam}`);
  }, [attemptId, router, tryoutId]);

  // 2. Finalize Submission Execution (Manual or Auto-Submit)
  const handleFinalizeSubmission = useCallback(
    async (isAutoSubmit = false, reason = 'VIOLATION_THRESHOLD_EXCEEDED') => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      proctoring.stopProctoring();
      setIsConfirmModalOpen(false);
      setIsWarningModalOpen(false);

      if (reason === 'EXPIRED_TIME') {
        setIsTimeoutModalOpen(true);
      }

      const targetAttemptId = attemptId || attemptIdRef.current;

      if (targetAttemptId && isUUID(targetAttemptId)) {
        try {
          if (isAutoSubmit) {
            // Build pending answer payload for current question if answered
            const pendingAnswers: SubmitAnswerRequest[] = [];
            const curAns = answers[activeQuestion.id];
            if (curAns !== undefined) {
              pendingAnswers.push({
                question_id: activeQuestion.id,
                selected_option_id: typeof curAns === 'string' ? curAns : undefined,
                answer_data: typeof curAns !== 'string' ? JSON.stringify(curAns) : undefined,
                response_time_seconds: Math.round(
                  (Date.now() - questionStartTimeRef.current) / 1000
                ),
              });
            }

            await autoSubmitAttemptMutation.mutateAsync({
              attemptId: targetAttemptId,
              body: {
                reason,
                violation_count: Math.max(
                  proctoring.violationCount,
                  reason === 'EXPIRED_TIME' ? 0 : 4
                ),
                answers: pendingAnswers,
              },
            });
          } else {
            await completeAttemptMutation.mutateAsync(targetAttemptId);
          }
        } catch {
          // Graceful fallback to guarantee student is routed to result
        }
      }

      if (reason === 'EXPIRED_TIME') {
        // Automatically proceed after 5 seconds if student has not clicked
        setTimeout(() => {
          handleTimeoutProceed();
        }, 5000);
      } else {
        const queryParam = targetAttemptId ? `?attemptId=${targetAttemptId}` : '';
        router.push(`/student/tryout/${tryoutId}/result${queryParam}`);
      }
    },
    [
      proctoring,
      router,
      tryoutId,
      attemptId,
      answers,
      activeQuestion,
      autoSubmitAttemptMutation,
      completeAttemptMutation,
      handleTimeoutProceed,
    ]
  );

  const handleFinalizeSubmissionRef = useRef(handleFinalizeSubmission);
  useEffect(() => {
    handleFinalizeSubmissionRef.current = handleFinalizeSubmission;
  }, [handleFinalizeSubmission]);

  // 3. Timer Countdown Effect
  useEffect(() => {
    if (isPreStartModalOpen || isTimeoutModalOpen) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalizeSubmissionRef.current?.(true, 'EXPIRED_TIME');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPreStartModalOpen, isTimeoutModalOpen]);

  // 4. Proctoring Anti-Cheating & Auto-Submit on Violations > 3
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
        handleFinalizeSubmission(true, 'VIOLATION_THRESHOLD_EXCEEDED');
      }
    }
  }, [proctoring.violationCount, proctoring.isActive, handleFinalizeSubmission]);

  // 5. Answer Selection Handlers
  const handleSelectSingleChoice = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({
        ...prev,
        [activeQuestion.id]: optionId,
      }));
    },
    [activeQuestion.id]
  );

  const handleToggleComplexChoice = useCallback(
    (optionId: string) => {
      setAnswers((prev) => {
        const currentList = (prev[activeQuestion.id] as string[]) || [];
        const nextList = currentList.includes(optionId)
          ? currentList.filter((id) => id !== optionId)
          : [...currentList, optionId];
        return {
          ...prev,
          [activeQuestion.id]: nextList,
        };
      });
    },
    [activeQuestion.id]
  );

  const handleSelectMatrixChoice = useCallback(
    (statementId: string, value: string) => {
      setAnswers((prev) => {
        const currentMatrix = (prev[activeQuestion.id] as Record<string, string>) || {};
        return {
          ...prev,
          [activeQuestion.id]: {
            ...currentMatrix,
            [statementId]: value,
          },
        };
      });
    },
    [activeQuestion.id]
  );

  // 6. Next Question Progression & Adaptive Submission
  const handleNext = useCallback(async () => {
    const curAns = answers[activeQuestion.id];
    const targetAttemptId = attemptId || attemptIdRef.current;

    // Adaptive wajib ada jawaban: tolak lanjut + tandai belum dijawab.
    if (!hasAnswerValue(curAns)) {
      ns.alert.toast({
        title: 'Soal Belum Dijawab',
        message:
          'Pilih jawaban dulu sebelum lanjut — tryout adaptif menentukan soal berikutnya dari jawaban ini.',
        icon: 'warning',
      });
      return;
    }

    // Submit answer to backend to invoke Adaptive Engine
    if (targetAttemptId && isUUID(targetAttemptId)) {
      try {
        const submitRes = await submitAnswerMutation.mutateAsync({
          attemptId: targetAttemptId,
          body: {
            question_id: activeQuestion.id,
            selected_option_id: typeof curAns === 'string' ? curAns : undefined,
            answer_data: typeof curAns !== 'string' ? JSON.stringify(curAns) : undefined,
            response_time_seconds: Math.round((Date.now() - questionStartTimeRef.current) / 1000),
          },
        });
        if (
          submitRes?.data?.remaining_seconds !== undefined &&
          typeof submitRes.data.remaining_seconds === 'number'
        ) {
          setRemainingSeconds(Math.max(0, submitRes.data.remaining_seconds));
        }
      } catch {
        // Continue progression smoothly
      }
    }

    // Mark current question as answered
    setAnsweredNumbers((prev) => new Set(prev).add(currentQuestionNumber));

    // If last question, prompt final submission
    if (isLastQuestion) {
      setConfirmModalType('submit');
      setIsConfirmModalOpen(true);
      return;
    }

    // Advance to next question (Adaptive forward progression)
    setCurrentQuestionNumber((prev) => Math.min(totalQuestions, prev + 1));
    questionStartTimeRef.current = Date.now();
  }, [
    answers,
    activeQuestion.id,
    attemptId,
    currentQuestionNumber,
    isLastQuestion,
    totalQuestions,
    submitAnswerMutation,
    ns.alert,
  ]);

  // Modal Handlers
  const handleExitClick = useCallback(() => {
    setConfirmModalType('exit');
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmModalProceed = useCallback(() => {
    if (confirmModalType === 'exit') {
      handleFinalizeSubmission(true, 'USER_MANUAL_EXIT');
    } else {
      handleFinalizeSubmission(false);
    }
  }, [confirmModalType, handleFinalizeSubmission]);

  const handleConfirmModalCancel = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const handleWarningDismiss = useCallback(() => {
    setIsWarningModalOpen(false);
  }, []);

  // 7. Palette Items Generation (Adaptive non-jumping display)
  const paletteItems: TryoutPaletteItem[] = useMemo(() => {
    return Array.from({ length: totalQuestions }, (_, idx) => {
      const qNum = idx + 1;
      let status: TryoutPaletteStatus = 'locked';

      if (qNum === currentQuestionNumber) {
        status = 'active';
      } else if (answeredNumbers.has(qNum) || qNum < currentQuestionNumber) {
        status = 'answered';
      } else {
        status = 'locked';
      }

      return {
        number: qNum,
        formattedNumber: String(qNum).padStart(2, '0'),
        status,
      };
    });
  }, [totalQuestions, currentQuestionNumber, answeredNumbers]);

  const isNextSubmitting = submitAnswerMutation.isPending;
  const isFinalSubmitting =
    completeAttemptMutation.isPending || autoSubmitAttemptMutation.isPending;

  return (
    <StudentTryoutDetailPage
      title="Tryout TKA Bahasa Indonesia #1"
      currentQuestionNumber={currentQuestionNumber}
      totalQuestions={totalQuestions}
      formattedTime={formatSecondsToDigital(remainingSeconds)}
      isUrgent={remainingSeconds < 300} // less than 5 minutes
      onBack={handleExitClick}
      onExit={handleExitClick}
      question={activeQuestion}
      currentAnswer={currentAnswer}
      isLastQuestion={isLastQuestion}
      isSubmitting={isLastQuestion ? isFinalSubmitting : isNextSubmitting}
      isLoadingQuestion={isQuestionLoading}
      isStartSubmitting={startAttemptMutation.isPending}
      isConfirmSubmitting={isFinalSubmitting}
      onSelectSingleChoice={handleSelectSingleChoice}
      onToggleComplexChoice={handleToggleComplexChoice}
      onSelectMatrixChoice={handleSelectMatrixChoice}
      onNext={handleNext}
      isNextDisabled={!hasCurrentAnswer}
      paletteItems={paletteItems}
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
      answeredCount={answeredNumbers.size}
      onConfirmModalCancel={handleConfirmModalCancel}
      onConfirmModalProceed={handleConfirmModalProceed}
      isTimeoutModalOpen={isTimeoutModalOpen}
      onTimeoutProceed={handleTimeoutProceed}
      durationMinutes={totalDurationMinutes}
    />
  );
}

export function StudentTryoutDetail({ tryoutId }: StudentTryoutDetailProps) {
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
      <StudentTryoutSessionContent tryoutId={tryoutId} />
    </ProctoringProvider>
  );
}

export default StudentTryoutDetail;
