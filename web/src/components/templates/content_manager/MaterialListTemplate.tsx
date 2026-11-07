import { Download, Plus } from 'lucide-react';
import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  ExportSyllabusDialog,
  MaterialDataTable,
  MaterialFilterBar,
  MaterialInspectorPanel,
  MaterialStatCards,
} from '@/components/organisms/content_manager/materials';
import MaterialCreateDialog from '@/components/organisms/content_manager/materials/MaterialCreateDialog';
import type {
  InspectorViewMode,
  MaterialFilterState,
  MaterialItem,
  MaterialStats,
  ModuleDialogForm,
  ModuleItem,
} from '@/types/ui/material-manager.types';

export interface MaterialListTemplateProps {
  stats: MaterialStats;
  modules: ModuleItem[];
  selectedModuleId: string;
  selectedModule: ModuleItem | null;
  moduleMaterials: MaterialItem[];
  selectedMaterial: MaterialItem | null;
  inspectorMode: InspectorViewMode;
  isInspectorOpen: boolean;
  filters: MaterialFilterState;
  totalItems: number;
  isRefreshing?: boolean;
  isPending: boolean;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  isModuleDialogOpen: boolean;
  onOpenDialogChange: (open: boolean) => void;
  dialogMode?: 'create' | 'edit';
  moduleDialogForm: ModuleDialogForm;
  moduleFormError?: string | null;
  onModuleDialogFormChange: (field: keyof ModuleDialogForm, value: string) => void;
  onSubmitModule: () => Promise<void> | void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  onSelectModule: (item: ModuleItem) => void;
  onNavigateModule?: (item: ModuleItem) => void;
  onEditModule: (item: ModuleItem) => void;
  onDeleteModule: (item: ModuleItem) => void;
  onSelectMaterial: (item: MaterialItem) => void;
  onBackToMaterialsList: () => void;
  onCloseInspector: () => void;
  onEditMaterial: (item: MaterialItem) => void;
  onViewActivities?: (item: MaterialItem) => void;
  onDownloadModule: (item: MaterialItem) => void;
  onExportSyllabus: () => void;
  onCreateMaterial: () => void;
  onCreateMaterialInModule?: (moduleId: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  selectedModuleIds?: string[];
  onToggleModuleSelection?: (moduleId: string) => void;
  onSelectAllModules?: () => void;
  onDeselectAllModules?: () => void;
  isExportDialogOpen?: boolean;
  onExportDialogOpenChange?: (open: boolean) => void;
  onExportSyllabusHtml?: () => Promise<void> | void;
  onExportSyllabusTxt?: () => Promise<void> | void;
  isExportingSyllabus?: boolean;
}

export const MaterialListTemplate: React.FC<MaterialListTemplateProps> = ({
  stats,
  modules,
  selectedModuleId,
  selectedModule,
  moduleMaterials,
  selectedMaterial,
  inspectorMode,
  isInspectorOpen,
  filters,
  totalItems,
  isRefreshing = false,
  isPending,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onRefresh,
  onSelectModule,
  onNavigateModule,
  onEditModule,
  onDeleteModule,
  onSelectMaterial,
  onBackToMaterialsList,
  onCloseInspector,
  onEditMaterial,
  onViewActivities,
  onDownloadModule,
  onExportSyllabus,
  onCreateMaterial,
  isModuleDialogOpen,
  onOpenDialogChange,
  dialogMode = 'create',
  moduleDialogForm,
  moduleFormError,
  onModuleDialogFormChange,
  onSubmitModule,
  onCreateMaterialInModule,
  onPageChange,
  onRowsPerPageChange,
  selectedModuleIds = [],
  onToggleModuleSelection,
  onSelectAllModules,
  onDeselectAllModules,
  isExportDialogOpen = false,
  onExportDialogOpenChange,
  onExportSyllabusHtml,
  onExportSyllabusTxt,
  isExportingSyllabus = false,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* Top Page Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Modul Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Kelola modul dan materi bahan ajar Bahasa Indonesia untuk siswa.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={onExportSyllabus}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor Silabus</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDialogChange(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#134653] hover:bg-[#0B2D38] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Module Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <MaterialStatCards stats={stats} />

      {/* Modal Modul */}
      <MaterialCreateDialog
        open={isModuleDialogOpen}
        onOpenChange={onOpenDialogChange}
        mode={dialogMode}
        form={moduleDialogForm}
        onChange={onModuleDialogFormChange}
        error={moduleFormError}
        onSubmit={onSubmitModule}
      />

      {/* Export Syllabus Dialog */}
      {onExportDialogOpenChange && onExportSyllabusHtml && onExportSyllabusTxt && (
        <ExportSyllabusDialog
          open={isExportDialogOpen}
          onOpenChange={onExportDialogOpenChange}
          modules={modules}
          selectedModuleIds={selectedModuleIds}
          onToggleModule={onToggleModuleSelection ?? (() => {})}
          onSelectAll={onSelectAllModules ?? (() => {})}
          onDeselectAll={onDeselectAllModules ?? (() => {})}
          onExportHtml={onExportSyllabusHtml}
          onExportTxt={onExportSyllabusTxt}
          isExporting={isExportingSyllabus}
        />
      )}

      {/* Search & Filter Bar for Modules */}
      <MaterialFilterBar
        filters={filters}
        totalItems={totalItems}
        displayedCount={modules.length}
        onSearchChange={onSearchChange}
        onJenjangChange={onJenjangChange}
        onStatusChange={onStatusChange}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area: Table List Modules + Collapsible Inspector Panel */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Table Column: List Modul Pembelajaran */}
        <div
          className={`w-full transition-all duration-300 ${
            isInspectorOpen ? 'xl:flex-1 xl:min-w-0' : 'xl:w-full'
          }`}
        >
          {isPending ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <TableLoader label="Memuat data modul..." />
            </div>
          ) : (
            <MaterialDataTable
              modules={modules}
              selectedId={selectedModuleId}
              selectedModuleIds={selectedModuleIds}
              onToggleModuleSelection={onToggleModuleSelection}
              onSelectAllModules={onSelectAllModules}
              onDeselectAllModules={onDeselectAllModules}
              onSelectModule={onSelectModule}
              onNavigateModule={onNavigateModule}
              onEditModule={onEditModule}
              onDeleteModule={onDeleteModule}
              currentPage={filters.page}
              totalItems={totalItems}
              rowsPerPage={filters.perPage}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          )}
        </div>

        {/* Right Inspector Panel (Collapsible) */}
        {isInspectorOpen && (
          <div className="w-full xl:w-[480px] 2xl:w-[540px] xl:shrink-0 sticky top-6">
            <MaterialInspectorPanel
              viewMode={inspectorMode}
              selectedModule={selectedModule}
              moduleMaterials={moduleMaterials}
              material={selectedMaterial}
              onClose={onCloseInspector}
              onSelectMaterial={onSelectMaterial}
              onBackToMaterialsList={onBackToMaterialsList}
              onEdit={onEditMaterial}
              onViewActivities={onViewActivities}
              onDownload={onDownloadModule}
              onCreateMaterialInModule={onCreateMaterialInModule}
            />
          </div>
        )}
      </div>
    </div>
  );
};
