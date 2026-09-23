import { Bookmark, Loader2, Send } from 'lucide-react';
import React from 'react';

interface NewsCreateActionBarProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

export const NewsCreateActionBar: React.FC<NewsCreateActionBarProps> = ({
  onCancel,
  onSaveDraft,
  onPublish,
  isSubmitting,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border border-slate-100/90 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 select-none">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer disabled:opacity-50"
      >
        Batal
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-[#EBF5FE] hover:bg-[#DDF0FD] text-sky-700 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          <Bookmark className="w-4 h-4" />
          <span>Simpan Draft</span>
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#F5B731] hover:bg-[#E5A820] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Terbitkan</span>
        </button>
      </div>
    </div>
  );
};

export default NewsCreateActionBar;
