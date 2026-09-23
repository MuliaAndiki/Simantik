import React from 'react';
import NewsCreateTemplate, {
  type NewsCreateTemplateProps,
} from '@/components/templates/content_manager/NewsCreateTemplate';

export type NewsCreatePageProps = NewsCreateTemplateProps;

const NewsCreatePage: React.FC<NewsCreatePageProps> = (props) => {
  return <NewsCreateTemplate {...props} />;
};

export default NewsCreatePage;
