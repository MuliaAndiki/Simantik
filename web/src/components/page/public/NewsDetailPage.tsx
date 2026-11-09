import type * as React from 'react';
import {
  NewsDetailTemplate,
  type NewsDetailTemplateProps,
} from '@/components/templates/public/NewsDetailTemplate';

export type NewsDetailPageProps = NewsDetailTemplateProps;

export function NewsDetailPage(props: NewsDetailPageProps) {
  return <NewsDetailTemplate {...props} />;
}

export default NewsDetailPage;
