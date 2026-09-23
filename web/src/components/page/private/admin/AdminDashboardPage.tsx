import type React from 'react';
import {
  AdminDashboardTemplate,
  type AdminDashboardTemplateProps,
} from '@/components/templates/admin/AdminDashboardTemplate';

export type AdminDashboardPageProps = AdminDashboardTemplateProps;

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = (props) => {
  return <AdminDashboardTemplate {...props} />;
};

export default AdminDashboardPage;
