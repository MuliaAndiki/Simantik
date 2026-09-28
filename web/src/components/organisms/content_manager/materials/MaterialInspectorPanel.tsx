import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  Lightbulb,
  Pencil,
  Plus,
  Target,
  Users,
  X,
} from 'lucide-react';
import React from 'react';
import type {
  InspectorViewMode,
  MaterialItem,
  MaterialStatusType,
  ModuleItem,
} from '@/types/ui/material-manager.types';

interface MaterialInspectorPanelProps {
  viewMode?: InspectorViewMode;
  selectedModule: ModuleItem | null;
  moduleMaterials: MaterialItem[];
  material: MaterialItem | null;
  onClose: () => void;
  onSelectMaterial: (material: MaterialItem) => void;
  onBackToMaterialsList: () => void;
  onEdit: (material: MaterialItem) => void;
  onDownload: (material: MaterialItem) => void;
  onViewActivities?: (material: MaterialItem) => void;
  onCreateMaterialInModule?: (moduleId: string) => void;
}

export const MaterialInspectorPanel: React.FC<MaterialInspectorPanelProps> = ({
  viewMode = 'module_materials',
  selectedModule,
  moduleMaterials,
  material,
  onClose,
  onSelectMaterial,
  onBackToMaterialsList,
  onEdit,
  onDownload,
  onViewActivities,
  onCreateMaterialInModule,
}) => {
  const renderStatusBadge = (status: MaterialStatusType) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F8F3] text-[#059669]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Published
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF7EB] text-[#D97706]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B731]" />
            In Review
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW 1: List Material-Material dari Modul yang Dipilih
  // ───────────────────────────────────────────────────────────────────────────
  if (viewMode === 'module_materials' || !material) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col h-full">
        {/* Top Breadcrumb & Close Button */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-medium text-slate-400 truncate max-w-[320px]">
            <span onClickCapture={onClose} className="text-slate-500 cursor-pointer">
              Modul
            </span>
            <span className="mx-1.5">›</span>
            <span className="text-slate-800 font-semibold truncate">
              {selectedModule?.title || 'Daftar Materi Modul'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer shrink-0"
            title="Tutup Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body: Materials List */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Module Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#134653] to-[#0A2932] text-white space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-200">
                Unit Modul Pembelajaran
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                {moduleMaterials.length} Materi Terdaftar
              </span>
            </div>
            <h2 className="text-base font-bold leading-snug">
              {selectedModule?.title || 'Modul Pembelajaran'}
            </h2>
            <p className="text-xs text-white/80 line-clamp-2">
              {selectedModule?.description || 'Bahan ajar terstruktur untuk siswa'}
            </p>

            {selectedModule && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onCreateMaterialInModule?.(selectedModule.id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-[#134653] text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Materi ke Modul Ini</span>
                </button>
              </div>
            )}
          </div>

          {/* List of Material Items */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Bahan Ajar dalam Modul:
              </h3>
              <span className="text-xs font-medium text-slate-400">Pilih untuk melihat detail</span>
            </div>

            {moduleMaterials.length === 0 ? (
              <div className="py-10 px-4 rounded-xl border border-dashed border-slate-200 text-center space-y-2 bg-slate-50/50">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  Belum Ada Materi di Modul Ini
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Modul ini belum memiliki bahan ajar terlampir. Tambahkan materi pertama sekarang.
                </p>
              </div>
            ) : (
              moduleMaterials.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onSelectMaterial(item)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200/80 hover:border-[#0E7490]/60 bg-white hover:bg-[#F4FBFA] transition-all cursor-pointer shadow-2xs group flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {item.code}
                      </span>
                      {renderStatusBadge(item.status)}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#0E7490] transition leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {item.category} • Diperbarui {item.updatedAt}
                    </p>
                  </div>

                  <div className="self-center p-1 rounded-lg text-slate-400 group-hover:text-[#0E7490] group-hover:bg-cyan-50 transition shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW 2: Detail Inspector Materi (Preview Dokumen & Edit)
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Top Header: Back to Module Materials & Close */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="text-xs font-medium text-slate-400 truncate max-w-[320px]">
          <span className="text-slate-500">Modul</span>
          <span className="mx-1.5">›</span>
          <span
            role="button"
            tabIndex={0}
            onClick={onBackToMaterialsList}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onBackToMaterialsList();
              }
            }}
            className="cursor-pointer text-slate-800 font-semibold truncate"
          >
            {selectedModule?.title || 'Daftar Materi Modul'}
          </span>
          <span className="mx-1.5">›</span>
          <span className="text-slate-800 font-semibold truncate">
            {material?.title || 'Detail Materi'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          title="Tutup Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="p-5 space-y-6 overflow-y-auto flex-1">
        {/* Material Header & Action */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-[#EAF6F8] text-[#0E7490] text-xs font-bold uppercase tracking-wider">
                {material.category}
              </span>
              {renderStatusBadge(material.status)}
            </div>

            <div className="flex items-center gap-2">
              {onViewActivities && (
                <button
                  type="button"
                  onClick={() => onViewActivities(material)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-[#0E7490] border border-cyan-200/80 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                  title="Lihat Laporan Siswa"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Aktivitas Siswa</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onEdit(material)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#134653] hover:bg-[#0B2D38] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Materi</span>
              </button>
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {material.title}
          </h2>

          <p className="text-xs font-medium text-slate-400">
            ID: {material.code} • Modul Ajar {material.fase}
          </p>
        </div>

        {/* 1. Tujuan Pembelajaran */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Tujuan Pembelajaran
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {material.learningObjectives.length} Butir Capaian
            </span>
          </div>

          <div className="space-y-2">
            {material.learningObjectives.map((obj) => (
              <div
                key={obj.id}
                className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {obj.id}
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">{obj.title} </strong>
                  {obj.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Pratinjau Dokumen Bahan Bacaan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Pratinjau Dokumen
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onDownload(material)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E7490] hover:text-cyan-800 transition cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Unduh Modul</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/90 bg-[#FAFDFE] space-y-3.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-100 pb-2">
              <span className="text-cyan-700 font-bold">
                {material.previewDocument.categoryBadge}
              </span>
              <span>{material.previewDocument.chapterInfo}</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {material.previewDocument.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              {material.previewDocument.contentParagraph}
            </p>

            <div className="space-y-1.5 pt-1 border-t border-slate-100/80">
              <p className="text-xs font-bold text-slate-800">
                {material.previewDocument.structureTitle}
              </p>
              <ul className="space-y-1">
                {material.previewDocument.structureItems.map((st) => (
                  <li key={st.label} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-700 mt-1.5 shrink-0" />
                    <span>
                      <strong className="text-slate-700 font-semibold">{st.label} </strong>
                      {st.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Informasi Audit & Versi */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Dibuat Oleh:</span>
            <span className="font-semibold text-slate-700">{material.auditInfo.createdByName}</span>
          </div>
          <div className="flex justify-between">
            <span>Terakhir Diperbarui:</span>
            <span className="font-semibold text-slate-700">{material.auditInfo.lastUpdated}</span>
          </div>
          <div className="flex justify-between">
            <span>Versi Dokumen:</span>
            <span className="font-semibold text-slate-700">
              {material.auditInfo.documentVersion}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
