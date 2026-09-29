import type React from 'react';
import {
  TryoutPackageDetailTemplate,
  type TryoutPackageDetailTemplateProps,
} from '@/components/templates/content_manager/TryoutPackageDetailTemplate';

export type TryoutPackageDetailPageProps = TryoutPackageDetailTemplateProps;

export const TryoutPackageDetailPage: React.FC<TryoutPackageDetailPageProps> = (props) => {
  return <TryoutPackageDetailTemplate {...props} />;
};

export default TryoutPackageDetailPage;
