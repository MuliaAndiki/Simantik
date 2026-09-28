import type * as React from 'react';
import {
  BadgePill,
  ContentCardBase,
  competencyBadgeTone,
  YellowCardButton,
} from '@/components/molecules/content-card';

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
  return (
    <ContentCardBase
      className={className}
      badge={
        <BadgePill className={competencyBadgeTone(material.competencyCode)}>
          {material.competencyName}
        </BadgePill>
      }
      title={material.title}
      description={material.description}
      descriptionLines={3}
      footer={
        <YellowCardButton
          label="Pelajari Materi"
          href={material.href}
          onClick={() => onLearn?.(material.id)}
        />
      }
    />
  );
}
