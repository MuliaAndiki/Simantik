import React from 'react';
import { AdminSettingsContent, type AdminSettingsContentProps } from '@/components/organisms/admin';
import { cn } from '@/utils/classname';

export interface AdminSettingsTemplateProps extends AdminSettingsContentProps {
  className?: string;
}

export const AdminSettingsTemplate: React.FC<AdminSettingsTemplateProps> = (props) => {
  return (
    <div className={cn('w-full max-w-5xl mx-auto space-y-6 pb-12', props.className)}>
      <AdminSettingsContent {...props} />
    </div>
  );
};

export default AdminSettingsTemplate;
