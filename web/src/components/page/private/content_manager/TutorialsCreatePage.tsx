import React from 'react';
import TutorialsCreateTemplate, {
  type TutorialsCreateTemplateProps,
} from '@/components/templates/content_manager/TutorialsCreateTemplate';

export type TutorialsCreatePageProps = TutorialsCreateTemplateProps;

const TutorialsCreatePage: React.FC<TutorialsCreatePageProps> = (props) => {
  return <TutorialsCreateTemplate {...props} />;
};

export default TutorialsCreatePage;
