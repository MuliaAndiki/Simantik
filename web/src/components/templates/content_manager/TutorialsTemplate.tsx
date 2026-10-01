import { Plus } from 'lucide-react';
import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  TutorialsDataTable,
  TutorialsFilterBar,
  TutorialsPreviewSidebar,
  TutorialsSummaryCards,
} from '@/components/organisms/content_manager/tutorials';
import type { TutorialResponse } from '@/types/service';
import type { TutorialFilterState, TutorialStats } from '@/types/ui/content-manager';

export interface TutorialsTemplateProps {
  stats: TutorialStats;
  tutorials: TutorialResponse[];
  selectedTutorial: TutorialResponse | null;
  filters: TutorialFilterState;
  categoryOptions: { value: string; label: string }[];
  totalItems: number;
  isPending: boolean;
  onAddTutorial: () => void;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onSelectTutorial: (tutorial: TutorialResponse) => void;
  onEditTutorial: (tutorial: TutorialResponse) => void;
  onClosePreview: () => void;
  onOpenFull: (tutorial: TutorialResponse) => void;
  onPageChange: (page: number) => void;
}

const TutorialsTemplate: React.FC<TutorialsTemplateProps> = ({
  stats,
  tutorials,
  selectedTutorial,
  filters,
  categoryOptions,
  totalItems,
  isPending,
  onAddTutorial,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onSelectTutorial,
  onEditTutorial,
  onClosePreview,
  onOpenFull,
  onPageChange,
}) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Tutorial</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola video pembelajaran YouTube untuk siswa.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddTutorial}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5B731] hover:bg-[#E5A820] text-white text-sm font-bold rounded-xl shadow-sm transition shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Tambah Video
        </button>
      </div>

      <TutorialsSummaryCards stats={stats} />

      <div className="flex flex-col lg:flex-row gap-6 items-start relative">
        <div className="flex-1 w-full flex flex-col gap-4">
          <TutorialsFilterBar
            filters={filters}
            categoryOptions={categoryOptions}
            onSearchChange={onSearchChange}
            onStatusChange={onStatusChange}
            onCategoryChange={onCategoryChange}
          />

          {isPending ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <TableLoader label="Memuat data tutorial..." />
            </div>
          ) : (
            <TutorialsDataTable
              tutorials={tutorials}
              selectedId={selectedTutorial?.id}
              onSelectTutorial={onSelectTutorial}
              onEditTutorial={onEditTutorial}
              currentPage={filters.page}
              totalItems={totalItems}
              rowsPerPage={filters.perPage}
              onPageChange={onPageChange}
            />
          )}
        </div>

        {selectedTutorial && (
          <TutorialsPreviewSidebar
            tutorial={selectedTutorial}
            onClose={onClosePreview}
            onEdit={onEditTutorial}
            onOpenFull={onOpenFull}
          />
        )}
      </div>
    </div>
  );
};

export default TutorialsTemplate;
