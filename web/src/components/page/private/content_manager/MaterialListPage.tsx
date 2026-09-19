import React from 'react';
import {
  MaterialListTemplate,
  type MaterialListTemplateProps,
} from '@/components/templates/content_manager/MaterialListTemplate';

export type MaterialListPageProps = MaterialListTemplateProps;

export const MaterialListPage: React.FC<MaterialListPageProps> = (props) => {
  return <MaterialListTemplate {...props} />;
};

export default MaterialListPage;
