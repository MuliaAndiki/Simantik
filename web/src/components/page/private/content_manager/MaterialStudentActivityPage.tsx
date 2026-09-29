import React from 'react';
import {
  MaterialStudentActivityTemplate,
  type MaterialStudentActivityTemplateProps,
} from '@/components/templates/content_manager/MaterialStudentActivityTemplate';

export type MaterialStudentActivityPageProps = MaterialStudentActivityTemplateProps;

export const MaterialStudentActivityPage: React.FC<MaterialStudentActivityPageProps> = (props) => {
  return <MaterialStudentActivityTemplate {...props} />;
};

export default MaterialStudentActivityPage;
