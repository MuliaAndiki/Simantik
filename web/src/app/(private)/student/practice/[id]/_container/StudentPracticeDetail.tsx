'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { QuestionPaletteItem } from '@/components/organisms/student/PracticeQuestionPalette';
import { StudentPracticeDetailPage } from '@/components/page/private/student/StudentPracticeDetailPage';
import { DEFAULT_PRACTICE_QUESTIONS } from '@/data/practiceQuestions.data';
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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

function mapApiQuestionType(_typeId: string): PracticeQuestionType {
  return 'pilihan-ganda';
}

function transformApiQuestions(
  apiQuestions: (QuestionAdminResponse | QuestionStudentResponse)[] | undefined,
  competencyName: string
): PracticeQuestionItem[] {
  if (!apiQuestions || apiQuestions.length === 0) {
    return DEFAULT_PRACTICE_QUESTIONS;
  }

  return apiQuestions.map((q, idx) => {
    const options: ChoiceOption[] = (q.options ?? []).map((opt) => ({
      id: opt.id,
      label: opt.option_label,
      title: opt.option_text,
    }));

    const compBadge =
      q.competencies && q.competencies.length > 0
        ? q.competencies.map((c) => c.name.toUpperCase()).join(' • ')
        : competencyName.toUpperCase();

    return {
      id: q.id,
      questionNumber: idx + 1,
      competencyBadge: compBadge,
      type: mapApiQuestionType(q.question_type_id),
      instruction:
        'Petunjuk: Baca pertanyaan dengan teliti, lalu pilih opsi jawaban yang paling tepat.',
      questionText: q.question_text,
      options,
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
  const { data: practicePackage } = practice.query.detail(packageId, {
    enabled: isPackageUUID,
  });

  // Mutations
  const startPracticeMutation = practice.mutate.start();
  const submitAnswerMutation = practice.mutate.submitAnswer();
  const submitPracticeMutation = practice.mutate.submitPractice();
  const autoSubmitPracticeMutation = practice.mutate.autoSubmit();

  // 2. Competency detail query (fallback if direct package detail is empty)
  const { data: competencyData } = question.query.competencyDetail(packageId, {
    enabled: isPackageUUID && !practicePackage,
  });

  // 3. Fallback questions query by competency if package has no pre-bound questions
  const { data: questionsPage } = question.query.list(
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

  // 4. Questions dataset: prioritize package questions, then competency questions, fallback to defaults
  const questions: PracticeQuestionItem[] = useMemo(() => {
    if (practicePackage?.questions && practicePackage.questions.length > 0) {
      return transformApiQuestions(practicePackage.questions, competencyName);
    }
    return transformApiQuestions(questionsPage?.questions, competencyName);
  }, [practicePackage?.questions, questionsPage?.questions, competencyName]);

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

  // Pre-Start Rules Modal State
  const [isPreStartModalOpen, setIsPreStartModalOpen] = useState(true);
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

  // Answer selection handlers + backend synchronization
  const handleSelectSingleChoice = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));

      // Async sync answer to backend: POST /api/v1/practice-attempts/:attemptId/answer
      const currentAttempt = attemptId || attemptIdRef.current;
      if (currentAttempt && isUUID(currentAttempt)) {
        submitAnswerMutation
          .mutateAsync({
            attemptId: currentAttempt,
            body: {
              question_id: currentQuestion.id,
              selected_option_id: optionId,
            },
          })
          .catch(() => {});
      }
    },
    [currentQuestion, attemptId, submitAnswerMutation]
  );

  const handleToggleComplexChoice = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => {
        const currentList = (prev[currentQuestion.id] as string[]) || [];
        const nextList = currentList.includes(optionId)
          ? currentList.filter((id) => id !== optionId)
          : [...currentList, optionId];

        const currentAttempt = attemptId || attemptIdRef.current;
        if (currentAttempt && isUUID(currentAttempt)) {
          submitAnswerMutation
            .mutateAsync({
              attemptId: currentAttempt,
              body: {
                question_id: currentQuestion.id,
                answer_data: JSON.stringify(nextList),
              },
            })
            .catch(() => {});
        }

        return {
          ...prev,
          [currentQuestion.id]: nextList,
        };
      });
    },
    [currentQuestion, attemptId, submitAnswerMutation]
  );

  const handleSelectMatrixChoice = useCallback(
    (statementId: string, value: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => {
        const currentMatrix = (prev[currentQuestion.id] as Record<string, string>) || {};
        const nextMatrix = {
          ...currentMatrix,
          [statementId]: value,
        };

        const currentAttempt = attemptId || attemptIdRef.current;
        if (currentAttempt && isUUID(currentAttempt)) {
          submitAnswerMutation
            .mutateAsync({
              attemptId: currentAttempt,
              body: {
                question_id: currentQuestion.id,
                answer_data: JSON.stringify(nextMatrix),
              },
            })
            .catch(() => {});
        }

        return {
          ...prev,
          [currentQuestion.id]: nextMatrix,
        };
      });
    },
    [currentQuestion, attemptId, submitAnswerMutation]
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

  // Direct Submission execution
  const executeSubmission = useCallback(
    async (isAutoSubmit = false) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      proctoring.stopProctoring();
      setIsConfirmModalOpen(false);
      setIsWarningModalOpen(false);

      const targetAttemptId = attemptId || attemptIdRef.current;

      if (targetAttemptId && isUUID(targetAttemptId)) {
        try {
          if (isAutoSubmit) {
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
            await submitPracticeMutation.mutateAsync(targetAttemptId);
          }
        } catch {
          // ignore error to ensure student is redirected to result page
        }
      }

      const queryParam = targetAttemptId ? `?attemptId=${targetAttemptId}` : '';
      router.push(`/student/practice/${packageId}/result${queryParam}`);
    },
    [proctoring, router, packageId, attemptId, submitPracticeMutation, autoSubmitPracticeMutation]
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
      let status: QuestionPaletteStatus = 'unanswered';

      if (idx === safeIndex) {
        status = 'active';
      } else if (flaggedQuestions.has(qNum)) {
        status = 'flagged';
      } else {
        const ans = answers[q.id];
        if (q.type === 'pilihan-ganda') {
          if (typeof ans === 'string' && ans !== '') {
            status = 'answered';
          }
        } else if (q.type === 'pilihan-ganda-kompleks') {
          if (Array.isArray(ans) && ans.length > 0) {
            status = 'answered';
          }
        } else if (
          q.type === 'benar-salah' ||
          q.type === 'tepat-tidak-tepat' ||
          q.type === 'setuju-tidak-setuju'
        ) {
          if (typeof ans === 'object' && ans !== null && Object.keys(ans).length > 0) {
            status = 'answered';
          }
        }
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

  return (
    <StudentPracticeDetailPage
      competencyName={competencyName}
      categoryLabel={categoryLabel}
      title={title}
      subCategory="TKA Bahasa Indonesia"
      isFlagged={isCurrentFlagged}
      onToggleFlag={handleToggleFlag}
      onExit={handleExitClick}
      currentQuestion={currentQuestion}
      currentAnswer={currentAnswer}
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
