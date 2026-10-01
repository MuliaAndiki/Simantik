import { Plus } from 'lucide-react';
import React from 'react';
import { TableLoader } from '@/components/atoms/loading';
import {
  DocsDataTable,
  DocsFilterBar,
  DocsPreviewSidebar,
  DocsSummaryCards,
} from '@/components/organisms/content_manager/docs';
import type { DocumentationResponse } from '@/types/service';
import type { DocsFilterState, DocsStats } from '@/types/ui/content-manager';

export interface DocsTemplateProps {
  stats: DocsStats;
  docs: DocumentationResponse[];
  selectedDoc: DocumentationResponse | null;
  filters: DocsFilterState;
  categoryOptions: { value: string; label: string }[];
  totalItems: number;
  isPending: boolean;
  onAddDoc: () => void;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onSelectDoc: (doc: DocumentationResponse) => void;
  onEditDoc: (doc: DocumentationResponse) => void;
  onClosePreview: () => void;
  onOpenFull: (doc: DocumentationResponse) => void;
  onPageChange: (page: number) => void;
}

const DocsTemplate: React.FC<DocsTemplateProps> = ({
  stats,
  docs,
  selectedDoc,
  filters,
  categoryOptions,
  totalItems,
  isPending,
  onAddDoc,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onSelectDoc,
  onEditDoc,
  onClosePreview,
  onOpenFull,
  onPageChange,
}) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manajemen Dokumentasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola pusat bantuan dan dokumentasi panduan platform untuk siswa.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddDoc}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5B731] hover:bg-[#E5A820] text-white text-sm font-bold rounded-xl shadow-sm transition shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Tambah Dokumen
        </button>
      </div>

      <DocsSummaryCards stats={stats} />

      <div className="flex flex-col lg:flex-row gap-6 items-start relative">
        <div className="flex-1 w-full flex flex-col gap-4">
          <DocsFilterBar
            filters={filters}
            categoryOptions={categoryOptions}
            onSearchChange={onSearchChange}
            onStatusChange={onStatusChange}
            onCategoryChange={onCategoryChange}
          />

          {isPending ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <TableLoader label="Memuat data dokumentasi..." />
            </div>
          ) : (
            <DocsDataTable
              docs={docs}
              selectedId={selectedDoc?.id}
              onSelectDoc={onSelectDoc}
              onEditDoc={onEditDoc}
              currentPage={filters.page}
              totalItems={totalItems}
              rowsPerPage={filters.perPage}
              onPageChange={onPageChange}
            />
          )}
        </div>

        {selectedDoc && (
          <DocsPreviewSidebar
            doc={selectedDoc}
            onClose={onClosePreview}
            onEdit={onEditDoc}
            onOpenFull={onOpenFull}
          />
        )}
      </div>
    </div>
  );
};

export default DocsTemplate;
