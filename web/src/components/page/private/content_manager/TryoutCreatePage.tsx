import type React from 'react';
import {
  TryoutCreateTemplate,
  type TryoutCreateTemplateProps,
} from '@/components/templates/content_manager/TryoutCreateTemplate';

export type TryoutCreatePageProps = TryoutCreateTemplateProps;

export const TryoutCreatePage: React.FC<TryoutCreatePageProps> = (props) => {
  return <TryoutCreateTemplate {...props} />;
};

export default TryoutCreatePage;
