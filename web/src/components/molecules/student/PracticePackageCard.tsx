import { ArrowRight, Eye, FileText, RotateCcw } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
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
  status: PracticeStatus;
  totalQuestions: number;
  score?: number;
}

export interface PracticePackageCardProps {
  packageItem: PracticePackageItem;
  onStartPractice?: (packageId: string) => void;
  onViewResult?: (packageId: string) => void;
  onRetryPractice?: (packageId: string) => void;
  className?: string;
}

export function PracticePackageCard({
  packageItem,
  onStartPractice,
  onViewResult,
  onRetryPractice,
  className,
}: PracticePackageCardProps) {
  const getCompetencyBadgeStyle = (code: CompetencyCategory) => {
    switch (code) {
      case 'pemahaman-inferensial':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'evaluasi-apresiasi':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]';
      default:
        return 'bg-[#E0F7FA] text-[#0284C7] border-[#BDEAF0]';
    }
  };

  const isCompleted = packageItem.status === 'sudah-dikerjakan';

  return (
    <Card
      className={cn(
        'flex flex-col justify-between p-5 md:p-6 rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:shadow-md hover:border-[#8BBCC5]/50 group',
        className
      )}
    >
      <div className="space-y-3.5">
        {/* Top Badges Row: Competency (left) & Status (right) */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border',
              getCompetencyBadgeStyle(packageItem.competencyCode)
            )}
          >
            {packageItem.competencyName}
          </span>

          {isCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#059669] border border-emerald-200/60">
              ✓ Sudah dikerjakan
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium text-[#64748B]">
              Belum dikerjakan
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors line-clamp-2 leading-snug">
            {packageItem.title}
          </h3>
          <p className="text-xs md:text-sm text-[#546A72] leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {packageItem.description}
          </p>
        </div>

        {/* Metadata Row: Question Count & Score (if completed) */}
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
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-2 border-t border-[#F3F4F6]">
        {!isCompleted ? (
          <Button
            type="button"
            onClick={() => onStartPractice?.(packageItem.id)}
            className="w-full h-10 rounded-xl bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-semibold text-xs md:text-sm gap-2 border-none shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>Mulai Latihan</span>
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              onClick={() => onViewResult?.(packageItem.id)}
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
    </Card>
  );
}
