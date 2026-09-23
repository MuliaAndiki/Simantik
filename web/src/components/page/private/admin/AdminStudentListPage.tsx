import type React from 'react';
import {
  AdminStudentListTemplate,
  type AdminStudentListTemplateProps,
} from '@/components/templates/admin/AdminStudentListTemplate';

export type AdminStudentListPageProps = AdminStudentListTemplateProps;

export const AdminStudentListPage: React.FC<AdminStudentListPageProps> = (props) => {
  return <AdminStudentListTemplate {...props} />;
};

export default AdminStudentListPage;
