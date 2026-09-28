import type * as React from 'react';
import { BadgePill, ContentCardBase, TextCardLink } from '@/components/molecules/content-card';
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

const CATEGORY_TONES: Record<string, string> = {
  amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
};

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
  return (
    <ContentCardBase
      className={className}
      badge={
        <BadgePill
          className={cn(
            CATEGORY_TONES[categoryVariant] ?? 'bg-[#E0F7FA] text-[#1A4D5C] border-[#BDEAF0]'
          )}
        >
          {category}
        </BadgePill>
      }
      badgeRight={<span className="text-xs text-[#546A72]">{date}</span>}
      title={title}
      description={excerpt}
      href={href}
      onClick={onReadMore}
      footer={
        <div className="border-t border-[#F3F4F6]">
          <TextCardLink label={actionText} />
        </div>
      }
    />
  );
}
