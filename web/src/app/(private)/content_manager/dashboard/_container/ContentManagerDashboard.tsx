'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { ContentManagerDashboardPage } from '@/components/page/private/content_manager/ContentManagerDashboardPage';
import { useApi } from '@/hooks/useApi';
import type {
  ContentManagerKpiStats,
  CuratorActivityItem,
  DistribusiBankSoalData,
  ManagedTryoutItem,
  PipelineMateriData,
  TryoutWorkflowAutomation,
} from '@/types/ui/content-manager-dashboard.types';
import { countByStatus, publishedPct } from '@/utils/list-summary.util';

export function ContentManagerDashboard() {
  const router = useRouter();
  const api = useApi();

  // Queries — jangan pakai api.admin (endpoint /admin/* khusus role admin, CM ditolak 403).
  const { data: materialsData, isLoading: isMaterialsLoading } = api.learning.query.materials({
    limit: 100,
  });
  const { data: questionsData, isLoading: isQuestionsLoading } = api.question.query.list({
    limit: 100,
  });
  const { data: tryoutsData, isLoading: isTryoutsLoading } = api.tryout.query.list({
    limit: 100,
  });
  const { data: newsData, isLoading: isNewsLoading } = api.content.query.cmsNews();
  const { data: docData, isLoading: isDocLoading } = api.content.query.cmsDocumentation();
  const { data: testimonialsData, isLoading: isTestimonialsLoading } =
    api.content.query.cmsTestimonials();

  const isLoading =
    isMaterialsLoading ||
    isQuestionsLoading ||
    isTryoutsLoading ||
    isNewsLoading ||
    isDocLoading ||
    isTestimonialsLoading;

  // 1. KPI Stats
  const kpiStats = useMemo<ContentManagerKpiStats | undefined>(() => {
    if (
      !materialsData &&
      !questionsData &&
      !tryoutsData &&
      !newsData &&
      !docData &&
      !testimonialsData
    ) {
      return undefined;
    }
    const totalMateri = materialsData?.total ?? 0;
    const paketBankSoal = questionsData?.total ?? 0;
    const totalPaketTryout = tryoutsData?.total ?? 0;

    const kontenPublik =
      (newsData?.total ?? 0) + (docData?.total ?? 0) + (testimonialsData?.total ?? 0);

    return {
      totalMateri,
      materiSubtitle: 'Materi dari sekolah terdaftar',
      paketBankSoal,
      bankSoalSubtitle: 'Soal yang tersedia aktif',
      totalPaketTryout,
      tryoutSubtitle: 'Tryout yang siap dikerjakan',
      kontenPublik,
      kontenPublikSubtitle: 'News, docs, review & video',
    };
  }, [materialsData, questionsData, tryoutsData, newsData, docData, testimonialsData]);

  // 2. Tryout Workflow Automation
  const tryoutWorkflow = useMemo<TryoutWorkflowAutomation | undefined>(() => {
    if (tryoutsData?.tryouts && tryoutsData.tryouts.length > 0) {
      const first = tryoutsData.tryouts[0];
      const durasiMenit = first.duration_seconds ? Math.round(first.duration_seconds / 60) : 0;

      return {
        modulUjian: first.title ?? '—',
        kumpulanSoalTotal: first.total_questions || 0,
        alokasiSiswa: 30,
        durasiMenit,
        statusDistribusi:
          first.status?.toLowerCase() === 'published'
            ? 'Published'
            : first.status?.toLowerCase() === 'archived'
              ? 'Archived'
              : 'Draft',
      };
    }
    return undefined;
  }, [tryoutsData]);

  // 3. Pipeline Materi Data
  const materiPipeline = useMemo<PipelineMateriData | undefined>(() => {
    if (materialsData?.materials && materialsData.materials.length > 0) {
      // archived API -> unpublished di helper
      const counts = countByStatus(materialsData.materials, (item) => item.status);
      return {
        total: counts.total,
        siapDigunakanPercentage: publishedPct(counts.published, counts.total),
        draftCount: counts.draft,
        publishedCount: counts.published,
        archivedCount: counts.unpublished,
      };
    }
    return undefined;
  }, [materialsData]);

  // 4. Distribusi Bank Soal Data
  const bankSoalDistribusi = useMemo<DistribusiBankSoalData | undefined>(() => {
    if (questionsData?.questions && questionsData.questions.length > 0) {
      const counts = countByStatus(questionsData.questions, (item) => item.status, ['active']);
      return {
        total: counts.total,
        aktifPercentage: publishedPct(counts.published, counts.total),
        draftCount: counts.draft,
        publishedCount: counts.published,
        unpublishedCount: counts.unpublished,
      };
    }
    return undefined;
  }, [questionsData]);

  // 5. Managed Tryouts
  const managedTryouts = useMemo<ManagedTryoutItem[] | undefined>(() => {
    if (tryoutsData?.tryouts && tryoutsData.tryouts.length > 0) {
      return tryoutsData.tryouts.slice(0, 3).map((item, idx) => {
        const isPublished = item.status?.toUpperCase() === 'PUBLISHED';
        const formattedDate = item.updated_at
          ? new Date(item.updated_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '—';

        const durasiMenit = item.duration_seconds ? Math.round(item.duration_seconds / 60) : 0;

        return {
          id: item.id || String(idx + 1),
          title: item.title || `Tryout TKA Paket ${idx + 1}`,
          status: isPublished ? 'PUBLISHED' : 'DRAFT',
          totalSoalTersedia: item.total_questions || 0,
          soalPerSiswa: 30,
          durasiMenit,
          diperbaruiTanggal: formattedDate,
        };
      });
    }
    return undefined;
  }, [tryoutsData]);

  // 6. Curator Activities — tidak ada sumber CM (recent_activities hanya di /admin/dashboard khusus admin).
  const curatorActivities = useMemo<CuratorActivityItem[] | undefined>(() => undefined, []);

  // Handlers
  const handleAddMaterial = () => router.push('/content_manager/materials/create');
  const handleAddQuestion = () => router.push('/content_manager/questions');
  const handleCreateTryout = () => router.push('/content_manager/tryouts');
  const handleAddNews = () => router.push('/content_manager/news');
  const handleManageQuestionsWorkflow = () => router.push('/content_manager/questions');
  const handleManageTryout = (_id: string) => router.push('/content_manager/tryouts');
  const handleViewAllTryouts = () => router.push('/content_manager/tryouts');
  const handleOpenAuditTrail = () => router.push('/content_manager/documentation');

  return (
    <ContentManagerDashboardPage
      isLoading={isLoading}
      kpiStats={kpiStats}
      tryoutWorkflow={tryoutWorkflow}
      materiPipeline={materiPipeline}
      bankSoalDistribusi={bankSoalDistribusi}
      managedTryouts={managedTryouts}
      curatorActivities={curatorActivities}
      onAddMaterial={handleAddMaterial}
      onAddQuestion={handleAddQuestion}
      onCreateTryout={handleCreateTryout}
      onAddNews={handleAddNews}
      onManageQuestionsWorkflow={handleManageQuestionsWorkflow}
      onManageTryout={handleManageTryout}
      onViewAllTryouts={handleViewAllTryouts}
      onOpenAuditTrail={handleOpenAuditTrail}
    />
  );
}

export default ContentManagerDashboard;
