import React from 'react';
import type { ContentStatus } from '@/types/model';
import type { CreateDocumentationRequest } from '@/types/service';

const DOCS_STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

interface DocsCreateMetadataCardProps {
  form: CreateDocumentationRequest;
  isEditMode: boolean;
  onChange: <K extends keyof CreateDocumentationRequest>(
    field: K,
    value: CreateDocumentationRequest[K]
  ) => void;
}

export const DocsCreateMetadataCard: React.FC<DocsCreateMetadataCardProps> = ({
  form,
  isEditMode,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Judul Dokumen <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Contoh: Panduan Penggunaan Portal Siswa"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
        </div>

        <div className="lg:col-span-5 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Slug</label>
          <input
            type="text"
            value={form.slug ?? ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="Contoh: panduan-portal-siswa"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Kategori <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => onChange('category', e.target.value)}
            placeholder="Contoh: Panduan, Bantuan, Kebijakan"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
        </div>

        {isEditMode && (
          <div className="lg:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Status</label>
            <select
              value={form.status as string}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition cursor-pointer"
            >
              {DOCS_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsCreateMetadataCard;
