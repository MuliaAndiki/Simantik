import Link from 'next/link';
import type * as React from 'react';
import { cn } from '@/utils/classname';

export interface StudentDashboardFooterProps {
  className?: string;
}

export function StudentDashboardFooter({ className }: StudentDashboardFooterProps) {
  return (
    <footer
      className={cn(
        'mt-10 pt-6 pb-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#546A72]',
        className
      )}
    >
      <div className="flex items-center gap-1.5 font-medium">
        <span className="font-bold text-[#111827]">SIMANTIK</span>
        <span>© 2026 Platform EdTech SMA / SMK Terpadu</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
        <Link href="/privacy" className="hover:text-[#1A4D5C] transition-colors">
          Kebijakan Privasi
        </Link>
        <Link href="/terms" className="hover:text-[#1A4D5C] transition-colors">
          Syarat & Ketentuan
        </Link>
        <Link href="/help" className="hover:text-[#1A4D5C] transition-colors">
          Hubungi Kami
        </Link>
      </div>
    </footer>
  );
}
