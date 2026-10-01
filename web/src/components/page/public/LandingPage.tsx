import type * as React from 'react';
import { LandingTemplate } from '@/components/templates/public/LandingTemplate';
import type { LandingPageData } from '@/types/ui';

export interface LandingPageProps {
  data: LandingPageData;
}

export function LandingPage({ data }: LandingPageProps) {
  return <LandingTemplate data={data} />;
}

export default LandingPage;
