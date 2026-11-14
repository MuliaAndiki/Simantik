import type React from 'react';
import {
  AdminSchoolFormTemplate,
  type AdminSchoolFormTemplateProps,
} from '@/components/templates/admin/AdminSchoolFormTemplate';

export type AdminSchoolFormPageProps = AdminSchoolFormTemplateProps;

export const AdminSchoolFormPage: React.FC<AdminSchoolFormPageProps> = (props) => {
  return <AdminSchoolFormTemplate {...props} />;
};

export default AdminSchoolFormPage;
