import type React from 'react';
import {
  TryoutResultDetailTemplate,
  type TryoutResultDetailTemplateProps,
} from '@/components/templates/content_manager/TryoutResultDetailTemplate';

export type TryoutResultDetailPageProps = TryoutResultDetailTemplateProps;

export const TryoutResultDetailPage: React.FC<TryoutResultDetailPageProps> = (props) => {
  return <TryoutResultDetailTemplate {...props} />;
};

export default TryoutResultDetailPage;
