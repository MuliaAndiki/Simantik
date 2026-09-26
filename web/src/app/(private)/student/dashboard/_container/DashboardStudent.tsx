'use client';

import { useRouter } from 'next/navigation';
import type { NewsItem } from '@/components/organisms/student/LatestUpdatesGrid';
import type { DashboardMaterialItem } from '@/components/organisms/student/LearningMaterialsGrid';
import { DashboardStudentPage } from '@/components/page/private/student/DashboardStudentPage';
import { useApi } from '@/hooks/useApi';
import type { StudentReportCardResponse } from '@/types/service';

const TREND_STATUS_TEXT: Record<string, string> = {
  improving: 'Skor cenderung meningkat',
  stable: 'Skor cenderung stabil',
  declining: 'Skor cenderung menurun',
  insufficient_data: 'Data latihan belum cukup',
};

const NEWS_CATEGORY_VARIANTS: Array<NewsItem['categoryVariant']> = ['cyan', 'amber', 'indigo'];

function formatNewsDate(value: string | null): string {
  const date = new Date(value ?? '');
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function buildNewsExcerpt(content: string): string {
  const plain = content.replace(/\s+/g, ' ').trim();
  return plain.length > 120 ? `${plain.slice(0, 120)}...` : plain;
}

function deriveAchievement(averageScore: number | undefined) {
  if (averageScore === undefined) return undefined;
  if (averageScore >= 75) {
    return {
      status: 'Sangat Baik',
      subtext: 'Prestasi konsisten, pertahankan ritme belajarmu',
    };
  }
  if (averageScore >= 60) {
    return { status: 'Baik', subtext: 'Siap ke tingkatan berikutnya' };
  }
  return {
    status: 'Perlu Penguatan',
    subtext: 'Fokus latihan pada materi rekomendasi',
  };
}

function toDashboardMaterials(
  materials: Array<{ id: string; title: string; description: string }> | undefined
): DashboardMaterialItem[] | undefined {
  return materials?.map((material) => ({
    id: material.id,
    title: material.title,
    description: material.description,
  }));
}

function toNewsList(
  news:
    | Array<{
        id: string;
        slug: string;
        title: string;
        content: string;
        publishedAt: string | null;
        createdAt: string;
      }>
    | undefined
): NewsItem[] | undefined {
  return news?.map((item, index) => ({
    id: item.slug || item.id,
    category: 'Informasi',
    categoryVariant: NEWS_CATEGORY_VARIANTS[index % NEWS_CATEGORY_VARIANTS.length],
    date: formatNewsDate(item.publishedAt ?? item.createdAt),
    title: item.title,
    excerpt: buildNewsExcerpt(item.content),
  }));
}

function latestTrend(reportCard: StudentReportCardResponse | null | undefined) {
  const trend = reportCard?.performance_trend;
  return trend && trend.length > 0 ? trend[trend.length - 1] : undefined;
}

export default function DashboardStudentContainer() {
  const router = useRouter();
  const { content, evaluation, learning, recommendation, reporting, user } = useApi();

  const { data: userData } = user.query.me();
  const { data: reportCard } = reporting.query.studentReportCard();
  const { data: evaluationsPage } = evaluation.query.list({ limit: 1 });
  const { data: recommendationsPage } = recommendation.query.list({ limit: 1 });
  const { data: materialsPage } = learning.query.materials({ limit: 3 });
  const { data: newsPage } = content.query.news({ limit: 3 });

  const lastEvaluation = evaluationsPage?.evaluations?.[0];
  const lastTrend = latestTrend(reportCard);
  const topRecommendation =
    recommendationsPage?.recommendations?.[0] ?? reportCard?.recommendations?.[0];
  const achievement = deriveAchievement(reportCard?.summary.average_score);

  const averageCorrectPerSession =
    reportCard && lastEvaluation
      ? Math.round((reportCard.summary.overall_accuracy / 100) * lastEvaluation.total_questions)
      : undefined;

  const handleStartPractice = () => router.push('/student/practice');
  const handleStartTryout = () => router.push('/student/tryout');
  const handleViewEvaluation = () => router.push('/student/evaluation');
  const handleViewHistory = () => router.push('/student/evaluation');
  const handleLearnMaterial = (materialId: string) =>
    router.push(`/student/learning/${materialId}`);
  const handleViewAllMaterials = () => router.push('/student/learning');
  const handleReadNews = (id?: string) => {
    if (id) {
      router.push(`/student/news/${id}`);
    } else {
      router.push('/student/news');
    }
  };

  return (
    <DashboardStudentPage
      studentName={userData?.fullName?.split(' ')[0]}
      lastTopic={lastEvaluation?.competency_evaluations?.[0]?.competency_name}
      lastPackageName={lastTrend?.tryout_title}
      lastScore={lastEvaluation?.score ?? lastTrend?.score}
      averageComparisonText={
        reportCard
          ? (TREND_STATUS_TEXT[reportCard.trend_status] ?? TREND_STATUS_TEXT.insufficient_data)
          : undefined
      }
      totalSessions={reportCard?.summary.total_attempts}
      averageCorrectPerSession={averageCorrectPerSession}
      achievementStatus={achievement?.status}
      achievementSubtext={achievement?.subtext}
      materials={toDashboardMaterials(materialsPage?.materials)}
      recommendationTopicTitle={
        topRecommendation ? `Perkuat ${topRecommendation.competency_name}` : undefined
      }
      recommendationDescription={topRecommendation?.recommendation_text}
      newsList={toNewsList(newsPage?.news)}
      onStartPractice={handleStartPractice}
      onStartTryout={handleStartTryout}
      onViewEvaluation={handleViewEvaluation}
      onViewHistory={handleViewHistory}
      onLearnMaterial={handleLearnMaterial}
      onViewAllMaterials={handleViewAllMaterials}
      onReadNews={handleReadNews}
    />
  );
}
