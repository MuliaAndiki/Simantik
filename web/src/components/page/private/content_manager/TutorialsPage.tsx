import TutorialsTemplate, {
  TutorialsTemplateProps,
} from '@/components/templates/content_manager/TutorialsTemplate';

export type TutorialsPageProps = TutorialsTemplateProps;

const TutorialsPage: React.FC<TutorialsPageProps> = (props) => {
  return <TutorialsTemplate {...props} />;
};

export default TutorialsPage;
