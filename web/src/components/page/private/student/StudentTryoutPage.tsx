import type * as React from 'react';
import type {
  TryoutHeroBannerProps,
  TryoutPrepTipsCardProps,
  TryoutStandardsCardProps,
} from '@/components/organisms/student';
import { StudentTryoutTemplate } from '@/components/templates/student/StudentTryoutTemplate';

export interface StudentTryoutPageProps {
  onStartTryout?: () => void;
  heroProps?: Partial<TryoutHeroBannerProps>;
  standardsProps?: Partial<TryoutStandardsCardProps>;
  tipsProps?: Partial<TryoutPrepTipsCardProps>;
}

export function StudentTryoutPage({
  onStartTryout,
  heroProps,
  standardsProps,
  tipsProps,
}: StudentTryoutPageProps) {
  return (
    <StudentTryoutTemplate
      heroProps={{
        onStartTryout,
        ...heroProps,
      }}
      standardsProps={standardsProps}
      tipsProps={tipsProps}
    />
  );
}

export default StudentTryoutPage;
