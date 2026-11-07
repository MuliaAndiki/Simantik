'use client';

import {
  BookOpen,
  Check,
  CheckSquare,
  Download,
  FileText,
  Printer,
  Search,
  Square,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms';
import { JenjangBadge, StatusPill, type StatusPillTone } from '@/components/molecules/table';
import type { MaterialStatusType, ModuleItem } from '@/types/ui/material-manager.types';
import { cn } from '@/utils/classname';

export interface ExportSyllabusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: ModuleItem[];
  selectedModuleIds: string[];
  onToggleModule: (moduleId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onExportHtml: () => Promise<void> | void;
  onExportTxt: () => Promise<void> | void;
  isExporting?: boolean;
}

const MATERIAL_STATUS_TONES: Record<string, StatusPillTone & { label: string }> = {
  PUBLISHED: {
    pill: 'bg-[#E8F8F3] text-[#059669]',
    dot: 'bg-[#10B981]',
    label: 'Published',
  },
  IN_REVIEW: {
    pill: 'bg-[#FEF7EB] text-[#D97706]',
    dot: 'bg-[#F5B731]',
    label: 'In Review',
  },
  DRAFT: {
    pill: 'bg-[#F1F5F9] text-[#64748B]',
    dot: 'bg-[#94A3B8]',
    label: 'Draft',
  },
};

export const ExportSyllabusDialog: React.FC<ExportSyllabusDialogProps> = ({
  open,
  onOpenChange,
  modules,
  selectedModuleIds,
  onToggleModule,
  onSelectAll,
  onDeselectAll,
  onExportHtml,
  onExportTxt,
  isExporting = false,
}) => {
  const [search, setSearch] = useState('');

  const filteredModules = useMemo(() => {
    if (!search.trim()) return modules;
    const q = search.toLowerCase();
    return modules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.label?.toLowerCase().includes(q)
    );
  }, [modules, search]);

  const selectedCount = selectedModuleIds.length;
  const isAllSelected = modules.length > 0 && selectedCount === modules.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full rounded-3xl p-6 sm:p-7 bg-white border border-slate-100 shadow-2xl flex flex-col gap-0 max-h-[calc(100dvh-3rem)] overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="size-12 rounded-2xl bg-[#EAF6F8] text-[#0E7490] flex items-center justify-center border border-cyan-100/60 shadow-2xs shrink-0">
            <BookOpen className="size-6 text-[#0E7490]" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Ekspor Silabus Pembelajaran
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">
              Pilih modul pembelajaran yang ingin dimasukkan ke dalam dokumen silabus resmi.
            </DialogDescription>
          </div>
        </div>

        {/* Search & Selection Toolbar */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl mb-3 space-y-2.5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul modul..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium text-slate-800"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={isAllSelected ? onDeselectAll : onSelectAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
              >
                {isAllSelected ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-teal-700" />
                    <span>Batal Pilih Semua</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pilih Semua ({modules.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 font-medium">
              Menampilkan {filteredModules.length} dari {modules.length} modul
            </span>
            <span className="font-bold text-teal-800">{selectedCount} modul terpilih</span>
          </div>
        </div>

        {/* Modules List with Checkboxes */}
        <div className="flex-1 overflow-y-auto max-h-[300px] sm:max-h-[340px] pr-1 space-y-2 custom-scrollbar">
          {filteredModules.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              Tidak ada modul yang cocok dengan pencarian "{search}".
            </div>
          ) : (
            filteredModules.map((item) => {
              const isChecked = selectedModuleIds.includes(item.id);
              const tone = MATERIAL_STATUS_TONES[item.status];

              return (
                <label
                  key={item.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-2xl border transition cursor-pointer select-none',
                    isChecked
                      ? 'bg-[#EAF6F8]/80 border-teal-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50/70'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleModule(item.id)}
                    className="size-4.5 rounded text-teal-800 focus:ring-teal-700 border-slate-300 accent-[#0E7490] cursor-pointer shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 truncate">
                        {item.title}
                      </span>
                      <JenjangBadge value={item.jenjang} />
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                      {item.materialsCount} Bahan Ajar • Diperbarui: {item.updatedAt}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {tone && <StatusPill label={tone.label} tone={tone} />}
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-11 px-5 rounded-xl border-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer"
          >
            Batal
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              disabled={selectedCount === 0 || isExporting}
              onClick={onExportTxt}
              className="flex-1 sm:flex-none h-11 px-4 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Format Ringkas (.txt)</span>
            </Button>

            <Button
              type="button"
              disabled={selectedCount === 0 || isExporting}
              onClick={onExportHtml}
              className="flex-1 sm:flex-none h-11 px-5 rounded-xl bg-[#134653] hover:bg-[#0B2D38] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Unduh Silabus Lengkap ({selectedCount})</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportSyllabusDialog;
