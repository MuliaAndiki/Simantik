import type * as React from 'react';
import {
  StudentPracticeDetailTemplate,
  type StudentPracticeDetailTemplateProps,
} from '@/components/templates/student/StudentPracticeDetailTemplate';

export type StudentPracticeDetailPageProps = StudentPracticeDetailTemplateProps;

export function StudentPracticeDetailPage(props: StudentPracticeDetailPageProps) {
  return <StudentPracticeDetailTemplate {...props} />;
}

export default StudentPracticeDetailPage;
