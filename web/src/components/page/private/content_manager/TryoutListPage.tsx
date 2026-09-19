import type React from 'react';
import {
  TryoutListTemplate,
  type TryoutListTemplateProps,
} from '@/components/templates/content_manager/TryoutListTemplate';

export type TryoutListPageProps = TryoutListTemplateProps;

export const TryoutListPage: React.FC<TryoutListPageProps> = (props) => {
  return <TryoutListTemplate {...props} />;
};

export default TryoutListPage;
