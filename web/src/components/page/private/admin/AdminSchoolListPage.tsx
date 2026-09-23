import type React from 'react';
import {
  AdminSchoolListTemplate,
  type AdminSchoolListTemplateProps,
} from '@/components/templates/admin/AdminSchoolListTemplate';

export type AdminSchoolListPageProps = AdminSchoolListTemplateProps;

export const AdminSchoolListPage: React.FC<AdminSchoolListPageProps> = (props) => {
  return <AdminSchoolListTemplate {...props} />;
};

export default AdminSchoolListPage;
