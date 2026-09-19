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

const FALLBACK_KPI_STATS: ContentManagerKpiStats = {
  totalMateri: 36,
  materiSubtitle: 'Materi dari sekolah terdaftar',
  paketBankSoal: 30,
  bankSoalSubtitle: 'Soal yang tersedia aktif',
  totalPaketTryout: 12,
  tryoutSubtitle: 'Tryout yang siap dikerjakan',
  kontenPublik: 24,
  kontenPublikSubtitle: 'News, docs, review & video',
};

const FALLBACK_WORKFLOW: TryoutWorkflowAutomation = {
  modulUjian: 'Tryout TKA Bahasa Indonesia',
  kumpulanSoalTotal: 150,
  alokasiSiswa: 30,
  durasiMenit: 75,
  statusDistribusi: 'Published',
};

const FALLBACK_MATERI_PIPELINE: PipelineMateriData = {
  total: 36,
  siapDigunakanPercentage: 85.7,
  draftCount: 6,
  publishedCount: 24,
  archivedCount: 2,
};

const FALLBACK_BANK_SOAL_DISTRIBUSI: DistribusiBankSoalData = {
  total: 30,
  aktifPercentage: 83.3,
  draftCount: 7,
  publishedCount: 20,
  unpublishedCount: 3,
};

const FALLBACK_MANAGED_TRYOUTS: ManagedTryoutItem[] = [
  {
    id: '1',
    title: 'Tryout TKA Bahasa Indonesia Paket 1',
    status: 'PUBLISHED',
    totalSoalTersedia: 150,
    soalPerSiswa: 30,
    durasiMenit: 75,
    diperbaruiTanggal: '18 Mei 2026',
  },
  {
    id: '2',
    title: 'Tryout TKA Bahasa Indonesia Paket 2',
    status: 'PUBLISHED',
    totalSoalTersedia: 150,
    soalPerSiswa: 30,
    durasiMenit: 75,
    diperbaruiTanggal: '17 Mei 2026',
  },
  {
    id: '3',
    title: 'Tryout TKA Bahasa Indonesia Paket 3',
    status: 'DRAFT',
    totalSoalTersedia: 150,
    soalPerSiswa: 30,
    durasiMenit: 75,
    diperbaruiTanggal: '15 Mei 2026',
  },
];

const FALLBACK_CURATOR_ACTIVITIES: CuratorActivityItem[] = [
  {
    id: '1',
    title: 'Materi baru ditambahkan (Teks Eksplanasi)',
    timeAgo: '10 menit yang lalu',
    dotColor: 'yellow',
  },
  {
    id: '2',
    title: '15 Soal baru ditambahkan ke Bank Soal oleh SMAN 1',
    timeAgo: '30 menit yang lalu',
    dotColor: 'blue',
  },
  {
    id: '3',
    title: 'Kumpulan soal Tryout Paket 1 diperbarui (Pool 150 butir)',
    timeAgo: '1 jam yang lalu',
    dotColor: 'teal',
  },
  {
    id: '4',
    title: 'Tryout TKA Paket 1 dipublikasikan',
    timeAgo: '2 jam yang lalu',
    dotColor: 'teal',
  },
  {
    id: '5',
    title: "News 'Panduan TKA 2026' dipublikasikan",
    timeAgo: '3 jam yang lalu',
    dotColor: 'navy',
  },
];

