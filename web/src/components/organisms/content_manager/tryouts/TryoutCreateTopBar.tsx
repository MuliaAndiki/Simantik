import { Bookmark, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

export interface TryoutCreateTopBarProps {
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  isSubmitting?: boolean;
  onSaveDraft: () => void;
}

export const TryoutCreateTopBar: React.FC<TryoutCreateTopBarProps> = ({
  status,
  isSubmitting = false,
  onSaveDraft,
}) => {
  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/content_manager/tryouts" className="hover:text-cyan-800 transition">
          Paket Tryout
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">Kelola Butir Soal Adaptif</span>
      </nav>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kelola Paket Tryout Adaptif
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Setiap butir soal memiliki 5 varian tingkat kesulitan (Level C1–C5) untuk simulasi
            adaptif siswa.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50/80 border border-cyan-200/80 text-xs font-semibold text-cyan-800">
            <span className="w-2 h-2 rounded-full bg-cyan-600" />
            <span>
              Status:{' '}
              {status === 'PUBLISHED'
                ? 'Published'
                : status === 'UNPUBLISHED'
                  ? 'Unpublished'
                  : 'Draft'}
            </span>
          </div>

          {/* Action Button: Simpan Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TryoutCreateTopBar;
