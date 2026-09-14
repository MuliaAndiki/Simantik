import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface LearningMaterialItem {
  id: string;
  title: string;
  description: string;
  competencyCode: string;
  competencyName: string;
  href?: string;
}

export interface LearningMaterialItemCardProps {
  material: LearningMaterialItem;
  onLearn?: (materialId: string) => void;
  className?: string;
}

export function LearningMaterialItemCard({
  material,
  onLearn,
  className,
}: LearningMaterialItemCardProps) {
  const getBadgeStyle = (code: string) => {
    switch (code) {
      case 'pemahaman-inferensial':
        return 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]';
      case 'evaluasi-apresiasi':
        return 'bg-[#E6F4EA] text-[#0D9488] border-[#A7F3D0]';
      default:
        return 'bg-[#E0F7FA] text-[#0284C7] border-[#BDEAF0]';
    }
  };

  const handleLearnClick = () => {
    onLearn?.(material.id);
  };

  return (
    <Card
      className={cn(
        'flex flex-col justify-between p-5 md:p-6 rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:shadow-md hover:border-[#8BBCC5]/50 group',
        className
      )}
    >
      <div className="space-y-3.5">
        {/* Competency Pill Badge */}
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border',
            getBadgeStyle(material.competencyCode)
          )}
        >
          {material.competencyName}
        </span>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors line-clamp-2 leading-snug">
            {material.title}
          </h3>
          <p className="text-xs md:text-sm text-[#546A72] leading-relaxed line-clamp-3 min-h-[3rem]">
            {material.description}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 mt-2">
        {material.href ? (
          <Button
            asChild
            className="w-full h-10 rounded-xl bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-semibold text-xs md:text-sm gap-2 border-none shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Link href={material.href} onClick={handleLearnClick}>
              <span>Pelajari Materi</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleLearnClick}
            className="w-full h-10 rounded-xl bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] font-semibold text-xs md:text-sm gap-2 border-none shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>Pelajari Materi</span>
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
