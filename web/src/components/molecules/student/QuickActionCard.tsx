import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface QuickActionCardProps {
  title: string;
  description: string;
  actionText: string;
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function QuickActionCard({
  title,
  description,
  actionText,
  href,
  onClick,
  icon: Icon,
  iconBgColor = 'bg-[#E0F7FA]',
  iconColor = 'text-[#1A4D5C]',
  className,
}: QuickActionCardProps) {
  const content = (
    <Card
      className={cn(
        'group relative flex flex-col justify-between p-5 md:p-6 rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#8BBCC5]/50 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
            iconBgColor,
            iconColor
          )}
        >
          <Icon className="size-5.5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-[#546A72] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-[#F3F4F6] flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#1A4D5C] group-hover:text-[#0284c7] transition-colors">
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
