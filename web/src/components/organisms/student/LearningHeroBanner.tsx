import type * as React from 'react';
import { PackageHeroBanner, type PackageHeroBannerProps } from './PackageHeroBanner';

export interface LearningHeroBannerProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LearningHeroBanner(props: LearningHeroBannerProps) {
  return <PackageHeroBanner variant="learning" {...props} />;
}

export type { PackageHeroBannerProps };
