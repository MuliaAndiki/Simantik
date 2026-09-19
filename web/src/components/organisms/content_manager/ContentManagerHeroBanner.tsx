import React from 'react';
import { cn } from '@/utils/classname';

export interface ContentManagerHeroBannerProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ContentManagerHeroBanner: React.FC<ContentManagerHeroBannerProps> = ({
  title = 'Assessment & Content Management Hub',
  subtitle = 'Pusat kendali manajemen kurikulum, bank butir soal acak, materi digital, dan distribusi konten publik SIMANTIK.',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8',
        className
      )}
    >
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed max-w-3xl">
        {subtitle}
      </p>
    </div>
  );
};

export default ContentManagerHeroBanner;
