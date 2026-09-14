import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface NewsUpdateCardProps {
  category: string;
  categoryVariant?: 'cyan' | 'amber' | 'indigo' | 'default';
  date: string;
  title: string;
  excerpt: string;
  actionText?: string;
  href?: string;
  onReadMore?: () => void;
  className?: string;
}

export function NewsUpdateCard({
  category,
  categoryVariant = 'cyan',
  date,
  title,
  excerpt,
  actionText = 'Baca Selengkapnya',
  href,
  onReadMore,
  className,
}: NewsUpdateCardProps) {
  const getBadgeStyle = () => {
    switch (categoryVariant) {
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      default:
        return 'bg-[#E0F7FA] text-[#1A4D5C] border-[#BDEAF0]';
    }
  };

  const content = (
    <Card
      className={cn(
        'flex flex-col justify-between p-5 md:p-6 rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:shadow-md hover:border-[#8BBCC5]/50 group cursor-pointer',
        className
      )}
      onClick={onReadMore}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border',
              getBadgeStyle()
            )}
          >
            {category}
          </span>
          <span className="text-xs text-[#546A72]">{date}</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-[#546A72] leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-[#F3F4F6] flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#1A4D5C] group-hover:text-[#0284c7] transition-colors">
        <span>{actionText}</span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
