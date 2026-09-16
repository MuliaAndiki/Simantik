import React from 'react';
import {
  StudentDashboardFooter,
  TryoutCompletionCard,
  type TryoutCompletionCardProps,
} from '@/components/organisms/student';
import { cn } from '@/utils/classname';

export interface StudentTryoutResultPageProps extends TryoutCompletionCardProps {
  wrapperClassName?: string;
}

export const StudentTryoutResultPage: React.FC<StudentTryoutResultPageProps> = ({
  wrapperClassName,
  ...cardProps
}) => {
  return (
    <div className={cn('w-full max-w-full mx-auto space-y-10 py-6 sm:py-10', wrapperClassName)}>
      <TryoutCompletionCard {...cardProps} />
      <StudentDashboardFooter />
    </div>
  );
};

export default StudentTryoutResultPage;
