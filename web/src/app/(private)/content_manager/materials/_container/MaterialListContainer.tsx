'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { MaterialListPage } from '@/components/page/private/content_manager/MaterialListPage';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { Api } from '@/services/props.service';
import { TMode } from '@/types/app';
import type { SchoolLevel } from '@/types/service';
import type {
  InspectorViewMode,
  MaterialFilterState,
  MaterialItem,
  MaterialStats,
  MaterialStatusType,
  ModuleDialogForm,
  ModuleItem,
} from '@/types/ui/material-manager.types';
import { resolveCompetencyName } from '@/utils/competency.util';

const EMPTY_MODULE_FORM: ModuleDialogForm = {
  title: '',
  description: '',
  label: '',
  jenjang: 'sma',
  status: 'DRAFT',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const MaterialListContainer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi();
  const ns = useAppNameSpace();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  // Local state
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [inspectorMode, setInspectorMode] = useState<InspectorViewMode>('module_materials');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [moduleDialogForm, setModuleDialogForm] = useState<ModuleDialogForm>(EMPTY_MODULE_FORM);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<TMode>('create');
  const [moduleFormError, setModuleFormError] = useState<string | null>(null);

  // Selection & Syllabus Export State
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);
  const [isExportingSyllabus, setIsExportingSyllabus] = useState<boolean>(false);
  const [updatingMaterialId, setUpdatingMaterialId] = useState<string | null>(null);

  const [filters, setFilters] = useState<MaterialFilterState>({
    search: '',
    category: 'Semua Kategori',
    jenjang: 'Semua Jenjang',
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

  const apiJenjang = useMemo(() => {
    return filters.jenjang !== 'Semua Jenjang'
      ? (filters.jenjang.toLowerCase() as SchoolLevel)
      : undefined;
  }, [filters.jenjang]);

  // 1. Primary Query: List Modul Pembelajaran
  const modulesQuery = api.learning.query.modules({
    search: filters.search.trim() || undefined,
    status: apiStatus,
    jenjang: apiJenjang,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  const createModuleMutation = api.learning.mutate.createModule();
  const updateModuleMutation = api.learning.mutate.updateModule();
  const updateModuleStatusMutation = api.learning.mutate.updateModuleStatus();
  const deleteModuleMutation = api.learning.mutate.deleteModule();
  const updateMaterialStatusMutation = api.learning.mutate.updateMaterialStatus();

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
      label: item.label,
      jenjang: 'sma',
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
          jenjang: moduleDialogForm.jenjang,
        });
      } else {
        if (!moduleDialogForm.id) return;
        await updateModuleMutation.mutateAsync({
          id: moduleDialogForm.id,
          body: {
            title: moduleDialogForm.title.trim(),
            description: moduleDialogForm.description.trim(),
            label: moduleDialogForm.label.trim(),
            jenjang: moduleDialogForm.jenjang,
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
        rawStatus === 'PUBLISHED'
          ? 'PUBLISHED'
          : rawStatus === 'IN_REVIEW' || rawStatus === 'REVIEW'
            ? 'IN_REVIEW'
            : rawStatus === 'ARCHIVED'
              ? 'ARCHIVED'
              : 'DRAFT';

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
        label: m.label || 'Modul kurikulum terpadu',
        jenjang: m.jenjang || 'sma',
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
        rawStatus === 'PUBLISHED'
          ? 'PUBLISHED'
          : rawStatus === 'IN_REVIEW' || rawStatus === 'REVIEW'
            ? 'IN_REVIEW'
            : rawStatus === 'ARCHIVED'
              ? 'ARCHIVED'
              : 'DRAFT';

      const code = `MAT-${m.id.slice(0, 4).toUpperCase()}-${String(m.display_order || idx + 1).padStart(3, '0')}`;
      const updatedAt = m.updated_at
        ? new Date(m.updated_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Baru saja';

      // Parse learning objectives from DB (stored as JSON array of strings or { id, text })
      const parsedObjectives: string[] = (() => {
        if (!m.learning_objectives) return [];
        try {
          const parsed = JSON.parse(m.learning_objectives);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item) => (typeof item === 'string' ? item : item.text || item.desc || ''))
              .filter(Boolean);
          }
          return [];
        } catch {
          return [];
        }
      })();

      // Parse structure items from DB (stored as JSON array of { label, text })
      const parsedStructureItems: Array<{ label: string; text: string }> = (() => {
        if (!m.structure_items) return [];
        try {
          const parsed = JSON.parse(m.structure_items);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })();

      return {
        id: m.id,
        number: String(idx + 1).padStart(2, '0'),
        code,
        fase: 'Fase F • Kurikulum Merdeka',
        title: m.title,
        pagesInfo: `${m.display_order || 1} Halaman Modul • Bahan Ajar SIMANTIK`,
        category: resolveCompetencyName(m.competency_name),
        status,
        updatedAt,
        learningObjectives: parsedObjectives.map((obj, i) => ({
          id: i + 1,
          title: `Tujuan ${i + 1}:`,
          desc: obj,
        })),
        previewDocument: {
          categoryBadge: resolveCompetencyName(m.competency_name).toUpperCase(),
          chapterInfo: `Unit ${m.display_order || 1}`,
          title: m.title,
          contentParagraph: m.content || m.description || 'Isi konten bahan ajar modul.',
          structureTitle: 'Struktur Modul Ajar:',
          structureItems: parsedStructureItems,
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

  const handleJenjangChange = (jenjang: string) => {
    setFilters((prev) => ({ ...prev, jenjang, page: 1 }));
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

  const handleNavigateModule = (item: ModuleItem) => {
    router.push(`${basePath}/materials/${item.id}`);
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
      `${basePath}/materials/create?id=${item.id}${selectedModuleId ? `&moduleId=${selectedModuleId}` : ''}`
    );
  };

  const handleViewMaterialActivities = (item: MaterialItem) => {
    router.push(`${basePath}/materials/${selectedModuleId || item.id}/${item.id}`);
  };

  const handleCreateMaterial = () => {
    router.push(
      selectedModuleId
        ? `${basePath}/materials/create?moduleId=${selectedModuleId}`
        : `${basePath}/materials/create`
    );
  };

  const handleCreateMaterialInModule = (moduleId: string) => {
    router.push(`${basePath}/materials/create?moduleId=${moduleId}`);
  };

  const handleChangeMaterialStatus = async (
    material: MaterialItem,
    newStatus: MaterialStatusType
  ) => {
    const apiStatus =
      newStatus === 'PUBLISHED'
        ? 'published'
        : newStatus === 'IN_REVIEW'
          ? 'review'
          : newStatus === 'ARCHIVED'
            ? 'archived'
            : 'draft';

    setUpdatingMaterialId(material.id);
    try {
      await updateMaterialStatusMutation.mutateAsync({
        id: material.id,
        status: apiStatus,
      });

      ns.alert.toast({
        title: 'Status Materi Diperbarui',
        message: `Status materi "${material.title}" berhasil diubah menjadi ${newStatus}.`,
        icon: 'success',
      });

      if (selectedModuleId) {
        await moduleMaterialsQuery.refetch();
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui status materi.';
      ns.alert.toast({
        title: 'Gagal Memperbarui Status',
        message: errorMsg,
        icon: 'error',
      });
    } finally {
      setUpdatingMaterialId(null);
    }
  };

  const handleToggleModuleSelection = (moduleId: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleSelectAllModules = () => {
    setSelectedModuleIds(modules.map((m) => m.id));
  };

  const handleDeselectAllModules = () => {
    setSelectedModuleIds([]);
  };

  const handleExportSyllabus = () => {
    if (selectedModuleIds.length === 0 && modules.length > 0) {
      setSelectedModuleIds(modules.map((m) => m.id));
    }
    setIsExportDialogOpen(true);
  };

  const fetchSelectedModulesData = async () => {
    const selected = modules.filter((m) => selectedModuleIds.includes(m.id));
    if (selected.length === 0) {
      ns.alert.toast({
        title: 'Peringatan',
        message: 'Pilih setidaknya satu modul untuk diekspor ke silabus.',
        icon: 'warning',
      });
      return null;
    }

    const data = await Promise.all(
      selected.map(async (mod) => {
        try {
          const res = await Api.learning.ListMaterialsService({
            module_id: mod.id,
            limit: 100,
          });
          return {
            module: mod,
            materials: res.data?.materials || [],
          };
        } catch {
          return {
            module: mod,
            materials: [],
          };
        }
      })
    );
    return data;
  };

  const handleExportSyllabusTxt = async () => {
    setIsExportingSyllabus(true);
    try {
      const data = await fetchSelectedModulesData();
      if (!data) return;

      const dateStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      let content =
        '================================================================================\n';
      content += '                    SILABUS MODUL PEMBELAJARAN SIMANTIK\n';
      content +=
        '================================================================================\n';
      content += `Tanggal Unduh   : ${dateStr}\n`;
      content += `Jumlah Modul    : ${data.length} Modul Terpilih\n\n`;

      data.forEach((item, modIdx) => {
        content +=
          '--------------------------------------------------------------------------------\n';
        content += `MODUL ${modIdx + 1}: ${item.module.title.toUpperCase()}\n`;
        content +=
          '--------------------------------------------------------------------------------\n';
        content += `Label       : ${item.module.label}\n`;
        content += `Jenjang     : ${item.module.jenjang.toUpperCase()}\n`;
        content += `Status      : ${item.module.status}\n`;
        content += `Deskripsi   : ${item.module.description}\n`;
        content += `Total Materi: ${item.materials.length} Materi\n\n`;

        if (item.materials.length === 0) {
          content += '  (Belum ada materi pembelajaran pada modul ini)\n\n';
        } else {
          content += 'DAFTAR MATERI PEMBELAJARAN:\n';
          item.materials.forEach((mat, matIdx) => {
            content += `  ${matIdx + 1}. [${mat.display_order}] ${mat.title}\n`;
            if (mat.description) {
              content += `     Deskripsi: ${mat.description}\n`;
            }

            // Learning objectives
            let objectives: string[] = [];
            if (mat.learning_objectives) {
              try {
                const parsed = JSON.parse(mat.learning_objectives);
                if (Array.isArray(parsed)) {
                  objectives = parsed
                    .map((item) => (typeof item === 'string' ? item : item.text || item.desc || ''))
                    .filter(Boolean);
                }
              } catch {}
            }
            if (objectives.length > 0) {
              content += '     Tujuan Pembelajaran:\n';
              objectives.forEach((obj) => {
                content += `       * ${obj}\n`;
              });
            }

            // Structure items
            let structures: Array<{ label: string; text: string }> = [];
            if (mat.structure_items) {
              try {
                const parsed = JSON.parse(mat.structure_items);
                if (Array.isArray(parsed)) structures = parsed;
              } catch {}
            }
            if (structures.length > 0) {
              content += '     Struktur Modul Ajar:\n';
              structures.forEach((st) => {
                content += `       * ${st.label} ${st.text}\n`;
              });
            }

            content += '\n';
          });
        }
        content += '\n';
      });

      content +=
        '================================================================================\n';
      content += '              © SIMANTIK - Sistem Manajemen Kurikulum Literasi\n';
      content +=
        '================================================================================\n';

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Silabus-SIMANTIK-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setIsExportDialogOpen(false);
    } finally {
      setIsExportingSyllabus(false);
    }
  };

  const handleExportSyllabusHtml = async () => {
    setIsExportingSyllabus(true);
    try {
      const data = await fetchSelectedModulesData();
      if (!data) return;

      const dateStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const modulesHtml = data
        .map((item, modIdx) => {
          const materialsHtml =
            item.materials.length === 0
              ? '<p class="empty-note">Belum ada materi terdaftar pada modul ini.</p>'
              : item.materials
                  .map((mat, matIdx) => {
                    let objectives: string[] = [];
                    if (mat.learning_objectives) {
                      try {
                        const parsed = JSON.parse(mat.learning_objectives);
                        if (Array.isArray(parsed)) {
                          objectives = parsed
                            .map((item) =>
                              typeof item === 'string' ? item : item.text || item.desc || ''
                            )
                            .filter(Boolean);
                        }
                      } catch {}
                    }

                    let structures: Array<{ label: string; text: string }> = [];
                    if (mat.structure_items) {
                      try {
                        const parsed = JSON.parse(mat.structure_items);
                        if (Array.isArray(parsed)) structures = parsed;
                      } catch {}
                    }

                    const objectivesHtml =
                      objectives.length > 0
                        ? `
                        <div class="meta-section">
                          <div class="meta-title">Tujuan Pembelajaran:</div>
                          <ul class="meta-list">
                            ${objectives.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}
                          </ul>
                        </div>
                      `
                        : '';

                    const structuresHtml =
                      structures.length > 0
                        ? `
                        <div class="meta-section">
                          <div class="meta-title">Struktur Bahan Ajar:</div>
                          <ul class="meta-list">
                            ${structures
                              .map(
                                (s) =>
                                  `<li><strong>${escapeHtml(s.label)}</strong> ${escapeHtml(s.text)}</li>`
                              )
                              .join('')}
                          </ul>
                        </div>
                      `
                        : '';

                    return `
                      <div class="material-card">
                        <div class="material-header">
                          <span class="material-num">${matIdx + 1}</span>
                          <div>
                            <div class="material-title">${escapeHtml(mat.title)}</div>
                            ${mat.description ? `<div class="material-desc">${escapeHtml(mat.description)}</div>` : ''}
                          </div>
                        </div>
                        ${objectivesHtml}
                        ${structuresHtml}
                      </div>
                    `;
                  })
                  .join('');

          return `
            <div class="module-block">
              <div class="module-banner">
                <span class="module-index">MODUL ${modIdx + 1}</span>
                <span class="badge ${item.module.status.toLowerCase()}">${escapeHtml(item.module.status)}</span>
                <span class="badge jenjang">${escapeHtml(item.module.jenjang.toUpperCase())}</span>
              </div>
              <h2 class="module-title">${escapeHtml(item.module.title)}</h2>
              <div class="module-label">${escapeHtml(item.module.label)}</div>
              <p class="module-desc">${escapeHtml(item.module.description)}</p>
              <div class="materials-wrapper">
                <h3 class="materials-header">Daftar Bahan Ajar (${item.materials.length} Unit)</h3>
                ${materialsHtml}
              </div>
            </div>
          `;
        })
        .join('');

      const htmlDocument = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Silabus Modul Pembelajaran SIMANTIK</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 20px; font-weight: 900; color: #0f766e; letter-spacing: -0.5px; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .date-info { text-align: right; font-size: 11px; color: #94a3b8; font-weight: 600; }
    .module-block { margin-bottom: 32px; padding: 20px; background: #fdfefe; border: 1px solid #e2e8f0; border-radius: 10px; page-break-inside: avoid; }
    .module-banner { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .module-index { font-size: 11px; font-weight: 800; color: #0f766e; letter-spacing: 0.5px; }
    .badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
    .badge.published { background: #dcfce7; color: #15803d; }
    .badge.in_review { background: #fef3c7; color: #b45309; }
    .badge.draft { background: #f1f5f9; color: #64748b; }
    .badge.jenjang { background: #e0f2fe; color: #0369a1; }
    .module-title { font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0; }
    .module-label { font-size: 12px; font-weight: 600; color: #0d9488; margin-bottom: 6px; }
    .module-desc { font-size: 12px; color: #475569; margin: 0 0 16px 0; }
    .materials-header { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #334155; margin-bottom: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; }
    .material-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; }
    .material-header { display: flex; align-items: flex-start; gap: 10px; }
    .material-num { display: inline-flex; width: 22px; height: 22px; border-radius: 50%; background: #0f766e; color: #fff; font-size: 11px; font-weight: 800; align-items: center; justify-content: center; shrink-0; }
    .material-title { font-size: 13px; font-weight: 700; color: #0f172a; }
    .material-desc { font-size: 11px; color: #64748b; margin-top: 2px; }
    .meta-section { margin-top: 8px; padding-top: 6px; border-top: 1px solid #f1f5f9; font-size: 11px; }
    .meta-title { font-weight: 700; color: #0f766e; margin-bottom: 3px; }
    .meta-list { margin: 0; padding-left: 18px; color: #334155; }
    .meta-list li { margin-bottom: 2px; }
    .empty-note { font-size: 11px; font-style: italic; color: #94a3b8; }
    .print-actions { text-align: center; margin-bottom: 20px; }
    .print-btn { background: #0f766e; color: #fff; border: none; padding: 10px 24px; font-size: 13px; font-weight: 700; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .print-btn:hover { background: #115e59; }
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .print-actions { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="print-btn" onclick="window.print()">Cetak / Simpan sebagai PDF</button>
  </div>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand">SIMANTIK • SISTEM MANAJEMEN KURIKULUM</div>
        <div class="subtitle">Silabus Modul dan Bahan Ajar Literasi Terpadu</div>
      </div>
      <div class="date-info">
        <div>Tanggal Dokumen: ${dateStr}</div>
        <div>Total Modul: ${data.length} Modul Terpilih</div>
      </div>
    </div>
    ${modulesHtml}
  </div>
</body>
</html>`;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlDocument);
        printWindow.document.close();
      }
      setIsExportDialogOpen(false);
    } finally {
      setIsExportingSyllabus(false);
    }
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
      isPending={modulesQuery.isPending}
      onSearchChange={handleSearchChange}
      onJenjangChange={handleJenjangChange}
      onStatusChange={handleStatusChange}
      onRefresh={handleRefresh}
      onSelectModule={handleSelectModule}
      onNavigateModule={handleNavigateModule}
      onEditModule={handleEditModule}
      onDeleteModule={handleDeleteModule}
      onSelectMaterial={handleSelectMaterial}
      onBackToMaterialsList={handleBackToMaterialsList}
      onCloseInspector={handleCloseInspector}
      onEditMaterial={handleEditMaterial}
      onViewActivities={handleViewMaterialActivities}
      onDownloadModule={handleDownloadModule}
      onExportSyllabus={handleExportSyllabus}
      onCreateMaterial={handleCreateMaterial}
      onCreateMaterialInModule={handleCreateMaterialInModule}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      selectedModuleIds={selectedModuleIds}
      onToggleModuleSelection={handleToggleModuleSelection}
      onSelectAllModules={handleSelectAllModules}
      onDeselectAllModules={handleDeselectAllModules}
      isExportDialogOpen={isExportDialogOpen}
      onExportDialogOpenChange={setIsExportDialogOpen}
      onExportSyllabusHtml={handleExportSyllabusHtml}
      onExportSyllabusTxt={handleExportSyllabusTxt}
      isExportingSyllabus={isExportingSyllabus}
      onChangeMaterialStatus={handleChangeMaterialStatus}
      updatingMaterialId={updatingMaterialId}
    />
  );
};

export default MaterialListContainer;
