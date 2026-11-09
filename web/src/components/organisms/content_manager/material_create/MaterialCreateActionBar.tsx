import { Bookmark, Send } from 'lucide-react';
import React from 'react';
import { Spinner } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface MaterialCreateActionBarProps {
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onSubmitReview?: () => void;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
  className?: string;
}

export const MaterialCreateActionBar: React.FC<MaterialCreateActionBarProps> = ({
  onCancel,
  onSaveDraft,
  onSubmitReview,
  isSubmitting = false,
  isSavingDraft = false,
  className,
}) => {
  const isBusy = isSubmitting || isSavingDraft;

  return (
    <div
      className={cn(
        'w-full bg-white/95 backdrop-blur-md border border-slate-100/90 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 select-none',
        className
      )}
    >
      {/* Left: Batal Button */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isBusy}
        className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer disabled:opacity-50"
      >
        Batal
      </button>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Simpan Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isBusy}
          className="px-5 py-2.5 bg-[#EBF5FE] hover:bg-[#DDF0FD] text-sky-700 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          {isBusy ? <Spinner size="xs" /> : <Bookmark className="w-4 h-4" />}
          <span>{isBusy ? 'Menyimpan...' : 'Simpan Draft'}</span>
        </button>
      </div>
    </div>
  );
};

export default MaterialCreateActionBar;
