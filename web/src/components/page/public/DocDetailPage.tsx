import type * as React from 'react';
import {
  DocDetailTemplate,
  type DocDetailTemplateProps,
} from '@/components/templates/public/DocDetailTemplate';

export type DocDetailPageProps = DocDetailTemplateProps;

export function DocDetailPage(props: DocDetailPageProps) {
  return <DocDetailTemplate {...props} />;
}

export default DocDetailPage;
