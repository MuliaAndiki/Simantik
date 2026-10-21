import { BookOpenText } from 'lucide-react';
import type React from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import type { StimulusData } from '@/types/ui';
import { cn } from '@/utils/classname';
import { formatQuestionNumbers } from '@/utils/stimulus.util';
import { isHtml } from '@/utils/wacana';

export interface StimulusRereadCardProps {
  stimulus?: StimulusData | null;
  questionNumber?: number;
  relatedQuestionNumbers?: number[];
  className?: string;
}

function stimulusHtml(stimulus: StimulusData): string {
  if (typeof stimulus.content === 'string') return stimulus.content;
  if (Array.isArray(stimulus.content)) return stimulus.content.join('');
  return stimulus.quote ?? '';
}

/**
 * Kartu baca-ulang stimulus di bawah palet daftar soal.
 * Menampilkan rujukan bacaan bersama secara ringkas agar siswa
 * dapat membaca ulang teks tanpa perlu menggulir atau berpindah soal.
 */
export const StimulusRereadCard: React.FC<StimulusRereadCardProps> = ({
  stimulus,
  questionNumber,
  relatedQuestionNumbers,
  className,
}) => {
  if (!stimulus) return null;
  const html = stimulusHtml(stimulus);
  if (!html) return null;

  const numbers =
    relatedQuestionNumbers && relatedQuestionNumbers.length > 0
      ? relatedQuestionNumbers
      : stimulus.relatedQuestionNumbers && stimulus.relatedQuestionNumbers.length > 0
        ? stimulus.relatedQuestionNumbers
        : typeof questionNumber === 'number'
          ? [questionNumber]
          : [];

  const { shortRange, isMultiple } = formatQuestionNumbers(numbers);

  const label = isMultiple ? 'Bacaan Bersama' : 'Bacaan Soal';
  const rangeText = shortRange ? ` • Soal No. ${shortRange}` : '';

  return (
    <aside
      aria-label="Panel bacaan bersama"
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpenText className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 truncate">
            {label}
            <span className="text-teal-700 font-bold">{rangeText}</span>
          </span>
        </div>
      </div>

      {stimulus.title ? (
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
          {stimulus.title}
        </h4>
      ) : null}

      <div className="text-xs text-slate-700 leading-relaxed max-h-64 sm:max-h-72 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200">
        {isHtml(html) ? <RichHtml html={html} /> : <p>{html}</p>}
      </div>

      {stimulus.source ? (
        <div className="text-[10px] italic text-slate-400 pt-1.5 border-t border-slate-100">
          Sumber: {stimulus.source}
        </div>
      ) : null}
    </aside>
  );
};

export default StimulusRereadCard;
