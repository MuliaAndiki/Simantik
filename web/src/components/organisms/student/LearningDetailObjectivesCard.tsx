import { Check, Flag } from 'lucide-react';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface LearningDetailObjectivesCardProps {
  title?: string;
  introText?: string;
  objectives?: string[];
  note?: string;
  className?: string;
}

export function LearningDetailObjectivesCard({
  title = 'TUJUAN PEMBELAJARAN',
  introText = 'Setelah mempelajari materi ini, siswa diharapkan mampu:',
  objectives,
  note,
  className,
}: LearningDetailObjectivesCardProps) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <Card
      className={cn(
        'p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Flag className="size-4.5 text-[#0EA5E9]" />
        <h2 className="text-xs sm:text-sm font-bold tracking-wider text-[#0284C7] uppercase">
          {title}
        </h2>
      </div>

      {/* Intro Text */}
      <p className="text-sm sm:text-base font-semibold text-[#111827]">{introText}</p>

      {/* Objectives Checklist */}
      <ul className="space-y-3 pt-1">
        {objectives.map((item, index) => (
          <li key={`objective-${index}`} className="flex items-start gap-3">
            <span className="shrink-0 size-5 rounded-full bg-[#E0F7FA] text-[#0284C7] flex items-center justify-center mt-0.5">
              <Check className="size-3.5 stroke-[2.5]" />
            </span>
            <span className="text-sm sm:text-base text-[#374151] leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      {/* Footer Note */}
      {note && (
        <div className="pt-4 border-t border-[#F1F5F9]">
          <p className="text-xs italic text-[#6B7280] leading-relaxed">{note}</p>
        </div>
      )}
    </Card>
  );
}
