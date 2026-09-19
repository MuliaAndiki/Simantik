'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { MaterialListPage } from '@/components/page/private/content_manager/MaterialListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type {
  InspectorViewMode,
  MaterialFilterState,
  MaterialItem,
  MaterialStats,
  MaterialStatusType,
  ModuleDialogForm,
  ModuleItem,
} from '@/types/ui/material-manager.types';

const EMPTY_MODULE_FORM: ModuleDialogForm = {
  title: '',
  description: '',
  label: '',
  status: 'DRAFT',
};

export const MaterialListContainer: React.FC = () => {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();

  // Local state
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [inspectorMode, setInspectorMode] = useState<InspectorViewMode>('module_materials');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [moduleDialogForm, setModuleDialogForm] = useState<ModuleDialogForm>(EMPTY_MODULE_FORM);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [moduleFormError, setModuleFormError] = useState<string | null>(null);

  const [filters, setFilters] = useState<MaterialFilterState>({
    search: '',
    category: 'Semua Kategori',
    status: 'Semua Status',
    page: 1,
    perPage: 6,
  });

  // Map UI status filter to API status filter
  const apiStatus = useMemo(() => {
    switch (filters.status) {
      case 'Published':
        return 'published';
      case 'In Review':
        return 'in_review';
      case 'Draft':
        return 'draft';
      default:
        return undefined;
    }
  }, [filters.status]);

  // 1. Primary Query: List Modul Pembelajaran
  const modulesQuery = api.learning.query.modules({
    search: filters.search.trim() || undefined,
    status: apiStatus,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  const createModuleMutation = api.learning.mutate.createModule();
  const updateModuleMutation = api.learning.mutate.updateModule();
  const updateModuleStatusMutation = api.learning.mutate.updateModuleStatus();
  const deleteModuleMutation = api.learning.mutate.deleteModule();

  const handleModuleFormChange = <K extends keyof ModuleDialogForm>(
    field: K,
    value: ModuleDialogForm[K]
  ) => {
    setModuleDialogForm((prev) => ({ ...prev, [field]: value }));
    setModuleFormError(null);
  };

  const handleOpenDialogChange = (open: boolean) => {
    if (open) {
      setDialogMode('create');
      setModuleDialogForm(EMPTY_MODULE_FORM);
      setModuleFormError(null);
    }
    setIsModuleDialogOpen(open);
  };

  const handleEditModule = (item: ModuleItem) => {
    setDialogMode('edit');
    setModuleDialogForm({
      id: item.id,
      title: item.title,
      description: item.description,
      label: '',
      status: item.status,
    });
    setModuleFormError(null);
    setIsModuleDialogOpen(true);
  };

  const handleDeleteModule = (item: ModuleItem) => {
    ns.alert.confirm({
      title: 'Hapus Modul',
      deskripsi: 'Apakah anda yakin ingin menghapus modul ini',
      onConfirm: () => deleteModuleMutation.mutate(item.id),
      icon: 'error',
    });
  };

  const handleSubmitModule = async () => {
    if (
      !moduleDialogForm.title.trim() ||
      !moduleDialogForm.label.trim() ||
      !moduleDialogForm.description.trim()
    ) {
      setModuleFormError('Judul, label, dan deskripsi wajib diisi.');
      return;
    }

    try {
      if (dialogMode === 'create') {
        await createModuleMutation.mutateAsync({
          title: moduleDialogForm.title.trim(),
          description: moduleDialogForm.description.trim(),
          label: moduleDialogForm.label.trim(),
        });
      } else {
        if (!moduleDialogForm.id) return;
        await updateModuleMutation.mutateAsync({
          id: moduleDialogForm.id,
          body: {
            title: moduleDialogForm.title.trim(),
            description: moduleDialogForm.description.trim(),
            label: moduleDialogForm.label.trim(),
          },
        });
        await updateModuleStatusMutation.mutateAsync({
          id: moduleDialogForm.id,
          status: moduleDialogForm.status.toLowerCase(),
        });
      }
      setIsModuleDialogOpen(false);
    } catch {
      // Error toast handled by mutation hooks
    }
  };

  // 2. Query for global statistics calculation
  const allModulesQuery = api.learning.query.modules({ limit: 100 });

  // 3. Secondary Query: List Material-Material di dalam modul yang dipilih
  const moduleMaterialsQuery = api.learning.query.materials(
    {
      module_id: selectedModuleId || undefined,
      limit: 100,
    },
    { enabled: !!selectedModuleId }
  );

  // Map modules into ModuleItem table format
  const modules = useMemo<ModuleItem[]>(() => {
    const list = modulesQuery.data?.modules ?? [];

    return list.map((m, idx) => {
      const rawStatus = (m.status || 'draft').toUpperCase();
      const status: MaterialStatusType =
        rawStatus === 'PUBLISHED' ? 'PUBLISHED' : rawStatus === 'IN_REVIEW' ? 'IN_REVIEW' : 'DRAFT';

      const updatedAt = m.updated_at
        ? new Date(m.updated_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Baru saja';

      return {
        id: m.id,
        number: String((filters.page - 1) * filters.perPage + idx + 1).padStart(2, '0'),
        title: m.title,
        description: m.description || 'Modul kurikulum terpadu',
        materialsCount: m.materials_count || 0,
        status,
        updatedAt,
      };
    });
  }, [modulesQuery.data, filters.page, filters.perPage]);

  // Map materials of the selected module into MaterialItem shape
  const moduleMaterials = useMemo<MaterialItem[]>(() => {
    const rawList = moduleMaterialsQuery.data?.materials ?? [];

    return rawList.map((m, idx) => {
      const rawStatus = (m.status || 'draft').toUpperCase();
      const status: MaterialStatusType =
        rawStatus === 'PUBLISHED' ? 'PUBLISHED' : rawStatus === 'IN_REVIEW' ? 'IN_REVIEW' : 'DRAFT';

      const code = `MAT-${m.id.slice(0, 4).toUpperCase()}-${String(m.display_order || idx + 1).padStart(3, '0')}`;
      const updatedAt = m.updated_at
        ? new Date(m.updated_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Baru saja';

      return {
        id: m.id,
        number: String(idx + 1).padStart(2, '0'),
        code,
        fase: 'Fase F • Kurikulum Merdeka',
        title: m.title,
        pagesInfo: `${m.display_order || 1} Halaman Modul • Bahan Ajar SIMANTIK`,
        category: m.competency_name || 'Bahasa Indonesia',
        status,
        updatedAt,
        learningObjectives: [
          {
            id: 1,
            title: 'Capaian Pembelajaran:',
            desc: m.description || 'Memahami materi terstruktur sesuai standar Diknas dan TKA.',
          },
        ],
        previewDocument: {
          categoryBadge: (m.competency_name || 'MODUL PEMBELAJARAN').toUpperCase(),
          chapterInfo: `Unit ${m.display_order || 1}`,
          title: m.title,
          contentParagraph: m.content || m.description || 'Isi konten bahan ajar modul.',
          structureTitle: 'Struktur Modul Ajar:',
          structureItems: [
            { label: '1. Pokok Bahasan:', text: m.description || 'Uraian inti materi.' },
            {
              label: '2. Pendalaman Materi:',
              text: 'Konsep dasar dan analisis wacana komprehensif.',
            },
          ],
          curatorTip: 'Gunakan panduan ini sebagai rujukan kurikulum dan latihan terpadu.',
        },
        auditInfo: {
          createdByName: 'Content Manager',
          curatorId: 'CM-01',
          lastUpdated: updatedAt,
          documentVersion: 'v1.0',
        },
      };
    });
  }, [moduleMaterialsQuery.data]);

  // Find the selected module object
  const selectedModule = useMemo<ModuleItem | null>(() => {
    return modules.find((m) => m.id === selectedModuleId) ?? null;
  }, [modules, selectedModuleId]);

  // Find the selected material object
  const selectedMaterial = useMemo<MaterialItem | null>(() => {
    if (!selectedMaterialId) return null;
    return moduleMaterials.find((m) => m.id === selectedMaterialId) ?? null;
  }, [moduleMaterials, selectedMaterialId]);

  // Statistics calculation
  const stats = useMemo<MaterialStats>(() => {
    const list = allModulesQuery.data?.modules ?? [];
    let draft = 0;
    let review = 0;
    let published = 0;

    for (const item of list) {
      const st = (item.status || '').toLowerCase();
      if (st === 'published') published++;
      else if (st === 'in_review') review++;
      else draft++;
    }

    return {
      totalMaterials: allModulesQuery.data?.total ?? list.length,
      draftCount: draft,
      reviewCount: review,
      publishedCount: published,
    };
  }, [allModulesQuery.data]);

  const totalItems = modulesQuery.data?.total ?? modules.length;

  // Handlers
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        modulesQuery.refetch(),
        allModulesQuery.refetch(),
        selectedModuleId ? moduleMaterialsQuery.refetch() : Promise.resolve(),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // User clicks "Lihat" on a module in table -> sidebar opens with list of materials
  const handleSelectModule = (item: ModuleItem) => {
    setSelectedModuleId(item.id);
    setSelectedMaterialId(null);
    setInspectorMode('module_materials');
    setIsInspectorOpen(true);
  };

  // User clicks a material item inside the sidebar list -> view switches to material detail
  const handleSelectMaterial = (item: MaterialItem) => {
    setSelectedMaterialId(item.id);
    setInspectorMode('material_detail');
    setIsInspectorOpen(true);
  };

  // User clicks "<- Kembali ke Daftar Materi" in the detail sidebar
  const handleBackToMaterialsList = () => {
    setSelectedMaterialId(null);
    setInspectorMode('module_materials');
  };

  const handleCloseInspector = () => {
    setIsInspectorOpen(false);
  };

  const handleEditMaterial = (item: MaterialItem) => {
    router.push(
      `/content_manager/materials/create?id=${item.id}${selectedModuleId ? `&moduleId=${selectedModuleId}` : ''}`
    );
  };

  const handleCreateMaterial = () => {
    router.push(
      selectedModuleId
        ? `/content_manager/materials/create?moduleId=${selectedModuleId}`
        : '/content_manager/materials/create'
    );
  };

  const handleCreateMaterialInModule = (moduleId: string) => {
    router.push(`/content_manager/materials/create?moduleId=${moduleId}`);
  };

  const handleExportSyllabus = () => {
    const syllabusContent = `SILABUS MODUL DAN MATERI SIMANTIK\n\nTotal Modul: ${stats.totalMaterials}\nTanggal Unduh: ${new Date().toLocaleDateString('id-ID')}\n\nDaftar Modul:\n${modules.map((m, i) => `${i + 1}. ${m.title} (${m.materialsCount} Materi) - ${m.status}`).join('\n')}`;
    const blob = new Blob([syllabusContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Silabus-Modul-SIMANTIK.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadModule = (item: MaterialItem) => {
    const moduleContent = `MODUL PEMBELAJARAN SIMANTIK\n\nID: ${item.code}\nJudul: ${item.title}\nKategori: ${item.category}\nFase: ${item.fase}\nStatus: ${item.status}\n\nTUJUAN PEMBELAJARAN:\n${item.learningObjectives.map((o) => `${o.id}. ${o.title} ${o.desc}`).join('\n')}\n\nKONTEN BACAAN:\n${item.previewDocument.title}\n\n${item.previewDocument.contentParagraph}\n\n${item.previewDocument.structureTitle}\n${item.previewDocument.structureItems.map((s) => `${s.label} ${s.text}`).join('\n')}\n\nTip Kurator: ${item.previewDocument.curatorTip}\n\nAudit: Dibuat oleh ${item.auditInfo.createdByName} (${item.auditInfo.curatorId}), ${item.auditInfo.lastUpdated}, Versi ${item.auditInfo.documentVersion}`;
    const blob = new Blob([moduleContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.code}-Modul.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setFilters((prev) => ({ ...prev, perPage, page: 1 }));
  };

  return (
    <MaterialListPage
      stats={stats}
      modules={modules}
      selectedModuleId={selectedModuleId}
      selectedModule={selectedModule}
      moduleMaterials={moduleMaterials}
      selectedMaterial={selectedMaterial}
      inspectorMode={inspectorMode}
      isInspectorOpen={isInspectorOpen}
      isModuleDialogOpen={isModuleDialogOpen}
      onOpenDialogChange={handleOpenDialogChange}
      dialogMode={dialogMode}
      moduleDialogForm={moduleDialogForm}
      moduleFormError={moduleFormError}
      onModuleDialogFormChange={handleModuleFormChange}
      onSubmitModule={handleSubmitModule}
      filters={filters}
      totalItems={totalItems}
      isRefreshing={isRefreshing}
      onSearchChange={handleSearchChange}
      onStatusChange={handleStatusChange}
      onRefresh={handleRefresh}
      onSelectModule={handleSelectModule}
      onEditModule={handleEditModule}
      onDeleteModule={handleDeleteModule}
      onSelectMaterial={handleSelectMaterial}
      onBackToMaterialsList={handleBackToMaterialsList}
      onCloseInspector={handleCloseInspector}
      onEditMaterial={handleEditMaterial}
      onDownloadModule={handleDownloadModule}
      onExportSyllabus={handleExportSyllabus}
      onCreateMaterial={handleCreateMaterial}
      onCreateMaterialInModule={handleCreateMaterialInModule}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

export default MaterialListContainer;
