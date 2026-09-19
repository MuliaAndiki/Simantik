import type React from 'react';
import {
  PracticeCreateTemplate,
  type PracticeCreateTemplateProps,
} from '@/components/templates/content_manager/PracticeCreateTemplate';

export type PracticeCreatePageProps = PracticeCreateTemplateProps;

export const PracticeCreatePage: React.FC<PracticeCreatePageProps> = (props) => {
  return <PracticeCreateTemplate {...props} />;
};

export default PracticeCreatePage;
