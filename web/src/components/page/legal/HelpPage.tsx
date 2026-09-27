import type * as React from 'react';
import { LegalDocTemplate } from '@/components/templates/legal/LegalDocTemplate';
import type { LegalDocData } from '@/types/ui';

export interface HelpPageProps {
  data: LegalDocData;
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  onPrint?: () => void;
}

export function HelpPage({ data, activeSectionId, onSelectSection, onPrint }: HelpPageProps) {
  return (
    <LegalDocTemplate
      data={data}
      activeRoute="/help"
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      onPrint={onPrint}
    />
  );
}
