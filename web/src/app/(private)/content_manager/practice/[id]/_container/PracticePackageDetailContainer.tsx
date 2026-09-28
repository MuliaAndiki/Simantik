'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { PracticePackageDetailPage } from '@/components/page/private/content_manager/PracticePackageDetailPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { PracticeStudentResultItem } from '@/types/service';

export const PracticePackageDetailContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const api = useApi();
  const ns = useAppNameSpace();

  const packageId = params?.id || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<string>('highest_score');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Queries
  const resultsQuery = api.practice.query.packageResults(
    packageId,
    {
      search: searchQuery.trim() || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      sort: sortFilter,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    { enabled: !!packageId }
  );

  const updateStatusMutation = api.practice.mutate.updatePackageStatus();

  const packageData = resultsQuery.data ?? null;
  const students = useMemo<PracticeStudentResultItem[]>(() => {
    return packageData?.students ?? [];
  }, [packageData]);

  const selectedStudent = useMemo<PracticeStudentResultItem | null>(() => {
    if (selectedUserId) {
      const found = students.find((s) => s.user_id === selectedUserId);
      if (found) return found;
    }
    return students.length > 0 ? students[0] : null;
  }, [students, selectedUserId]);

  const totalItems = packageData?.total ?? students.length;

  // Handlers
  const handleBack = () => {
    router.push(`${basePath}/practice`);
  };

  const handleEdit = () => {
    router.push(`${basePath}/practice/${packageId}/edit`);
  };

  const handleToggleStatus = () => {
    if (!packageData) return;
    const isPublished = (packageData.status || '').toLowerCase() === 'published';
    const nextStatus = isPublished ? 'archived' : 'published';
    const nextLabel = isPublished ? 'Unpublish' : 'Publish';

    ns.alert.confirm({
      title: `${nextLabel} Paket Latihan`,
      deskripsi: `Apakah Anda yakin ingin mengubah status paket "${packageData.package_title}" menjadi ${nextStatus}?`,
      icon: 'question',
      onConfirm: async () => {
        await updateStatusMutation.mutateAsync({
          id: packageId,
          status: nextStatus,
        });
        resultsQuery.refetch();
      },
    });
  };

  const handleSelectStudent = (student: PracticeStudentResultItem) => {
    setSelectedUserId(student.user_id);
  };

  const handleViewResult = (student: PracticeStudentResultItem) => {
    if (student.attempt_id) {
      router.push(
        `${basePath}/practice/${packageId}/result?attemptId=${student.attempt_id}&userId=${student.user_id}`
      );
    } else {
      ns.alert.toast({
        title: 'Belum Ada Hasil',
        message: `Siswa "${student.student_name}" belum menyelesaikan pengerjaan paket latihan ini.`,
        icon: 'info',
      });
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
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

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <PracticePackageDetailPage
      packageData={packageData}
      students={students}
      selectedStudent={selectedStudent}
      selectedUserId={selectedStudent?.user_id || selectedUserId}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      sortFilter={sortFilter}
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onBack={handleBack}
      onEdit={handleEdit}
      onToggleStatus={handleToggleStatus}
      onSelectStudent={handleSelectStudent}
      onViewResult={handleViewResult}
      onSearchChange={handleSearchChange}
      onStatusFilterChange={handleStatusFilterChange}
      onSortFilterChange={handleSortFilterChange}
      isLoading={resultsQuery.isPending}
      isTogglingStatus={updateStatusMutation.isPending}
    />
  );
};

export default PracticePackageDetailContainer;
