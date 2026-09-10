'use client';

import * as React from 'react';

import { ComingSoonTemplate } from '@/components/templates';

export interface ComingSoonPageProps {
  launchDate?: Date | string;
}

/**
 * Page-level container component for the Coming Soon route.
 */
export function ComingSoonPage({ launchDate }: ComingSoonPageProps) {
  const handleSubscribe = async (email: string) => {
    // Logic for waitlist subscription API dispatch
    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  return <ComingSoonTemplate targetDate={launchDate} onSubscribe={handleSubscribe} />;
}
