'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import StudentTryoutDetailPage from '@/components/page/private/student/StudentTryoutDetailPage';
import { ProctoringProvider } from '@/core/providers/proctoring';
import { DEFAULT_TRYOUT_QUESTIONS } from '@/data/tryoutQuestions.data';
import { useApi } from '@/hooks/useApi';
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

function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
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
  const typeStr = (apiQ.question_type_id || '').toLowerCase();
  if (typeStr.includes('kompleks') || typeStr.includes('mcma') || typeStr.includes('complex')) {
    qType = 'pilihan-ganda-kompleks';
  } else if (typeStr.includes('benar') || typeStr.includes('salah')) {
    qType = 'benar-salah';
  } else if (typeStr.includes('tepat')) {
    qType = 'tepat-tidak-tepat';
  } else if (typeStr.includes('setuju')) {
    qType = 'setuju-tidak-setuju';
  }

  const options: TryoutChoiceOption[] = (apiQ.options || []).map((o, idx) => ({
    id: o.id,
    label: o.option_label || String.fromCharCode(65 + idx),
    title: o.option_text,
    description: undefined,
  }));

  return {
    id: apiQ.id,
    questionNumber: qNum,
    type: qType,
    questionText: apiQ.question_text,
    options,
    difficultyLevel: apiQ.difficulty_level,
  };
}

export interface StudentTryoutDetailProps {
  tryoutId: string;
}

function StudentTryoutSessionContent({ tryoutId }: StudentTryoutDetailProps) {
  const router = useRouter();
  const proctoring = useProctoring();
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
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [answeredNumbers, setAnsweredNumbers] = useState<Set<number>>(new Set());

  // Modal Dialogs State
  const [isPreStartModalOpen, setIsPreStartModalOpen] = useState(true);
  const [isPreStartChecked, setIsPreStartChecked] = useState(false);

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

  // Fallback question dataset for resilience & offline presentation
  const activeQuestion: TryoutQuestionItem = useMemo(() => {
    if (questionData?.question) {
      return mapApiToTryoutQuestion(questionData.question, currentQuestionNumber);
    }
    const idx = Math.min(
      Math.max(0, currentQuestionNumber - 1),
      DEFAULT_TRYOUT_QUESTIONS.length - 1
    );
    return DEFAULT_TRYOUT_QUESTIONS[idx];
  }, [questionData?.question, currentQuestionNumber]);

  const currentAnswer = answers[activeQuestion.id];
  const isCurrentFlagged = flaggedQuestions.has(currentQuestionNumber);
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

  // 3. Timer Countdown Effect
  useEffect(() => {
    if (isPreStartModalOpen) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalizeSubmission(true, 'EXPIRED_TIME');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPreStartModalOpen, handleFinalizeSubmission]);

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

  // Toggle flagged (Ragu-ragu) status
  const handleToggleFlag = useCallback(() => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestionNumber)) {
        next.delete(currentQuestionNumber);
      } else {
        next.add(currentQuestionNumber);
      }
      return next;
    });
  }, [currentQuestionNumber]);

  // 6. Next Question Progression & Adaptive Submission
  const handleNext = useCallback(async () => {
    const curAns = answers[activeQuestion.id];
    const targetAttemptId = attemptId || attemptIdRef.current;

    // Submit answer to backend to invoke Adaptive Engine
    if (targetAttemptId && isUUID(targetAttemptId) && curAns !== undefined) {
      try {
        await submitAnswerMutation.mutateAsync({
          attemptId: targetAttemptId,
          body: {
            question_id: activeQuestion.id,
            selected_option_id: typeof curAns === 'string' ? curAns : undefined,
            answer_data: typeof curAns !== 'string' ? JSON.stringify(curAns) : undefined,
            response_time_seconds: Math.round((Date.now() - questionStartTimeRef.current) / 1000),
          },
        });
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
      } else if (flaggedQuestions.has(qNum)) {
        status = 'flagged';
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
  }, [totalQuestions, currentQuestionNumber, flaggedQuestions, answeredNumbers]);

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
      isFlagged={isCurrentFlagged}
      isLastQuestion={isLastQuestion}
      isSubmitting={isQuestionLoading || submitAnswerMutation.isPending}
      onSelectSingleChoice={handleSelectSingleChoice}
      onToggleComplexChoice={handleToggleComplexChoice}
      onSelectMatrixChoice={handleSelectMatrixChoice}
      onToggleFlag={handleToggleFlag}
      onNext={handleNext}
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
