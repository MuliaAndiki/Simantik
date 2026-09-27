import NewsDetailContainer from '@/app/(private)/student/news/[id]/_container/NewsDetail';

interface DetailNewsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailNewsPage({ params }: DetailNewsPageProps) {
  const { id } = await params;
  return <NewsDetailContainer id={id} />;
}
