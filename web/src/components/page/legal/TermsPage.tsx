import type * as React from 'react';
import { LegalDocTemplate } from '@/components/templates/legal/LegalDocTemplate';
import type { LegalDocData } from '@/types/ui';

export interface TermsPageProps {
  data: LegalDocData;
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  onPrint?: () => void;
}

export function TermsPage({ data, activeSectionId, onSelectSection, onPrint }: TermsPageProps) {
  return (
    <LegalDocTemplate
      data={data}
      activeRoute="/terms"
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      onPrint={onPrint}
    />
  );
}
