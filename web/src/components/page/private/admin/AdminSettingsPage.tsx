import type React from 'react';
import {
  AdminSettingsTemplate,
  type AdminSettingsTemplateProps,
} from '@/components/templates/admin/AdminSettingsTemplate';

export type AdminSettingsPageProps = AdminSettingsTemplateProps;

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = (props) => {
  return <AdminSettingsTemplate {...props} />;
};

export default AdminSettingsPage;
