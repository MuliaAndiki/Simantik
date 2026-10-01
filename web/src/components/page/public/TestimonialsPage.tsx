import type * as React from 'react';
import {
  TestimonialsTemplate,
  type TestimonialsTemplateProps,
} from '@/components/templates/public/TestimonialsTemplate';

export interface TestimonialsPageProps extends TestimonialsTemplateProps {}

export function TestimonialsPage(props: TestimonialsPageProps) {
  return <TestimonialsTemplate {...props} />;
}

export default TestimonialsPage;
