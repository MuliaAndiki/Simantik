import { Image as ImageIcon, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Spinner } from '@/components/atoms';
import type { ContentStatus } from '@/types/model';
import type { CreateNewsRequest } from '@/types/service';

const NEWS_STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

interface NewsCreateMetadataCardProps {
  form: CreateNewsRequest;
  isEditMode: boolean;
  onChange: <K extends keyof CreateNewsRequest>(field: K, value: CreateNewsRequest[K]) => void;
  onUploadThumbnail: (file: File) => Promise<string>;
}

export const NewsCreateMetadataCard: React.FC<NewsCreateMetadataCardProps> = ({
  form,
  isEditMode,
  onChange,
  onUploadThumbnail,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingThumbnail(true);
      const url = await onUploadThumbnail(file);
      onChange('thumbnailUrl', url);
    } finally {
      setIsUploadingThumbnail(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Judul */}
        <div className="lg:col-span-7 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Judul News <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Contoh: Pengumuman Jadwal Simulasi 2026"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
        </div>

        {/* Slug */}
        <div className="lg:col-span-5 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Slug</label>
          <input
            type="text"
            value={form.slug ?? ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="Contoh: jadwal-simulasi-2026"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Thumbnail */}
        <div className="lg:col-span-7 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Thumbnail</label>
          <div className="flex items-start gap-4">
            <div className="w-40 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
              {form.thumbnailUrl ? (
                // biome-ignore lint/performance/noImgElement: intentional for external CMS image
                <img
                  src={form.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingThumbnail}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                {isUploadingThumbnail ? <Spinner size="xs" /> : <Upload className="w-4 h-4" />}
                <span>{isUploadingThumbnail ? 'Mengunggah...' : 'Pilih Gambar'}</span>
              </button>
              <p className="text-[11px] text-slate-400">Format JPG, PNG, atau WEBP</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Status */}
        {isEditMode && (
          <div className="lg:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Status</label>
            <select
              value={form.status as string}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition cursor-pointer"
            >
              {NEWS_STATUS_OPTIONS.map((status) => (
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

export default NewsCreateMetadataCard;
