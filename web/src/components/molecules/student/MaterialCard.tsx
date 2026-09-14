import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface MaterialCardProps {
  title: string;
  description: string;
  illustration: React.ReactNode;
  actionText?: string;
  href?: string;
  onLearn?: () => void;
  className?: string;
}

export function MaterialCard({
  title,
  description,
  illustration,
  actionText = 'Pelajari Materi',
  href,
  onLearn,
  className,
}: MaterialCardProps) {
  const content = (
    <Card
      className={cn(
        'flex flex-col justify-between p-4 md:p-5 rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:shadow-md hover:border-[#8BBCC5]/50 group',
        className
      )}
    >
      <div className="space-y-4">
        {/* Visual Graphic Banner */}
        <div className="w-full h-32 md:h-36 rounded-xl bg-gradient-to-b from-[#F0F9FA] to-[#E6F4F6] border border-[#DCEFF2] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
          {illustration}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-[#546A72] leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-2">
        {href ? (
          <Button
            asChild
            variant="secondary"
            className="w-full rounded-xl bg-[#E0F7FA] hover:bg-[#cbf1f6] text-[#1A4D5C] font-semibold text-xs md:text-sm h-10 gap-2 border border-[#BDEAF0]"
          >
            <Link href={href} onClick={onLearn}>
              <BookOpen className="size-4" />
              <span>{actionText}</span>
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={onLearn}
            className="w-full rounded-xl bg-[#E0F7FA] hover:bg-[#cbf1f6] text-[#1A4D5C] font-semibold text-xs md:text-sm h-10 gap-2 border border-[#BDEAF0] cursor-pointer"
          >
            <BookOpen className="size-4" />
            <span>{actionText}</span>
          </Button>
        )}
      </div>
    </Card>
  );

  return content;
}
