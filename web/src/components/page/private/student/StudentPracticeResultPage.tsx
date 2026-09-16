import React from 'react';
import {
  StudentPracticeResultTemplate,
  type StudentPracticeResultTemplateProps,
} from '@/components/templates/student/StudentPracticeResultTemplate';

export type StudentPracticeResultPageProps = StudentPracticeResultTemplateProps;

export function StudentPracticeResultPage(props: StudentPracticeResultPageProps) {
  return <StudentPracticeResultTemplate {...props} />;
}

export default StudentPracticeResultPage;
