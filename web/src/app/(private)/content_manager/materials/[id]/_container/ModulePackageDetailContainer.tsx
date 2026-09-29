'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { ModulePackageDetailPage } from '@/components/page/private/content_manager/ModulePackageDetailPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { MaterialResponse } from '@/types/service';

export const ModulePackageDetailContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const api = useApi();
  const ns = useAppNameSpace();

  const moduleId = (params?.id as string) || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Queries
  const moduleQuery = api.learning.query.moduleDetail(moduleId, {
    enabled: !!moduleId,
  });

  const materialsQuery = api.learning.query.materials(
    {
      module_id: moduleId || undefined,
      search: searchQuery.trim() || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      limit: rowsPerPage,
      offset: (currentPage - 1) * rowsPerPage,
    },
    { enabled: !!moduleId }
  );

  const deleteMaterialMutation = api.learning.mutate.deleteMaterial();

  const moduleData = moduleQuery.data ?? null;
  const materials = useMemo<MaterialResponse[]>(() => {
    return materialsQuery.data?.materials ?? [];
  }, [materialsQuery.data]);

  const totalItems = materialsQuery.data?.total ?? materials.length;

  // Handlers
  const handleBack = () => {
    router.push(`${basePath}/materials`);
  };

  const handleCreateMaterial = () => {
    router.push(`${basePath}/materials/create?moduleId=${moduleId}`);
  };

  const handleViewActivities = (material: MaterialResponse) => {
    router.push(`${basePath}/materials/${moduleId}/${material.id}`);
  };

  const handleEditMaterial = (material: MaterialResponse) => {
    router.push(`${basePath}/materials/create?id=${material.id}&moduleId=${moduleId}`);
  };

  const handleDownloadMaterial = (material: MaterialResponse) => {
    const content = `BAHAN AJAR SIMANTIK\n\nJudul: ${material.title}\nKompetensi: ${
      material.competency_name || 'Umum'
    }\nStatus: ${material.status}\n\nDeskripsi:\n${material.description || '-'}\n\nIsi Materi:\n${
      material.content || '-'
    }`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${material.title.replace(/[^a-zA-Z0-9-_]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteMaterial = (material: MaterialResponse) => {
    ns.alert.confirm({
      title: 'Hapus Materi',
      deskripsi: `Apakah Anda yakin ingin menghapus materi "${material.title}"?`,
      onConfirm: async () => {
        await deleteMaterialMutation.mutateAsync(material.id);
        materialsQuery.refetch();
      },
      icon: 'error',
    });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
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
    <ModulePackageDetailPage
      module={moduleData}
      materials={materials}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusFilterChange}
      currentPage={currentPage}
      totalItems={totalItems}
      rowsPerPage={rowsPerPage}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onBack={handleBack}
      onCreateMaterial={handleCreateMaterial}
      onViewActivities={handleViewActivities}
      onEditMaterial={handleEditMaterial}
      onDownloadMaterial={handleDownloadMaterial}
      onDeleteMaterial={handleDeleteMaterial}
      isLoading={materialsQuery.isPending}
    />
  );
};

export default ModulePackageDetailContainer;
