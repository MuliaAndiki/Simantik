import type React from 'react';
import {
  AdminStudentDetailTemplate,
  type AdminStudentDetailTemplateProps,
} from '@/components/templates/admin/AdminStudentDetailTemplate';

export type AdminStudentDetailPageProps = AdminStudentDetailTemplateProps;

export const AdminStudentDetailPage: React.FC<AdminStudentDetailPageProps> = (props) => {
  return <AdminStudentDetailTemplate {...props} />;
};

export default AdminStudentDetailPage;
