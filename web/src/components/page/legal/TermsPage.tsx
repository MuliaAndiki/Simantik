import type * as React from 'react';
import { LegalDocTemplate } from '@/components/templates/legal/LegalDocTemplate';
import { TERMS_OF_SERVICE_DATA } from '@/data/legal-docs.data';

export interface TermsPageProps {
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  onPrint?: () => void;
}

export function TermsPage({ activeSectionId, onSelectSection, onPrint }: TermsPageProps) {
  return (
    <LegalDocTemplate
      data={TERMS_OF_SERVICE_DATA}
      activeRoute="/terms"
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      onPrint={onPrint}
    />
  );
}
