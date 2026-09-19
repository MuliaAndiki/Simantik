import { BookOpen, Plus, Trash2 } from 'lucide-react';
import type React from 'react';
import { RichTextEditor } from '@/components/molecules/editor';
import type { QuestionStimulusForm } from '@/types/ui/practice-question-editor.types';

export interface PracticeStimulusSectionProps {
  stimulus: QuestionStimulusForm;
  onStimulusChange: <K extends keyof QuestionStimulusForm>(
    field: K,
    value: QuestionStimulusForm[K]
  ) => void;
  onToggleStimulus: (hasStimulus: boolean) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
}

export const PracticeStimulusSection: React.FC<PracticeStimulusSectionProps> = ({
  stimulus,
  onStimulusChange,
  onToggleStimulus,
  onUploadImage,
  onDeleteImage,
}) => {
  if (!stimulus.hasStimulus) {
    return (
      <div className="bg-[#F2FAF9] border border-dashed border-cyan-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Stimulus Wacana (Opsional)
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Tambahkan teks wacana bacaan, dialog, atau konteks stimulus
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleStimulus(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-cyan-300 hover:border-cyan-600 text-cyan-900 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-cyan-700 stroke-[2.5]" />
          <span>Tambah Stimulus Wacana</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F2FAF9] border border-cyan-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-cyan-800" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
            Stimulus Wacana
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onToggleStimulus(false)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Stimulus</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Judul Stimulus */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">
            Judul Wacana / Teks (Opsional)
          </label>
          <input
            type="text"
            value={stimulus.title}
            onChange={(e) => onStimulusChange('title', e.target.value)}
            placeholder="Contoh: Konservasi Ekosistem Lahan Basah Nusantara"
            className="w-full px-3.5 py-2 bg-white border border-cyan-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-cyan-600"
          />
        </div>

        {/* Konten Wacana dengan RichTextEditor */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700">
            Isi Teks Wacana Bacaan <span className="text-rose-500">*</span>
          </label>
          <div className="bg-white rounded-2xl border border-cyan-200 overflow-hidden shadow-2xs">
            <RichTextEditor
              value={stimulus.content}
              onChange={(val) => onStimulusChange('content', val)}
              onUploadImage={onUploadImage}
              onDeleteImage={onDeleteImage}
            />
          </div>
        </div>

        {/* Sumber Rujukan */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">
            Sumber / Referensi Wacana (Opsional)
          </label>
          <input
            type="text"
            value={stimulus.source}
            onChange={(e) => onStimulusChange('source', e.target.value)}
            placeholder="Contoh: Disadur dari Jurnal Sains Terapan & Bahasa, 2026"
            className="w-full px-3.5 py-2 bg-white border border-cyan-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-cyan-600"
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeStimulusSection;
