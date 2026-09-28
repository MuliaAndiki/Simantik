'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { MaterialStudentActivityPage } from '@/components/page/private/content_manager/MaterialStudentActivityPage';
import { useApi } from '@/hooks/useApi';
import type { MaterialStudentActivityItem } from '@/types/service';

export const MaterialStudentActivityContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const api = useApi();

  const moduleId = (params?.id as string) || '';
  const materialId = (params?.materialId as string) || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Query API
  const activitiesQuery = api.learning.query.materialActivities(
    materialId,
    {
      search: searchQuery.trim() || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      sort: sortFilter,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    { enabled: !!materialId }
  );

  const materialDetailQuery = api.learning.query.materialDetail(materialId, {
    enabled: !!materialId,
  });

  const data = activitiesQuery.data;
  const material = materialDetailQuery.data;

  // Derive students list
  const students = useMemo<MaterialStudentActivityItem[]>(() => {
    return data?.students ?? [];
  }, [data]);

  // Selected student for right inspection drawer
  const selectedStudent = useMemo<MaterialStudentActivityItem | null>(() => {
    if (selectedUserId) {
      const found = students.find((s) => s.user_id === selectedUserId);
      if (found) return found;
    }
    return students.length > 0 ? students[0] : null;
  }, [students, selectedUserId]);

  // Handlers
  const handleBack = () => {
    if (moduleId) {
      router.push(`${basePath}/materials/${moduleId}`);
    } else {
      router.push(`${basePath}/materials`);
    }
  };

  const handleExportData = () => {
    const title = data?.material_title || material?.title || 'Materi';
    let csv = `LAPORAN AKTIVITAS SISWA - ${title}\n`;
    csv += `Total Siswa: ${data?.total_students || 0}\n`;
    csv += `Sudah Diakses: ${data?.accessed_students || 0}\n`;
    csv += `Belum Diakses: ${data?.unaccessed_students || 0}\n`;
    csv += `Persentase Partisipasi: ${data?.participation_rate || 0}%\n\n`;
    csv += `No,Nama Siswa,NIS,Email,Status Akses,Terakhir Diakses,Jumlah Sesi,Perangkat\n`;

    students.forEach((s, idx) => {
      csv += `"${idx + 1}","${s.student_name}","${s.nis}","${s.student_email}","${
        s.is_accessed ? 'Sudah Diakses' : 'Belum Diakses'
      }","${s.formatted_last_accessed || '-'}","${s.access_count}","${s.device_browser}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aktivitas-Siswa-${materialId || 'Materi'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewMaterial = () => {
    router.push(
      `${basePath}/materials/create?id=${materialId}${moduleId ? `&moduleId=${moduleId}` : ''}`
    );
  };

  const handleSelectStudent = (student: MaterialStudentActivityItem) => {
    setSelectedUserId(student.user_id);
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

  const materialTitle =
    data?.material_title ||
    material?.title ||
    'Memahami Teks Eksplanasi: Ciri, Kaidah Kebahasaan, dan Struktur Analisis';
  const competencyName = data?.competency_name || material?.competency_name || 'PEMAHAMAN TEKSTUAL';
  const status = data?.status || material?.status || 'PUBLISHED';
  const totalStudents = data?.total_students ?? 0;
  const accessedStudents = data?.accessed_students ?? 0;
  const unaccessedStudents = data?.unaccessed_students ?? 0;
  const participationRate = data?.participation_rate ?? 0;
  const lastUpdatedAt = data?.last_updated_at || 'Baru saja';
  const totalItems = data?.total ?? students.length;

  return (
    <MaterialStudentActivityPage
      materialTitle={materialTitle}
      competencyName={competencyName}
      status={status}
      totalStudents={totalStudents}
      accessedStudents={accessedStudents}
      unaccessedStudents={unaccessedStudents}
      participationRate={participationRate}
      lastUpdatedAt={lastUpdatedAt}
      students={students}
      selectedStudent={selectedStudent}
      selectedUserId={selectedStudent?.user_id || selectedUserId}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      sortFilter={sortFilter}
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={pageSize}
      isLoading={activitiesQuery.isPending}
      onBack={handleBack}
      onExportData={handleExportData}
      onViewMaterial={handleViewMaterial}
      onSelectStudent={handleSelectStudent}
      onSearchChange={handleSearchChange}
      onStatusFilterChange={handleStatusFilterChange}
      onSortFilterChange={handleSortFilterChange}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default MaterialStudentActivityContainer;
