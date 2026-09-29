import { Download, PlusCircle } from 'lucide-react';
import type React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  TryoutCreateDialog,
  TryoutDataTable,
  TryoutFilterBar,
  TryoutStatCards,
} from '@/components/organisms/content_manager/tryouts';
import type {
  TryoutDialogForm,
  TryoutFilterState,
  TryoutPackageItem,
  TryoutStats,
} from '@/types/ui/tryout-manager.types';

export interface TryoutListTemplateProps {
  stats: TryoutStats;
  tryouts: TryoutPackageItem[];
  filters: TryoutFilterState;
  totalItems: number;
  isRefreshing?: boolean;
  isPending: boolean;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  isDialogOpen: boolean;
  onOpenDialogChange: (open: boolean) => void;
  dialogMode: 'create' | 'edit';
  dialogForm: TryoutDialogForm;
  dialogError?: string | null;
  isSubmitting?: boolean;
  onDialogFormChange: <K extends keyof TryoutDialogForm>(
    field: K,
    value: TryoutDialogForm[K]
  ) => void;
  onSubmitDialog: () => Promise<void> | void;
  onEdit: (item: TryoutPackageItem) => void;
  onManageQuestions?: (item: TryoutPackageItem) => void;
  onViewResults?: (item: TryoutPackageItem) => void;
  onToggleStatus: (item: TryoutPackageItem) => void;
  onDelete: (item: TryoutPackageItem) => void;
  onExportSummary: () => void;
}

export const TryoutListTemplate: React.FC<TryoutListTemplateProps> = ({
  stats,
  tryouts,
  filters,
  totalItems,
  isRefreshing = false,
  isPending,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onRefresh,
  onPageChange,
  onRowsPerPageChange,
  isDialogOpen,
  onOpenDialogChange,
  dialogMode,
  dialogForm,
  dialogError,
  isSubmitting = false,
  onDialogFormChange,
  onSubmitDialog,
  onEdit,
  onManageQuestions,
  onViewResults,
  onToggleStatus,
  onDelete,
  onExportSummary,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Daftar Tryout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Kelola simulasi paket ujian berkala, integritas pengerjaan, kuota 150 butir soal, dan
            siklus penerbitan tryout SIMANTIK.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={onExportSummary}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor Hasil</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDialogChange(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#134653] hover:bg-[#0B2D38] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Tryout</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <TryoutStatCards stats={stats} />

      {/* Create / Edit Modal Dialog */}
      <TryoutCreateDialog
        open={isDialogOpen}
        onOpenChange={onOpenDialogChange}
        mode={dialogMode}
        form={dialogForm}
        onChange={onDialogFormChange}
        error={dialogError}
        onSubmit={onSubmitDialog}
        isSubmitting={isSubmitting}
      />

      {/* Filter & Search Bar */}
      <TryoutFilterBar
        filters={filters}
        totalItems={totalItems}
        displayedCount={tryouts.length}
        onSearchChange={onSearchChange}
        onJenjangChange={onJenjangChange}
        onStatusChange={onStatusChange}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Data Table */}
      {isPending ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <TableLoader label="Memuat data tryout..." />
        </div>
      ) : (
        <TryoutDataTable
          tryouts={tryouts}
          currentPage={filters.page}
          totalItems={totalItems}
          rowsPerPage={filters.perPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onEdit={onEdit}
          onManageQuestions={onManageQuestions}
          onViewResults={onViewResults}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default TryoutListTemplate;
