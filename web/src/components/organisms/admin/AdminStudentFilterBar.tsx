import React from 'react';
import { AdminUserFilterBar, type AdminUserFilterBarProps } from './AdminUserFilterBar';

export interface AdminStudentFilterBarProps extends Omit<AdminUserFilterBarProps, 'variant'> {}

export const AdminStudentFilterBar: React.FC<AdminStudentFilterBarProps> = (props) => {
  return <AdminUserFilterBar variant="student" {...props} />;
};

export default AdminStudentFilterBar;
