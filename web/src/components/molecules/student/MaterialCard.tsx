import type * as React from 'react';
import { ContentCardBase, CyanCardButton } from '@/components/molecules/content-card';
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
  return (
    <ContentCardBase
      className={cn('p-4 md:p-5', className)}
      bodyClassName="space-y-4"
      illustration={illustration}
      title={title}
      titleLines={1}
      description={description}
      footer={<CyanCardButton label={actionText} href={href} onClick={onLearn} />}
    />
  );
}
