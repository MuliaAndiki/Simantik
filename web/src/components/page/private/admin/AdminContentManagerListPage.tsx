import type React from 'react';
import {
  AdminContentManagerListTemplate,
  type AdminContentManagerListTemplateProps,
} from '@/components/templates/admin/AdminContentManagerListTemplate';

export type AdminContentManagerListPageProps = AdminContentManagerListTemplateProps;

export const AdminContentManagerListPage: React.FC<AdminContentManagerListPageProps> = (props) => {
  return <AdminContentManagerListTemplate {...props} />;
};

export default AdminContentManagerListPage;
