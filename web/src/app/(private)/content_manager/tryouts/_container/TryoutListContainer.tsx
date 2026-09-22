'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { TryoutListPage } from '@/components/page/private/content_manager/TryoutListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { SchoolLevel } from '@/types/service';
import type {
  TryoutDialogForm,
  TryoutFilterState,
  TryoutPackageItem,
  TryoutStats,
  TryoutStatusType,
} from '@/types/ui/tryout-manager.types';

const EMPTY_TRYOUT_FORM: TryoutDialogForm = {
  title: '',
  description: '',
  jenjang: 'sma',
  duration_minutes: 75,
  status: 'DRAFT',
};

export const TryoutListContainer: React.FC = () => {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();

  // Local state
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogForm, setDialogForm] = useState<TryoutDialogForm>(EMPTY_TRYOUT_FORM);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [filters, setFilters] = useState<TryoutFilterState>({
    search: '',
    status: 'Semua Status',
    jenjang: 'Semua Jenjang',
    page: 1,
    perPage: 5,
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

  const apiJenjang = useMemo(() => {
    return filters.jenjang !== 'Semua Jenjang'
      ? (filters.jenjang.toLowerCase() as SchoolLevel)
      : undefined;
  }, [filters.jenjang]);

  // Primary Query: List of Tryouts
  const tryoutsQuery = api.tryout.query.list({
    search: filters.search.trim() || undefined,
    status: apiStatus,
    jenjang: apiJenjang,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  // Query for global statistics
  const allTryoutsQuery = api.tryout.query.list({ limit: 100 });

  // Mutations
  const createTryoutMutation = api.tryout.mutate.create();
  const updateTryoutMutation = api.tryout.mutate.update();
  const updateStatusMutation = api.tryout.mutate.updateStatus();
  const deleteTryoutMutation = api.tryout.mutate.delete();

  // Map tryouts into UI item format
  const tryouts = useMemo<TryoutPackageItem[]>(() => {
    const rawList = tryoutsQuery.data?.tryouts ?? [];

    return rawList.map((t, idx) => {
      const rawStatus = (t.status || 'draft').toUpperCase();
      const status: TryoutStatusType =
        rawStatus === 'PUBLISHED'
          ? 'PUBLISHED'
          : rawStatus === 'UNPUBLISHED' || rawStatus === 'ARCHIVED'
            ? 'UNPUBLISHED'
            : 'DRAFT';

      const durationMinutes = t.duration_seconds ? Math.round(t.duration_seconds / 60) : 75;

      const updatedAt = t.updated_at
        ? new Date(t.updated_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Baru saja';

      return {
        id: t.id,
        number: String((filters.page - 1) * filters.perPage + idx + 1).padStart(2, '0'),
        title: t.title,
        author: 'Tim Litbang Asesmen SIMANTIK',
        jenjang: t.jenjang || 'sma',
        durationMinutes,
        totalQuestions: t.total_questions || 0,
        status,
        updatedAt,
        description: t.description || undefined,
      };
    });
  }, [tryoutsQuery.data, filters.page, filters.perPage]);

  // Statistics calculation
  const stats = useMemo<TryoutStats>(() => {
    const list = allTryoutsQuery.data?.tryouts ?? [];
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
      totalTryouts: allTryoutsQuery.data?.total ?? list.length,
      draftCount: draft,
      publishedCount: published,
      unpublishedCount: unpublished,
    };
  }, [allTryoutsQuery.data]);

  const totalItems = tryoutsQuery.data?.total ?? tryouts.length;

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

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setFilters((prev) => ({ ...prev, perPage, page: 1 }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([tryoutsQuery.refetch(), allTryoutsQuery.refetch()]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleOpenDialogChange = (open: boolean) => {
    if (open) {
      setDialogMode('create');
      setDialogForm(EMPTY_TRYOUT_FORM);
      setDialogError(null);
    }
    setIsDialogOpen(open);
  };

  const handleDialogFormChange = <K extends keyof TryoutDialogForm>(
    field: K,
    value: TryoutDialogForm[K]
  ) => {
    setDialogForm((prev) => ({ ...prev, [field]: value }));
    setDialogError(null);
  };

  const handleEdit = (item: TryoutPackageItem) => {
    setDialogMode('edit');
    setDialogForm({
      id: item.id,
      title: item.title,
      description: item.description || '',
      jenjang: item.jenjang || 'sma',
      duration_minutes: item.durationMinutes,
      status: item.status,
    });
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (item: TryoutPackageItem) => {
    const nextStatus = item.status === 'PUBLISHED' ? 'archived' : 'published';
    const nextLabel = item.status === 'PUBLISHED' ? 'Tutup Akses (Unpublish)' : 'Publikasikan';

    ns.alert.confirm({
      title: `${nextLabel} Tryout`,
      deskripsi: `Apakah Anda yakin ingin mengubah status paket tryout "${item.title}" menjadi ${nextStatus}?`,
      icon: 'question',
      onConfirm: () =>
        updateStatusMutation.mutate({
          id: item.id,
          body: { status: nextStatus },
        }),
    });
  };

  const handleDelete = (item: TryoutPackageItem) => {
    ns.alert.confirm({
      title: 'Hapus Paket Tryout',
      deskripsi: `Apakah Anda yakin ingin menghapus paket tryout "${item.title}"? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'error',
      onConfirm: () => deleteTryoutMutation.mutate(item.id),
    });
  };

  const handleSubmitDialog = async () => {
    if (!dialogForm.title.trim()) {
      setDialogError('Judul paket tryout wajib diisi.');
      return;
    }
    if (!dialogForm.duration_minutes || dialogForm.duration_minutes < 1) {
      setDialogError('Durasi tryout minimal 1 menit.');
      return;
    }

    try {
      if (dialogMode === 'create') {
        await createTryoutMutation.mutateAsync({
          title: dialogForm.title.trim(),
          description: dialogForm.description.trim() || undefined,
          jenjang: dialogForm.jenjang as SchoolLevel,
          duration_seconds: dialogForm.duration_minutes * 60,
        });
      } else {
        if (!dialogForm.id) return;
        await updateTryoutMutation.mutateAsync({
          id: dialogForm.id,
          body: {
            title: dialogForm.title.trim(),
            description: dialogForm.description.trim() || undefined,
            jenjang: dialogForm.jenjang as SchoolLevel,
            duration_seconds: dialogForm.duration_minutes * 60,
          },
        });
        await updateStatusMutation.mutateAsync({
          id: dialogForm.id,
          body: {
            status:
              dialogForm.status === 'UNPUBLISHED' ? 'archived' : dialogForm.status.toLowerCase(),
          },
        });
      }
      setIsDialogOpen(false);
    } catch {
      // Handled by mutation toast
    }
  };

  const handleExportSummary = () => {
    const summaryText = `RINGKASAN DAFTAR TRYOUT SIMANTIK\n\nTotal Paket: ${stats.totalTryouts}\nPublished: ${stats.publishedCount}\nDraft: ${stats.draftCount}\nUnpublished: ${stats.unpublishedCount}\nTanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n\nDaftar Tryout:\n${tryouts.map((t, i) => `${i + 1}. ${t.title} (${t.durationMinutes} Menit, ${t.totalQuestions} Soal) - Status: ${t.status}`).join('\n')}`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ringkasan-Daftar-Tryout-SIMANTIK.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TryoutListPage
      stats={stats}
      tryouts={tryouts}
      filters={filters}
      totalItems={totalItems}
      isRefreshing={isRefreshing}
      onSearchChange={handleSearchChange}
      onJenjangChange={handleJenjangChange}
      onStatusChange={handleStatusChange}
      onRefresh={handleRefresh}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      isDialogOpen={isDialogOpen}
      onOpenDialogChange={handleOpenDialogChange}
      dialogMode={dialogMode}
      dialogForm={dialogForm}
      dialogError={dialogError}
      isSubmitting={createTryoutMutation.isPending || updateTryoutMutation.isPending}
      onDialogFormChange={handleDialogFormChange}
      onSubmitDialog={handleSubmitDialog}
      onEdit={handleEdit}
      onManageQuestions={(item) => router.push(`/content_manager/tryouts/${item.id}`)}
      onToggleStatus={handleToggleStatus}
      onDelete={handleDelete}
      onExportSummary={handleExportSummary}
    />
  );
};

export default TryoutListContainer;
