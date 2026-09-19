import type React from 'react';
import {
  PracticeListTemplate,
  type PracticeListTemplateProps,
} from '@/components/templates/content_manager/PracticeListTemplate';

export type PracticeListPageProps = PracticeListTemplateProps;

export const PracticeListPage: React.FC<PracticeListPageProps> = (props) => {
  return <PracticeListTemplate {...props} />;
};

export default PracticeListPage;
