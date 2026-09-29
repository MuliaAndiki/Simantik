import React from 'react';
import { AdminUserStatusDialog, type AdminUserStatusDialogProps } from './AdminUserStatusDialog';

export interface AdminContentManagerStatusDialogProps
  extends Omit<AdminUserStatusDialogProps, 'variant'> {}

export const AdminContentManagerStatusDialog: React.FC<AdminContentManagerStatusDialogProps> = (
  props
) => {
  return <AdminUserStatusDialog variant="content_manager" {...props} />;
};

export default AdminContentManagerStatusDialog;
