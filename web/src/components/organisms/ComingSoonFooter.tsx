import * as React from 'react';

import { SocialLinks } from '@/components/molecules';
import { cn } from '@/utils/classname';

export interface ComingSoonFooterProps extends React.HTMLAttributes<HTMLElement> {
  brandName?: string;
  contactEmail?: string;
}

export function ComingSoonFooter({
  brandName = 'SIMANTIK',
  contactEmail = 'support@educourse.id',
  className,
  ...props
}: ComingSoonFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'w-full border-t border-[#E5E7EB] bg-white/70 backdrop-blur-md py-8 px-4 sm:px-6',
        className
      )}
      {...props}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#1A4D5C]">
              {brandName}
            </span>
            <span className="text-xs text-[#7A9099] font-medium">• Educourse Exams</span>
          </div>
          <p className="text-xs text-[#546A72]">
            © {currentYear} {brandName}. Hak cipta dilindungi undang-undang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href={`mailto:${contactEmail}`}
            className="text-xs font-semibold text-[#8BBCC5] hover:text-[#4CA7B1] transition-colors"
          >
            {contactEmail}
          </a>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
