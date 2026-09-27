import type * as React from 'react';
import { LegalDocTemplate } from '@/components/templates/legal/LegalDocTemplate';
import type { LegalDocData } from '@/types/ui';

export interface PrivacyPageProps {
  data: LegalDocData;
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
  onPrint?: () => void;
}

export function PrivacyPage({ data, activeSectionId, onSelectSection, onPrint }: PrivacyPageProps) {
  return (
    <LegalDocTemplate
      data={data}
      activeRoute="/privacy"
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      onPrint={onPrint}
    />
  );
}
