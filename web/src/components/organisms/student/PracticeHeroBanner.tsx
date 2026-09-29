import type * as React from 'react';
import { PackageHeroBanner } from './PackageHeroBanner';

export interface PracticeHeroBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

export function PracticeHeroBanner(props: PracticeHeroBannerProps) {
  return <PackageHeroBanner variant="practice" {...props} />;
}
