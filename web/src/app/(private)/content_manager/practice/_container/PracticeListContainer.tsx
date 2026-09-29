'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import { PracticeListPage } from '@/components/page/private/content_manager/PracticeListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { SchoolLevel } from '@/types/service';
import type {
  PracticeDialogForm,
  PracticeFilterState,
  PracticePackageItem,
  PracticeStats,
  PracticeStatusType,
} from '@/types/ui/practice-manager.types';

const EMPTY_PRACTICE_FORM: PracticeDialogForm = {
  title: '',
  description: '',
  competency_id: '',
  jenjang: 'sma',
  status: 'DRAFT',
};

export const PracticeListContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi();
  const ns = useAppNameSpace();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  // Local state
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogForm, setDialogForm] = useState<PracticeDialogForm>(EMPTY_PRACTICE_FORM);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [filters, setFilters] = useState<PracticeFilterState>({
    search: '',
    status: 'Semua Status',
    competencyId: 'Semua Kompetensi',
    jenjang: 'Semua Jenjang',
    quota: 'Semua Kuota Soal',
    page: 1,
    perPage: 10,
  });

  // Map UI status filter to API status filter
  const apiStatus = useMemo(() => {
    switch (filters.status) {
      case 'Published':
        return 'published';
      case 'Draft':
        return 'draft';
      case 'Unpublished':
        return 'archived';
      default:
        return undefined;
    }
  }, [filters.status]);

  const apiCompetencyId = useMemo(() => {
    return filters.competencyId !== 'Semua Kompetensi' ? filters.competencyId : undefined;
  }, [filters.competencyId]);

  const apiJenjang = useMemo(() => {
    return filters.jenjang !== 'Semua Jenjang'
      ? (filters.jenjang.toLowerCase() as SchoolLevel)
      : undefined;
  }, [filters.jenjang]);

  // Primary Query: List of Practice Packages
  const packagesQuery = api.practice.query.packages({
    search: filters.search.trim() || undefined,
    status: apiStatus,
    competency_id: apiCompetencyId,
    jenjang: apiJenjang,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  // Query for global stats calculation
  const allPackagesQuery = api.practice.query.packages({ limit: 100 });

  // Query for Competencies list
  const competenciesQuery = api.question.query.competencies({ limit: 100 });

  const competencies = useMemo(() => {
    const list = competenciesQuery.data?.competencies ?? [];
    return list.map((c) => ({
      id: c.id,
      name: c.name,
    }));
  }, [competenciesQuery.data]);

  // Mutations
  const createPackageMutation = api.practice.mutate.createPackage();
  const updatePackageMutation = api.practice.mutate.updatePackage();
  const updateStatusMutation = api.practice.mutate.updatePackageStatus();
  const deletePackageMutation = api.practice.mutate.deletePackage();

  // Map packages into UI item format
  const packages = useMemo<PracticePackageItem[]>(() => {
    const rawList = packagesQuery.data?.packages ?? [];

    let filtered = rawList;
    if (filters.quota === '< 20 Soal') {
      filtered = rawList.filter((p) => (p.total_questions || 0) < 20);
    } else if (filters.quota === '20 - 30 Soal') {
      filtered = rawList.filter(
        (p) => (p.total_questions || 0) >= 20 && (p.total_questions || 0) <= 30
      );
    } else if (filters.quota === '> 30 Soal') {
      filtered = rawList.filter((p) => (p.total_questions || 0) > 30);
    }

    return filtered.map((pkg, idx) => {
      const rawStatus = (pkg.status || 'draft').toUpperCase();
      const status: PracticeStatusType =
        rawStatus === 'PUBLISHED'
          ? 'PUBLISHED'
          : rawStatus === 'UNPUBLISHED' || rawStatus === 'ARCHIVED'
            ? 'UNPUBLISHED'
            : 'DRAFT';

      const updatedAt = pkg.updated_at
        ? new Date(pkg.updated_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Baru saja';

      return {
        id: pkg.id,
        number: String((filters.page - 1) * filters.perPage + idx + 1).padStart(2, '0'),
        title: pkg.title,
        description: pkg.description || undefined,
        competencyId: pkg.competency_id,
        competencyName: pkg.competency_name || 'Pemahaman Inferensial & Gagasan',
        jenjang: pkg.jenjang || 'sma',
        totalQuestions: pkg.total_questions || 0,
        status,
        updatedAt,
      };
    });
  }, [packagesQuery.data, filters.page, filters.perPage, filters.quota]);

  // Statistics calculation
  const stats = useMemo<PracticeStats>(() => {
    const list = allPackagesQuery.data?.packages ?? [];
    let draft = 0;
    let published = 0;
    let unpublished = 0;

    for (const item of list) {
      const st = (item.status || '').toLowerCase();
      if (st === 'published') published++;
      else if (st === 'unpublished' || st === 'archived') unpublished++;
      else draft++;
    }

    return {
      totalPackages: allPackagesQuery.data?.total ?? list.length,
      draftCount: draft,
      publishedCount: published,
      unpublishedCount: unpublished,
    };
  }, [allPackagesQuery.data]);

  const totalItems = packagesQuery.data?.total ?? packages.length;

  // Handlers
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleJenjangChange = (jenjang: string) => {
    setFilters((prev) => ({ ...prev, jenjang, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleCompetencyChange = (competencyId: string) => {
    setFilters((prev) => ({ ...prev, competencyId, page: 1 }));
  };

  const handleQuotaChange = (quota: string) => {
    setFilters((prev) => ({ ...prev, quota, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setFilters((prev) => ({ ...prev, perPage, page: 1 }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        packagesQuery.refetch(),
        allPackagesQuery.refetch(),
        competenciesQuery.refetch(),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleOpenDialogChange = (open: boolean) => {
    if (open) {
      setDialogMode('create');
      setDialogForm(EMPTY_PRACTICE_FORM);
      setDialogError(null);
    }
    setIsDialogOpen(open);
  };

  const handleDialogFormChange = <K extends keyof PracticeDialogForm>(
    field: K,
    value: PracticeDialogForm[K]
  ) => {
    setDialogForm((prev) => ({ ...prev, [field]: value }));
    setDialogError(null);
  };

  const handleEdit = (item: PracticePackageItem) => {
    setDialogMode('edit');
    setDialogForm({
      id: item.id,
      title: item.title,
      description: item.description || '',
      competency_id: item.competencyId || '',
      jenjang: (item.jenjang as SchoolLevel) || 'sma',
      status: item.status,
    });
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (item: PracticePackageItem) => {
    const nextStatus = item.status === 'PUBLISHED' ? 'archived' : 'published';
    const nextLabel = item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish';

    ns.alert.confirm({
      title: `${nextLabel} Paket Latihan`,
      deskripsi: `Apakah Anda yakin ingin mengubah status paket "${item.title}" menjadi ${nextStatus}?`,
      icon: 'question',
      onConfirm: () =>
        updateStatusMutation.mutate({
          id: item.id,
          status: nextStatus,
        }),
    });
  };

  const handleDelete = (item: PracticePackageItem) => {
    ns.alert.confirm({
      title: 'Hapus Paket Latihan',
      deskripsi: `Apakah Anda yakin ingin menghapus paket latihan "${item.title}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'error',
      onConfirm: () => deletePackageMutation.mutate(item.id),
    });
  };

  const handleSubmitDialog = async () => {
    if (!dialogForm.title.trim()) {
      setDialogError('Judul paket latihan wajib diisi.');
      return;
    }

    try {
      if (dialogMode === 'create') {
        const res = await createPackageMutation.mutateAsync({
          title: dialogForm.title.trim(),
          description: dialogForm.description.trim() || undefined,
          competency_id: dialogForm.competency_id || null,
          jenjang: dialogForm.jenjang,
        });
        setIsDialogOpen(false);
        if (res?.data?.id) {
          router.push(`${basePath}/practice/${res.data.id}`);
        }
        return;
      } else {
        if (!dialogForm.id) return;
        await updatePackageMutation.mutateAsync({
          id: dialogForm.id,
          body: {
            title: dialogForm.title.trim(),
            description: dialogForm.description.trim() || undefined,
            competency_id: dialogForm.competency_id || null,
            jenjang: dialogForm.jenjang,
          },
        });
        await updateStatusMutation.mutateAsync({
          id: dialogForm.id,
          status:
            dialogForm.status === 'UNPUBLISHED' ? 'archived' : dialogForm.status.toLowerCase(),
        });
        setIsDialogOpen(false);
      }
    } catch {
      // Handled by mutation toast
    }
  };

  const handleExportSummary = () => {
    const summaryText = `RINGKASAN PAKET LATIHAN SIMANTIK\n\nTotal Paket: ${stats.totalPackages}\nPublished: ${stats.publishedCount}\nDraft: ${stats.draftCount}\nUnpublished: ${stats.unpublishedCount}\nTanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n\nDaftar Paket Latihan:\n${packages.map((p, i) => `${i + 1}. ${p.title} (${p.competencyName}, ${p.totalQuestions} Soal) - Status: ${p.status}`).join('\n')}`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ringkasan-Paket-Latihan-SIMANTIK.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PracticeListPage
      stats={stats}
      packages={packages}
      competencies={competencies}
      filters={filters}
      totalItems={totalItems}
      isRefreshing={isRefreshing}
      isPending={packagesQuery.isPending}
      onSearchChange={handleSearchChange}
      onJenjangChange={handleJenjangChange}
      onStatusChange={handleStatusChange}
      onCompetencyChange={handleCompetencyChange}
      onQuotaChange={handleQuotaChange}
      onRefresh={handleRefresh}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      isDialogOpen={isDialogOpen}
      onOpenDialogChange={handleOpenDialogChange}
      dialogMode={dialogMode}
      dialogForm={dialogForm}
      dialogError={dialogError}
      isSubmitting={createPackageMutation.isPending || updatePackageMutation.isPending}
      onDialogFormChange={handleDialogFormChange}
      onSubmitDialog={handleSubmitDialog}
      onEdit={handleEdit}
      onToggleStatus={handleToggleStatus}
      onDelete={handleDelete}
      onExportSummary={handleExportSummary}
      onCreatePractice={() => handleOpenDialogChange(true)}
      onManageQuestions={(item) => router.push(`${basePath}/practice/${item.id}`)}
      onViewResults={(item) => router.push(`${basePath}/practice/${item.id}`)}
    />
  );
};

export default PracticeListContainer;
