import type * as React from 'react';
import { LegalDocTemplate } from '@/components/templates/legal/LegalDocTemplate';
import { PRIVACY_POLICY_DATA } from '@/data/legal-docs.data';

export interface PrivacyPageProps {
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  onPrint?: () => void;
}

export function PrivacyPage({ activeSectionId, onSelectSection, onPrint }: PrivacyPageProps) {
  return (
    <LegalDocTemplate
      data={PRIVACY_POLICY_DATA}
      activeRoute="/privacy"
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      onPrint={onPrint}
    />
  );
}
