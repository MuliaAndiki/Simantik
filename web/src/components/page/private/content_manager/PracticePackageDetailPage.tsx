import React from 'react';
import {
  PracticePackageDetailTemplate,
  type PracticePackageDetailTemplateProps,
} from '@/components/templates/content_manager/PracticePackageDetailTemplate';

export type PracticePackageDetailPageProps = PracticePackageDetailTemplateProps;

export const PracticePackageDetailPage: React.FC<PracticePackageDetailPageProps> = (props) => {
  return <PracticePackageDetailTemplate {...props} />;
};

export default PracticePackageDetailPage;
