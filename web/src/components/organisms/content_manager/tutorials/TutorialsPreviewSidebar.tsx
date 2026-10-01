import { format } from 'date-fns';
import { Clock, ExternalLink, Pencil, X } from 'lucide-react';
import React from 'react';
import type { TutorialResponse } from '@/types/service';

function formatDuration(totalSeconds?: number | null): string {
  if (!totalSeconds || totalSeconds <= 0) return '-';
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} mnt`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} jam` : `${hours} jam ${rest} mnt`;
}

interface TutorialsPreviewSidebarProps {
  tutorial: TutorialResponse | null;
  onClose: () => void;
  onEdit: (tutorial: TutorialResponse) => void;
  onOpenFull: (tutorial: TutorialResponse) => void;
}

export const TutorialsPreviewSidebar: React.FC<TutorialsPreviewSidebarProps> = ({
  tutorial,
  onClose,
  onEdit,
  onOpenFull,
}) => {
  if (!tutorial) return null;

  return (
    <div className="w-full lg:w-96 shrink-0 bg-white border border-slate-200/80 shadow-2xs rounded-2xl flex flex-col h-[calc(100vh-8rem)] sticky top-24 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          {tutorial.status.toLowerCase() === 'published' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#334155] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Published
            </span>
          ) : tutorial.status.toLowerCase() === 'draft' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#78350F] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Draft
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Unpublished
            </span>
          )}
          <span className="text-xs font-bold text-slate-700">Pratinjau Video</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 uppercase tracking-wider mb-3">
          {tutorial.category || 'Umum'}
        </span>

        <h2 className="text-lg font-bold text-slate-800 leading-snug mb-3">{tutorial.title}</h2>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-4">
          <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-[8px] font-bold">
            {tutorial.created_by ? tutorial.created_by.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <span className="text-slate-700 font-semibold">{tutorial.created_by || 'Unknown'}</span>
          <span>•</span>
          <span>
            {tutorial.created_at
              ? format(new Date(tutorial.created_at), 'dd MMMM yyyy', { locale: undefined })
              : '-'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-6">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Durasi: {formatDuration(tutorial.duration_seconds)}</span>
        </div>

        <div className="bg-[#F0F9FF] rounded-xl p-4 border border-[#E0F2FE]">
          <h4 className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider mb-2">
            Deskripsi
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-[10]">
            {tutorial.description || 'Belum ada deskripsi'}
          </p>
        </div>

        <div className="flex gap-3 mt-5">
          <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Status</p>
            <p className="text-xs font-semibold text-slate-700">{tutorial.status}</p>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Dibuat Pada</p>
            <p className="text-xs font-semibold text-slate-700">
              {tutorial.created_at ? format(new Date(tutorial.created_at), 'dd/MM/yyyy') : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50/50">
        <button
          type="button"
          onClick={() => onEdit(tutorial)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
        >
          <Pencil className="w-4 h-4" />
          Edit Konten
        </button>
        <button
          type="button"
          onClick={() => onOpenFull(tutorial)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#334155] hover:bg-[#1E293B] transition shadow-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Buka Lengkap
        </button>
      </div>
    </div>
  );
};