export function ContentManagerDashboard() {
  const router = useRouter();
  const api = useApi();

  // Queries
  const { data: adminDashboardData } = api.admin.query.dashboard();
  const { data: materialsData } = api.learning.query.materials({ limit: 100 });
  const { data: questionsData } = api.question.query.list({ limit: 100 });
  const { data: tryoutsData } = api.tryout.query.list({ limit: 100 });
  const { data: newsData } = api.content.query.cmsNews();
  const { data: docData } = api.content.query.cmsDocumentation();
  const { data: testimonialsData } = api.content.query.cmsTestimonials();

  // 1. KPI Stats
  const kpiStats = useMemo<ContentManagerKpiStats>(() => {
    const totalMateri =
      materialsData?.total ?? adminDashboardData?.total_materials ?? FALLBACK_KPI_STATS.totalMateri;
    const paketBankSoal =
      questionsData?.total ??
      adminDashboardData?.total_questions ??
      FALLBACK_KPI_STATS.paketBankSoal;
    const totalPaketTryout =
      tryoutsData?.total ??
      adminDashboardData?.total_tryouts ??
      FALLBACK_KPI_STATS.totalPaketTryout;

    const cmsContentTotal =
      (newsData?.total ?? 0) + (docData?.total ?? 0) + (testimonialsData?.total ?? 0);
    const kontenPublik = cmsContentTotal > 0 ? cmsContentTotal : FALLBACK_KPI_STATS.kontenPublik;

    return {
      totalMateri,
      materiSubtitle: FALLBACK_KPI_STATS.materiSubtitle,
      paketBankSoal,
      bankSoalSubtitle: FALLBACK_KPI_STATS.bankSoalSubtitle,
      totalPaketTryout,
      tryoutSubtitle: FALLBACK_KPI_STATS.tryoutSubtitle,
      kontenPublik,
      kontenPublikSubtitle: FALLBACK_KPI_STATS.kontenPublikSubtitle,
    };
  }, [
    materialsData,
    adminDashboardData,
    questionsData,
    tryoutsData,
    newsData,
    docData,
    testimonialsData,
  ]);

  // 2. Tryout Workflow Automation
  const tryoutWorkflow = useMemo<TryoutWorkflowAutomation>(() => {
    if (tryoutsData?.tryouts && tryoutsData.tryouts.length > 0) {
      const first = tryoutsData.tryouts[0];
      const durasiMenit = first.duration_seconds
        ? Math.round(first.duration_seconds / 60)
        : FALLBACK_WORKFLOW.durasiMenit;

      return {
        modulUjian: first.title ?? FALLBACK_WORKFLOW.modulUjian,
        kumpulanSoalTotal: first.total_questions || FALLBACK_WORKFLOW.kumpulanSoalTotal,
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
    return FALLBACK_WORKFLOW;
  }, [tryoutsData]);

  // 3. Pipeline Materi Data
  const materiPipeline = useMemo<PipelineMateriData>(() => {
    if (materialsData?.materials && materialsData.materials.length > 0) {
      let draft = 0;
      let published = 0;
      let archived = 0;
      for (const item of materialsData.materials) {
        const s = item.status?.toLowerCase();
        if (s === 'published') published++;
        else if (s === 'archived') archived++;
        else draft++;
      }
      const total = draft + published + archived || materialsData.materials.length;
      const pct = total > 0 ? Number(((published / total) * 100).toFixed(1)) : 0;
      return {
        total,
        siapDigunakanPercentage: pct,
        draftCount: draft,
        publishedCount: published,
        archivedCount: archived,
      };
    }
    return FALLBACK_MATERI_PIPELINE;
  }, [materialsData]);

  // 4. Distribusi Bank Soal Data
  const bankSoalDistribusi = useMemo<DistribusiBankSoalData>(() => {
    if (questionsData?.questions && questionsData.questions.length > 0) {
      let draft = 0;
      let published = 0;
      let unpublished = 0;
      for (const item of questionsData.questions) {
        const s = item.status?.toLowerCase();
        if (s === 'published' || s === 'active') published++;
        else if (s === 'unpublished' || s === 'archived') unpublished++;
        else draft++;
      }
      const total = draft + published + unpublished || questionsData.questions.length;
      const pct = total > 0 ? Number(((published / total) * 100).toFixed(1)) : 0;
      return {
        total,
        aktifPercentage: pct,
        draftCount: draft,
        publishedCount: published,
        unpublishedCount: unpublished,
      };
    }
    return FALLBACK_BANK_SOAL_DISTRIBUSI;
  }, [questionsData]);

  // 5. Managed Tryouts
  const managedTryouts = useMemo<ManagedTryoutItem[]>(() => {
    if (tryoutsData?.tryouts && tryoutsData.tryouts.length > 0) {
      return tryoutsData.tryouts.slice(0, 3).map((item, idx) => {
        const isPublished = item.status?.toUpperCase() === 'PUBLISHED';
        const formattedDate = item.updated_at
          ? new Date(item.updated_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : `1${8 - idx} Mei 2026`;

        const durasiMenit = item.duration_seconds ? Math.round(item.duration_seconds / 60) : 75;

        return {
          id: item.id || String(idx + 1),
          title: item.title || `Tryout TKA Paket ${idx + 1}`,
          status: isPublished ? 'PUBLISHED' : 'DRAFT',
          totalSoalTersedia: item.total_questions || 150,
          soalPerSiswa: 30,
          durasiMenit,
          diperbaruiTanggal: formattedDate,
        };
      });
    }
    return FALLBACK_MANAGED_TRYOUTS;
  }, [tryoutsData]);

  // 6. Curator Activities
  const curatorActivities = useMemo<CuratorActivityItem[]>(() => {
    if (adminDashboardData?.recent_activities && adminDashboardData.recent_activities.length > 0) {
      const colors: Array<CuratorActivityItem['dotColor']> = ['yellow', 'blue', 'teal', 'navy'];
      return adminDashboardData.recent_activities.slice(0, 5).map((act, idx) => ({
        id: act.attempt_id || String(idx + 1),
        title: `${act.student_name} menyelesaikan ${act.tryout_title}`,
        timeAgo: act.submitted_at
          ? new Date(act.submitted_at).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : `${(idx + 1) * 15} menit yang lalu`,
        dotColor: colors[idx % colors.length],
      }));
    }
    return FALLBACK_CURATOR_ACTIVITIES;
  }, [adminDashboardData]);

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
