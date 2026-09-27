import React from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import type { StimulusData } from '@/types/ui';
import { isHtml } from '@/utils/wacana';

export interface PracticeQuestionStimulusProps {
  stimulus?: StimulusData;
}

export const PracticeQuestionStimulus: React.FC<PracticeQuestionStimulusProps> = ({ stimulus }) => {
  if (!stimulus) return null;

  // Render quote callout style (e.g. from Benar Salah, Tepat Tidak Tepat, Setuju Tidak Setuju)
  if (stimulus.quote) {
    return (
      <div className="mb-4 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-semibold">
          <span>{stimulus.title || 'Kutipan Teks / Stimulus'}</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF7F8] border border-cyan-100/80 text-slate-900 font-bold text-base sm:text-lg leading-relaxed shadow-sm">
          {stimulus.quote}
        </div>
      </div>
    );
  }

  // Render full reading wacana style (e.g. from Pilihan Ganda)
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F9FF] border border-cyan-100/90 text-slate-800 mb-4 shadow-sm">
      {stimulus.title && (
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#234E52] mb-3">
          <span>{stimulus.title}</span>
        </div>
      )}

      {stimulus.content && (
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2.5">
          {Array.isArray(stimulus.content) ? (
            stimulus.content.map((p, i) => (
              <p key={`stimulus-p-${i}`}>{isHtml(p) ? <RichHtml html={p} /> : p}</p>
            ))
          ) : (
            <RichHtml html={stimulus.content} />
          )}
        </div>
      )}

      {stimulus.source && (
        <div className="text-[11px] italic text-slate-500 text-right mt-3 pt-2 border-t border-cyan-100/60">
          {stimulus.source}
        </div>
      )}
    </div>
  );
};
