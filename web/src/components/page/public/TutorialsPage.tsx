import type * as React from 'react';
import {
  TutorialsTemplate,
  type TutorialsTemplateProps,
} from '@/components/templates/public/TutorialsTemplate';

export interface TutorialsPageProps extends TutorialsTemplateProps {}

export function TutorialsPage(props: TutorialsPageProps) {
  return <TutorialsTemplate {...props} />;
}

export default TutorialsPage;
