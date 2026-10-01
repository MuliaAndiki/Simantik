import type * as React from 'react';
import {
  DocumentationTemplate,
  type DocumentationTemplateProps,
} from '@/components/templates/public/DocumentationTemplate';

export interface DocumentationPageProps extends DocumentationTemplateProps {}

export function DocumentationPage(props: DocumentationPageProps) {
  return <DocumentationTemplate {...props} />;
}

export default DocumentationPage;
