'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import type {
  EvaluationNextStepItem,
  EvaluationPillarItem,
  EvaluationTrendPoint,
} from '@/components/molecules/student';
import { StudentEvaluationPage } from '@/components/page/private/student/StudentEvaluationPage';
import { useApi } from '@/hooks/useApi';
import type { StudentReportCardResponse } from '@/types/service';

const TREND_STATUS_LABEL: Record<string, string> = {
  improving: 'Positif Berkelanjutan',
  stable: 'Stabil',
  declining: 'Perlu Perhatian',
  insufficient_data: 'Data Belum Cukup',
};

function levelBadge(level: string): { text: string; variant: 'emerald' | 'amber' } {
  if (level === 'high') return { text: 'Taraf Baik', variant: 'emerald' };
  if (level === 'medium') return { text: 'Taraf Cukup', variant: 'amber' };
  return { text: 'Taraf Kurang', variant: 'amber' };
}

function accuracyColor(level: string): 'emerald' | 'amber' | 'teal' {
  if (level === 'high') return 'emerald';
  if (level === 'medium') return 'amber';
  return 'teal';
}

function buildPillars(
  reportCard: StudentReportCardResponse | null | undefined,
  descriptions: Map<string, string>,
  onLearn: () => void
): EvaluationPillarItem[] {
  const breakdown = reportCard?.competency_breakdown ?? [];
  const focusIds = new Set(
    (reportCard?.areas_for_improvement ?? []).map((item) => item.competency_id)
  );

  return breakdown.map((item, index) => {
    const isFocus = focusIds.has(item.competency_id);
    const badge = levelBadge(item.performance_level);

    return {
      id: item.competency_id,
      pillarNumber: `PILAR ${String(index + 1).padStart(2, '0')}`,
      title: item.name,
      description: descriptions.get(item.competency_id) ?? item.name,
      score: Math.round(item.score),
      maxScore: 100,
      accuracyOrStatusText: `Akurasi ${Math.round(item.accuracy)}%`,
      accuracyOrStatusColor: accuracyColor(item.performance_level),
      levelBadgeText: badge.text,
      levelBadgeVariant: badge.variant,
      isFocusPillar: isFocus,
      focusBadgeText: 'FOKUS PENGUATAN',
      footerLeftText: `Benar ${item.correct_answers}/${item.total_questions}`,
      footerRightText: isFocus ? 'Pelajari Topik' : 'Melampaui Target',
      onFooterAction: isFocus ? onLearn : undefined,
    };
  });
}

function buildNextSteps(
  reportCard: StudentReportCardResponse | null | undefined,
  onPractice: () => void,
  onLearn: () => void
): EvaluationNextStepItem[] {
  return (reportCard?.recommendations ?? []).slice(0, 3).map((rec, index) => ({
    id: rec.id,
    stepNumber: String(index + 1).padStart(2, '0'),
    title: `Perkuat ${rec.competency_name}`,
    description: rec.recommendation_text,
    actionText: index === 0 ? 'Mulai Latihan' : 'Lihat Kompetensi',
    actionVariant: index === 0 ? 'solid' : 'outline',
    onAction: index === 0 ? onPractice : onLearn,
  }));
}

