import React from 'react';
import type { ContentStatus } from '@/types/model';

const TUTORIAL_STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export interface TutorialsCreateFormState {
  title: string;
  slug?: string;
  description?: string;
  youtube_url: string;
  duration_minutes: string;
  category: string;
  status?: ContentStatus | string;
}

interface TutorialsCreateMetadataCardProps {
  form: TutorialsCreateFormState;
  isEditMode: boolean;
  onChange: <K extends keyof TutorialsCreateFormState>(
    field: K,
    value: TutorialsCreateFormState[K]
  ) => void;
}

// ponytail: duplikasi toEmbedUrl kecil juga ada di TutorialDetailContainer; pindah ke util bila dipakai di >2 tempat
function toEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  const watch = url.match(/[?&]v=([\w-]{6,})/);
  if (url.includes('youtube.com/watch') && watch) {
    return `https://www.youtube.com/embed/${watch[1]}`;
  }
  const short = url.match(/youtu\.be\/([\w-]{6,})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const shorts = url.match(/youtube\.com\/shorts\/([\w-]{6,})/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
  const embed = url.match(/youtube\.com\/embed\/([\w-]+)/);
  if (embed) return `https://www.youtube.com/embed/${embed[1]}`;
  return null;
}

const inputClass =
  'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition';

export const TutorialsCreateMetadataCard: React.FC<TutorialsCreateMetadataCardProps> = ({
  form,
  isEditMode,
  onChange,
}) => {
  const embedUrl = toEmbedUrl(form.youtube_url ?? '');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Judul Video <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Contoh: Pengenalan Portal Siswa"
            className={inputClass}
          />
        </div>

        <div className="lg:col-span-5 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Slug</label>
          <input
            type="text"
            value={form.slug ?? ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="Contoh: pengenalan-portal-siswa"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          URL YouTube <span className="text-rose-500">*</span>
        </label>
        <input
          type="url"
          value={form.youtube_url}
          onChange={(e) => onChange('youtube_url', e.target.value)}
          placeholder="Contoh: https://www.youtube.com/watch?v=xxxx"
          className={inputClass}
        />
        {embedUrl ? (
          <div className="pt-1">
            <div className="aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
              <iframe
                src={embedUrl}
                title="Pratinjau video"
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          </div>
        ) : form.youtube_url.trim() ? (
          <p className="text-xs text-rose-500 font-medium">
            URL YouTube tidak valid. Gunakan format youtube.com/watch?v=, youtu.be/, /embed/ atau
            /shorts/.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-4 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Durasi (menit)</label>
          <input
            type="number"
            min="0"
            value={form.duration_minutes}
            onChange={(e) => onChange('duration_minutes', e.target.value)}
            placeholder="Contoh: 12"
            className={inputClass}
          />
        </div>

        <div className="lg:col-span-4 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Kategori <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => onChange('category', e.target.value)}
            placeholder="Contoh: Panduan, Bantuan"
            className={inputClass}
          />
        </div>

        {isEditMode && (
          <div className="lg:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Status</label>
            <select
              value={form.status as string}
              onChange={(e) => onChange('status', e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {TUTORIAL_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">Deskripsi</label>
        <textarea
          value={form.description ?? ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Ringkasan singkat isi video..."
          rows={4}
          className={`${inputClass} resize-y min-h-[96px]`}
        />
      </div>
    </div>
  );
};

export default TutorialsCreateMetadataCard;
