import type * as React from 'react';
import { LegalDocTemplate } from '@/components/templates/legal/LegalDocTemplate';
import { HELP_CENTER_DATA } from '@/data/legal-docs.data';

export interface HelpPageProps {
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  onPrint?: () => void;
}

export function HelpPage({ activeSectionId, onSelectSection, onPrint }: HelpPageProps) {
  return (
    <LegalDocTemplate
      data={HELP_CENTER_DATA}
      activeRoute="/help"
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      onPrint={onPrint}
    />
  );
}