export default function StudentEvaluation() {
  const router = useRouter();
  const { evaluation, question, reporting } = useApi();

  const { data: reportCard } = reporting.query.studentReportCard();
  const { data: evaluationsPage } = evaluation.query.list({ limit: 1 });
  const { data: competenciesPage } = question.query.competencies({ limit: 100 });

  const lastEvaluation = evaluationsPage?.evaluations?.[0];
  const performanceTrend = reportCard?.performance_trend;

  const competencyDescriptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const competency of competenciesPage?.competencies ?? []) {
      map.set(competency.id, competency.description);
    }
    return map;
  }, [competenciesPage]);

  const handleOpenLearning = () => router.push('/student/learning');
  const handleOpenPractice = () => router.push('/student/practice');

  // 1. Overall Score metrics
  const overallScore = reportCard?.summary.average_score ?? 82;
  const overallStatusLabel = useMemo(() => {
    if (overallScore >= 85) return 'Sangat Baik';
    if (overallScore >= 75) return 'Baik';
    if (overallScore >= 60) return 'Cukup';
    return 'Perlu Penguatan';
  }, [overallScore]);

  // 2. Latest Score metrics
  const latestScore =
    lastEvaluation?.score ??
    (performanceTrend && performanceTrend.length > 0
      ? performanceTrend[performanceTrend.length - 1].score
      : 82);

  const accuracyRatioText = lastEvaluation
    ? `Rasio Akurasi: ${lastEvaluation.correct_answers} / ${lastEvaluation.total_questions} Benar`
    : 'Rasio Akurasi: 25 / 30 Benar';

  const accuracyPercentageText = lastEvaluation
    ? `${lastEvaluation.accuracy.toFixed(1)}%`
    : reportCard?.summary.overall_accuracy
      ? `${reportCard.summary.overall_accuracy.toFixed(1)}%`
      : '83.3%';

  const lastTrend =
    performanceTrend && performanceTrend.length > 0
      ? performanceTrend[performanceTrend.length - 1]
      : undefined;

  const evaluationSessionName = lastTrend?.tryout_title
    ? `Evaluasi: ${lastTrend.tryout_title}`
    : reportCard?.summary.total_attempts
      ? `Evaluasi ke-${reportCard.summary.total_attempts}`
      : undefined;

  const deltaPoints =
    performanceTrend && performanceTrend.length >= 2
      ? Math.round(
          performanceTrend[performanceTrend.length - 1].score -
            performanceTrend[performanceTrend.length - 2].score
        )
      : undefined;

  const latestDescription = lastEvaluation
    ? `Diperoleh dari evaluasi terakhir dengan ${lastEvaluation.correct_answers} jawaban benar dari ${lastEvaluation.total_questions} soal.`
    : undefined;

  // 3. Trend Chart Data
  const trendChartData: EvaluationTrendPoint[] = useMemo(() => {
    if (performanceTrend && performanceTrend.length >= 2) {
      return performanceTrend.slice(-6).map((item, idx) => ({
        session: `Eval ${idx + 1}`,
        score: Math.round(item.score),
      }));
    }
    return [
      { session: 'Eval 1', score: 68 },
      { session: 'Eval 2', score: 74 },
      { session: 'Eval 3', score: 78 },
      { session: 'Eval 4', score: 82 },
    ];
  }, [performanceTrend]);

  const cumulativeGrowthText = useMemo(() => {
    if (trendChartData.length >= 2) {
      const diff = trendChartData[trendChartData.length - 1].score - trendChartData[0].score;
      const sign = diff >= 0 ? '+' : '';
      return `${sign}${diff} Poin Kumulatif`;
    }
    return '+14 Poin Kumulatif';
  }, [trendChartData]);

  const periodText =
    trendChartData.length > 0 ? `Evaluasi 1 s.d. ${trendChartData.length}` : undefined;

  const trendStatusLabel = reportCard?.trend_status
    ? (TREND_STATUS_LABEL[reportCard.trend_status] ?? undefined)
    : undefined;

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 4. Competency Pillars
  const pillars: EvaluationPillarItem[] = useMemo(
    () => buildPillars(reportCard, competencyDescriptions, () => setIsDetailModalOpen(true)),
    [reportCard, competencyDescriptions]
  );

  // 5. Next steps actions
  const nextSteps: EvaluationNextStepItem[] = useMemo(
    () => buildNextSteps(reportCard, handleOpenPractice, handleOpenLearning),
    [reportCard]
  );

  return (
    <>
      <StudentEvaluationPage
        heroProps={{ onPrint: () => window.print() }}
        overallProps={{
          score: Math.round(overallScore),
          statusLabel: overallStatusLabel,
        }}
        latestProps={{
          score: Math.round(latestScore),
          accuracyRatioText,
          accuracyPercentageText,
          evaluationSessionName,
          deltaPoints,
          description: latestDescription,
        }}
        trendProps={{
          data: trendChartData,
          cumulativeGrowthText,
          periodText,
          trendStatusLabel,
        }}
        pillars={pillars}
        onViewDetailCompetencies={() => setIsDetailModalOpen(true)}
        steps={nextSteps}
      />
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Performa per Kompetensi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 relative">
            {reportCard?.competency_breakdown?.map((item) => (
              <div
                key={item.competency_id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${item.performance_level === 'high' ? 'bg-teal-100 text-teal-800' : item.performance_level === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {item.performance_level === 'high'
                      ? 'KUAT'
                      : item.performance_level === 'medium'
                        ? 'CUKUP'
                        : 'LEMAH'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mt-1">
                  <div className="bg-white p-2 rounded shadow-sm border border-slate-100 text-center">
                    <div className="text-slate-500 text-xs">Total Soal</div>
                    <div className="font-bold">{item.total_questions}</div>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm border border-slate-100 text-center">
                    <div className="text-slate-500 text-xs">Benar</div>
                    <div className="font-bold text-teal-600">{item.correct_answers}</div>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm border border-slate-100 text-center">
                    <div className="text-slate-500 text-xs">Akurasi</div>
                    <div className="font-bold">{Math.round(item.accuracy)}%</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleOpenLearning}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition"
              >
                Mulai Penguatan Materi
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
