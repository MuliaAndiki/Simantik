import DocsTemplate, {
  DocsTemplateProps,
} from '@/components/templates/content_manager/DocsTemplate';

export type DocsPageProps = DocsTemplateProps;

const DocsPage: React.FC<DocsPageProps> = (props) => {
  return <DocsTemplate {...props} />;
};

export default DocsPage;
