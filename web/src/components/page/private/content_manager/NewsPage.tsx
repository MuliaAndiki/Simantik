import NewsTemplate, {
  NewsTemplateProps,
} from "@/components/templates/content_manager/NewsTemplate";
export type NewsPageProps = NewsTemplateProps;

const NewsPage: React.FC<NewsPageProps> = (props) => {
  return <NewsTemplate {...props} />;
};

export default NewsPage;
