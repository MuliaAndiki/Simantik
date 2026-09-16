import React from 'react';
import {
  StudentTryoutDetailTemplate,
  type StudentTryoutDetailTemplateProps,
} from '@/components/templates/student/StudentTryoutDetailTemplate';

export type StudentTryoutDetailPageProps = StudentTryoutDetailTemplateProps;

export const StudentTryoutDetailPage: React.FC<StudentTryoutDetailPageProps> = (props) => {
  return <StudentTryoutDetailTemplate {...props} />;
};

export default StudentTryoutDetailPage;
