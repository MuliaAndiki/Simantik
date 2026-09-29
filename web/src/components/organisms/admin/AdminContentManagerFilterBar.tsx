import React from 'react';
import { AdminUserFilterBar, type AdminUserFilterBarProps } from './AdminUserFilterBar';

export interface AdminContentManagerFilterBarProps
  extends Omit<AdminUserFilterBarProps, 'variant'> {}

export const AdminContentManagerFilterBar: React.FC<AdminContentManagerFilterBarProps> = (
  props
) => {
  return <AdminUserFilterBar variant="content_manager" {...props} />;
};

export default AdminContentManagerFilterBar;
