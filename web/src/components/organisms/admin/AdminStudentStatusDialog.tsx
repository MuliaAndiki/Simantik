import React from 'react';
import { AdminUserStatusDialog, type AdminUserStatusDialogProps } from './AdminUserStatusDialog';

export interface AdminStudentStatusDialogProps
  extends Omit<AdminUserStatusDialogProps, 'variant'> {}

export const AdminStudentStatusDialog: React.FC<AdminStudentStatusDialogProps> = (props) => {
  return <AdminUserStatusDialog variant="student" {...props} />;
};

export default AdminStudentStatusDialog;
