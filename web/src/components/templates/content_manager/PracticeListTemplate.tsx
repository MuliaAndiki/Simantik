import { Download, PlusCircle } from 'lucide-react';
import type React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  PracticeCreateDialog,
  PracticeDataTable,
  type PracticeManagerCompetencyOption,
  PracticeManagerFilterBar,
  PracticeStatCards,
} from '@/components/organisms/content_manager/practice';
import type {
  PracticeDialogForm,
  PracticeFilterState,
  PracticePackageItem,
  PracticeStats,
} from '@/types/ui/practice-manager.types';

export interface PracticeListTemplateProps {
  stats: PracticeStats;
  packages: PracticePackageItem[];
  competencies: PracticeManagerCompetencyOption[];

  filters: PracticeFilterState;
  totalItems: number;
  isRefreshing?: boolean;
  isPending: boolean;
  onSearchChange: (val: string) => void;
  onJenjangChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCompetencyChange: (val: string) => void;
  onQuotaChange: (val: string) => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  isDialogOpen: boolean;
  onOpenDialogChange: (open: boolean) => void;
  dialogMode: 'create' | 'edit';
  dialogForm: PracticeDialogForm;
  dialogError?: string | null;
  isSubmitting?: boolean;
  onDialogFormChange: <K extends keyof PracticeDialogForm>(
    field: K,
    value: PracticeDialogForm[K]
  ) => void;
  onSubmitDialog: () => Promise<void> | void;
  onEdit: (item: PracticePackageItem) => void;
  onToggleStatus: (item: PracticePackageItem) => void;
  onDelete: (item: PracticePackageItem) => void;
  onExportSummary: () => void;
  onCreatePractice?: () => void;
  onManageQuestions?: (item: PracticePackageItem) => void;
  onViewResults?: (item: PracticePackageItem) => void;
}

export const PracticeListTemplate: React.FC<PracticeListTemplateProps> = ({
  stats,
  packages,
  competencies,
  filters,
  totalItems,
  isRefreshing = false,
  isPending,
  onSearchChange,
  onJenjangChange,
  onStatusChange,
  onCompetencyChange,
  onQuotaChange,
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
  onToggleStatus,
  onDelete,
  onExportSummary,
  onCreatePractice,
  onManageQuestions,
  onViewResults,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Paket Latihan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Kelola, susun, publikasikan, dan pantau status paket latihan berkala untuk persiapan
            siswa.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={onExportSummary}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor Ringkasan</span>
          </button>

          <button
            type="button"
            onClick={onCreatePractice ? onCreatePractice : () => onOpenDialogChange(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#134653] hover:bg-[#0B2D38] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Paket Latihan</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <PracticeStatCards stats={stats} />

      {/* Create / Edit Modal Dialog */}
      <PracticeCreateDialog
        open={isDialogOpen}
        onOpenChange={onOpenDialogChange}
        mode={dialogMode}
        form={dialogForm}
        competencies={competencies}
        onChange={onDialogFormChange}
        error={dialogError}
        onSubmit={onSubmitDialog}
        isSubmitting={isSubmitting}
      />

      {/* Filter & Search Bar */}
      <PracticeManagerFilterBar
        filters={filters}
        competencies={competencies}
        onSearchChange={onSearchChange}
        onJenjangChange={onJenjangChange}
        onStatusChange={onStatusChange}
        onCompetencyChange={onCompetencyChange}
        onQuotaChange={onQuotaChange}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Data Table */}
      {isPending ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <TableLoader label="Memuat data paket latihan..." />
        </div>
      ) : (
        <PracticeDataTable
          packages={packages}
          currentPage={filters.page}
          totalItems={totalItems}
          rowsPerPage={filters.perPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onManageQuestions={onManageQuestions}
          onViewResults={onViewResults}
        />
      )}
    </div>
  );
};

export default PracticeListTemplate;
