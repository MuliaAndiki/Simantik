import React from 'react';
import DocsCreateTemplate, {
  type DocsCreateTemplateProps,
} from '@/components/templates/content_manager/DocsCreateTemplate';

export type DocsCreatePageProps = DocsCreateTemplateProps;

const DocsCreatePage: React.FC<DocsCreatePageProps> = (props) => {
  return <DocsCreateTemplate {...props} />;
};

export default DocsCreatePage;
