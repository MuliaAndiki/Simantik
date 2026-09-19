import { CheckCircle2, LayoutGrid, Plus, Trash2 } from 'lucide-react';
import type React from 'react';
import { QuestionEditor } from '@/components/molecules/editor';
import type { QuestionChoiceOptionForm } from '@/types/ui/practice-question-editor.types';

export interface PracticeOptionMultipleChoiceSectionProps {
  options: QuestionChoiceOptionForm[];
  correctOptionLabel: string;
  onOptionTextChange: (index: number, text: string) => void;
  onOptionSublabelChange?: (index: number, sublabel: string) => void;
  onSelectCorrectOption: (label: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
}

export const PracticeOptionMultipleChoiceSection: React.FC<
  PracticeOptionMultipleChoiceSectionProps
> = ({
  options,
  correctOptionLabel,
  onOptionTextChange,
  onSelectCorrectOption,
  onAddOption,
  onRemoveOption,
  onUploadImage,
  onDeleteImage,
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION 3: PILIHAN JAWABAN */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-slate-600" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">
            Section 3: Pilihan Jawaban (Mini Rich Text Editor A -{' '}
            {options[options.length - 1]?.label || 'D'})
          </h3>
        </div>

        <div className="space-y-3">
          {options.map((opt, idx) => {
            return (
              <div
                key={opt.id || opt.label}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 sm:p-4 space-y-2.5 transition focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20"
              >
                {/* Option Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center">
                      {opt.label}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Pilihan {opt.label}
                      {opt.sublabel ? ` (${opt.sublabel})` : ''}
                    </span>
                  </div>

                  {options.length > 4 && (
                    <button
                      type="button"
                      onClick={() => onRemoveOption(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus Opsi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Option Input */}
                <QuestionEditor
                  value={opt.text}
                  onChange={(val) => onOptionTextChange(idx, val)}
                  onUploadImage={onUploadImage}
                  onDeleteImage={onDeleteImage}
                  placeholder={`Tuliskan teks untuk pilihan jawaban ${opt.label}...`}
                  minHeight="min-h-[60px]"
                />
              </div>
            );
          })}

          {/* Add Option Button */}
          {options.length < 5 && (
            <button
              type="button"
              onClick={onAddOption}
              className="w-full py-2.5 rounded-xl border border-dashed border-cyan-300 hover:border-cyan-600 bg-cyan-50/50 hover:bg-cyan-50 text-cyan-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Opsi Pilihan ({String.fromCharCode(65 + options.length)})</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 4: KUNCI JAWABAN VALID */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0E7490]" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Section 4: Kunci Jawaban Valid
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Tetapkan satu pilihan sebagai kunci jawaban benar
          </p>
        </div>

        {/* Radio Option Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {options.map((opt) => {
            const isCorrect = correctOptionLabel === opt.label;

            return (
              <button
                key={opt.id || opt.label}
                type="button"
                onClick={() => onSelectCorrectOption(opt.label)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                  isCorrect
                    ? 'border-[#0E7490] bg-[#F2FAF9] ring-2 ring-[#0E7490]/20 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isCorrect ? 'border-[#0E7490] bg-[#0E7490]' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isCorrect && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    Pilihan {opt.label}
                  </span>
                </div>

                {isCorrect && (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0E7490] text-white">
                    KUNCI BENAR
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PracticeOptionMultipleChoiceSection;
