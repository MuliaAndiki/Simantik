import TestimonialsTemplate, {
  type TestimonialsTemplateProps,
} from '@/components/templates/content_manager/TestimonialsTemplate';

export type TestimonialsPageProps = TestimonialsTemplateProps;

const TestimonialsPage: React.FC<TestimonialsPageProps> = (props) => {
  return <TestimonialsTemplate {...props} />;
};

export default TestimonialsPage;
