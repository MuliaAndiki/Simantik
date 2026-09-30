import { Eye, FileText, RotateCcw } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { BadgePill, ContentCardBase, YellowCardButton } from '@/components/molecules/content-card';
import { cn } from '@/utils/classname';

export type CompetencyCategory =
  | 'pemahaman-tekstual'
  | 'pemahaman-inferensial'
  | 'evaluasi-apresiasi'
  | string;

export type PracticeStatus = 'belum-dikerjakan' | 'sudah-dikerjakan';

export interface PracticePackageItem {
  id: string;
  title: string;
  description: string;
  competencyCode: CompetencyCategory;
  competencyName: string;
  /** UUID kompetensi dari respons API (null = tanpa kompetensi). */
  competencyId?: string | null;
  status: PracticeStatus;
  totalQuestions: number;
  score?: number;
  latestAttemptId?: string;
}

export interface PracticePackageCardProps {
  packageItem: PracticePackageItem;
  onStartPractice?: (packageId: string) => void;
  onViewResult?: (packageId: string, latestAttemptId?: string) => void;
  onRetryPractice?: (packageId: string) => void;
  className?: string;
}

const COMPETENCY_TONES: Record<string, string> = {
  'pemahaman-inferensial': 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
  'evaluasi-apresiasi': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
};

export function PracticePackageCard({
  packageItem,
  onStartPractice,
  onViewResult,
  onRetryPractice,
  className,
}: PracticePackageCardProps) {
  const isCompleted = packageItem.status === 'sudah-dikerjakan';

  return (
    <ContentCardBase
      className={className}
      badge={
        <BadgePill
          className={cn(
            COMPETENCY_TONES[packageItem.competencyCode] ??
              'bg-[#E0F7FA] text-[#0284C7] border-[#BDEAF0]'
          )}
        >
          {packageItem.competencyName}
        </BadgePill>
      }
      badgeRight={
        isCompleted ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#059669] border border-emerald-200/60">
            ✓ Sudah dikerjakan
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium text-[#64748B]">
            Belum dikerjakan
          </span>
        )
      }
      title={packageItem.title}
      description={packageItem.description}
      meta={
        <div className="flex items-center justify-between gap-2 pt-1 text-xs text-[#546A72]">
          <div className="flex items-center gap-1.5 font-medium">
            <FileText className="size-3.5 text-[#546A72]" />
            <span>{packageItem.totalQuestions} soal</span>
          </div>

          {isCompleted && packageItem.score !== undefined && (
            <span className="inline-flex items-center rounded-md bg-[#F0F9FF] px-2.5 py-0.5 text-xs font-bold text-[#0284C7] border border-[#BAE6FD]">
              Nilai: {packageItem.score}/100
            </span>
          )}
        </div>
      }
      footer={
        <div className="border-t border-[#F3F4F6]">
          {!isCompleted ? (
            <YellowCardButton
              label="Mulai Latihan"
              onClick={() => onStartPractice?.(packageItem.id)}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                onClick={() => onViewResult?.(packageItem.id, packageItem.latestAttemptId)}
                className="h-10 rounded-xl bg-[#1A4D5C] hover:bg-[#123945] text-white font-semibold text-xs sm:text-sm gap-1.5 border-none shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Eye className="size-4" />
                <span>Lihat Hasil</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => onRetryPractice?.(packageItem.id)}
                className="h-10 rounded-xl border border-[#E5E7EB] hover:bg-black/5 text-[#1A4D5C] font-semibold text-xs sm:text-sm gap-1.5 shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>Kerjakan Lagi</span>
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      }
    />
  );
}
