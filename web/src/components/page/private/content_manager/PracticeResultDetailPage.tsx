import React from 'react';
import {
  PracticeResultDetailTemplate,
  type PracticeResultDetailTemplateProps,
} from '@/components/templates/content_manager/PracticeResultDetailTemplate';

export type PracticeResultDetailPageProps = PracticeResultDetailTemplateProps;

export const PracticeResultDetailPage: React.FC<PracticeResultDetailPageProps> = (props) => {
  return <PracticeResultDetailTemplate {...props} />;
};

export default PracticeResultDetailPage;
