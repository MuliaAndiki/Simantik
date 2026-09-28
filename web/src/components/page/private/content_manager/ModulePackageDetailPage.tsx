import React from 'react';
import {
  ModulePackageDetailTemplate,
  type ModulePackageDetailTemplateProps,
} from '@/components/templates/content_manager/ModulePackageDetailTemplate';

export type ModulePackageDetailPageProps = ModulePackageDetailTemplateProps;

export const ModulePackageDetailPage: React.FC<ModulePackageDetailPageProps> = (props) => {
  return <ModulePackageDetailTemplate {...props} />;
};

export default ModulePackageDetailPage;
