import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/classname';

export interface LearningDetailBreadcrumbProps {
  title?: string;
  onBack?: () => void;
  backHref?: string;
  className?: string;
}

export function LearningDetailBreadcrumb({
  title,
  onBack,
  backHref = '/student/learning',
  className,
}: LearningDetailBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm text-[#546A72] py-2 flex-wrap', className)}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1A4D5C] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#E2E8F0] transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4 shrink-0 text-[#1A4D5C]" />
          <span>Kembali</span>
        </button>
      ) : (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1A4D5C] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#E2E8F0] transition-colors"
        >
          <ChevronLeft className="size-4 shrink-0 text-[#1A4D5C]" />
          <span>Kembali</span>
        </Link>
      )}

      <span className="text-[#94A3B8] select-none font-light">/</span>

      <span className="font-medium text-[#475569] truncate max-w-[200px] sm:max-w-md text-xs sm:text-sm">
        {title || 'Judul Materi .....'}
      </span>
    </nav>
  );
}
