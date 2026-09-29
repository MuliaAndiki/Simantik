'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { TryoutPackageDetailPage } from '@/components/page/private/content_manager/TryoutPackageDetailPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';
import type { TryoutStudentResultItem } from '@/types/service';

export const TryoutPackageDetailContainer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi();
  const ns = useAppNameSpace();

  const tryoutId = typeof params.id === 'string' ? params.id : '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  // Filters & State
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<string>('highest_score');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Query Package Results
  const resultsQuery = api.tryout.query.packageResults(
    tryoutId,
    {
      search: debouncedSearch.trim() || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      sort: sortFilter,
      limit: rowsPerPage,
      offset: (currentPage - 1) * rowsPerPage,
    },
    { enabled: !!tryoutId }
  );

  const updateStatusMutation = api.tryout.mutate.updateStatus();

  const packageData = resultsQuery.data ?? null;
  const students = useMemo<TryoutStudentResultItem[]>(() => {
    return packageData?.students ?? [];
  }, [packageData]);

  const totalItems = packageData?.total ?? 0;

  const handleBack = () => {
    router.push(`${basePath}/tryouts`);
  };

  const handleManageQuestions = () => {
    router.push(`${basePath}/tryouts/${tryoutId}/edit`);
  };

  const handleEdit = () => {
    router.push(`${basePath}/tryouts/${tryoutId}/edit`);
  };

  const handleToggleStatus = () => {
    if (!packageData) return;
    const isPublished = packageData.status.toLowerCase() === 'published';
    const nextStatus = isPublished ? 'archived' : 'published';
    const nextLabel = isPublished ? 'Tutup Akses (Unpublish)' : 'Publikasikan';

    ns.alert.confirm({
      title: `${nextLabel} Tryout`,
      deskripsi: `Apakah Anda yakin ingin mengubah status paket tryout "${packageData.tryout_title}" menjadi ${nextStatus}?`,
      icon: 'question',
      onConfirm: () =>
        updateStatusMutation.mutate(
          {
            id: tryoutId,
            body: { status: nextStatus },
          },
          {
            onSuccess: () => {
              resultsQuery.refetch();
            },
          }
        ),
    });
  };

  const handleViewStudentResult = (student: TryoutStudentResultItem) => {
    if (!student.attempt_id) {
      ns.alert.toast({
        title: 'Hasil Belum Tersedia',
        message: 'Siswa belum menyelesaikan atau mengumpulkan sesi tryout ini.',
        icon: 'info',
      });
      return;
    }
    router.push(`${basePath}/tryouts/${tryoutId}/result?attemptId=${student.attempt_id}`);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleSortFilterChange = (val: string) => {
    setSortFilter(val);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  return (
    <TryoutPackageDetailPage
      packageData={packageData}
      students={students}
      isLoading={resultsQuery.isPending}
      search={search}
      onSearchChange={handleSearchChange}
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusFilterChange}
      sortFilter={sortFilter}
      onSortFilterChange={handleSortFilterChange}
      currentPage={currentPage}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onBack={handleBack}
      onEdit={handleEdit}
      onManageQuestions={handleManageQuestions}
      onToggleStatus={handleToggleStatus}
      isTogglingStatus={updateStatusMutation.isPending}
      onViewStudentResult={handleViewStudentResult}
      onRefresh={() => resultsQuery.refetch()}
    />
  );
};

export default TryoutPackageDetailContainer;
