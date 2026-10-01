import { format } from 'date-fns';
import { ExternalLink, Pencil, X } from 'lucide-react';
import React from 'react';
import type { DocumentationResponse } from '@/types/service';

interface DocsPreviewSidebarProps {
  doc: DocumentationResponse | null;
  onClose: () => void;
  onEdit: (doc: DocumentationResponse) => void;
  onOpenFull: (doc: DocumentationResponse) => void;
}

export const DocsPreviewSidebar: React.FC<DocsPreviewSidebarProps> = ({
  doc,
  onClose,
  onEdit,
  onOpenFull,
}) => {
  if (!doc) return null;

  return (
    <div className="w-full lg:w-96 shrink-0 bg-white border border-slate-200/80 shadow-2xs rounded-2xl flex flex-col h-[calc(100vh-8rem)] sticky top-24 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          {doc.status.toLowerCase() === 'published' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#334155] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Published
            </span>
          ) : doc.status.toLowerCase() === 'draft' ? (
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
          <span className="text-xs font-bold text-slate-700">Pratinjau Dokumen</span>
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
          {doc.category || 'Umum'}
        </span>

        <h2 className="text-lg font-bold text-slate-800 leading-snug mb-3">{doc.title}</h2>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-6">
          <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-[8px] font-bold">
            {doc.createdBy ? doc.createdBy.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <span className="text-slate-700 font-semibold">{doc.createdBy || 'Unknown'}</span>
          <span>•</span>
          <span>
            {doc.createdAt
              ? format(new Date(doc.createdAt), 'dd MMMM yyyy', { locale: undefined })
              : '-'}
          </span>
        </div>

        <div className="bg-[#F0F9FF] rounded-xl p-4 border border-[#E0F2FE]">
          <h4 className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider mb-2">
            Isi Dokumen
          </h4>
          <div
            className="text-xs text-slate-600 leading-relaxed prose prose-sm prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 line-clamp-[10]"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional for CMS content
            dangerouslySetInnerHTML={{ __html: doc.content || '<em>Belum ada konten</em>' }}
          />
        </div>

        <div className="flex gap-3 mt-5">
          <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Status</p>
            <p className="text-xs font-semibold text-slate-700">{doc.status}</p>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Dibuat Pada</p>
            <p className="text-xs font-semibold text-slate-700">
              {doc.createdAt ? format(new Date(doc.createdAt), 'dd/MM/yyyy') : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50/50">
        <button
          type="button"
          onClick={() => onEdit(doc)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
        >
          <Pencil className="w-4 h-4" />
          Edit Konten
        </button>
        <button
          type="button"
          onClick={() => onOpenFull(doc)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#334155] hover:bg-[#1E293B] transition shadow-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Buka Lengkap
        </button>
      </div>
    </div>
  );
};
