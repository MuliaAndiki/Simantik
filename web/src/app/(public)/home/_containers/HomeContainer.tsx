'use client';

import { useMemo } from 'react';
import { CardGridSkeleton } from '@/components/atoms/loading';
import { LandingPage } from '@/components/page/public/LandingPage';
import { DEFAULT_LANDING_DATA } from '@/configs/public-data';
import { useApi } from '@/hooks/useApi';
import type { LandingNewsItem, LandingPageData } from '@/types/ui';
import PublicLoading from '../../loading';

export function HomeContainer() {
  const { content } = useApi();
  const { data: newsData, isLoading } = content.query.news({ limit: 3 });

  // Merge live news data from backend if available, otherwise use default
  const mergedData: LandingPageData = useMemo(() => {
    if (newsData?.news && newsData.news.length > 0) {
      const liveNews: LandingNewsItem[] = newsData.news.map((item, idx) => ({
        id: item.id || `news-${idx}`,
        tag: 'Berita Resmi',
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Terbaru',
        title: item.title,
        excerpt: item.content ? `${item.content.substring(0, 140)}...` : '',
        slug: item.slug || item.id,
        imageUrl: item.thumbnailUrl || DEFAULT_LANDING_DATA.news[idx % 3]?.imageUrl,
      }));

      return {
        ...DEFAULT_LANDING_DATA,
        news: liveNews,
      };
    }

    return DEFAULT_LANDING_DATA;
  }, [newsData]);

  // Skeleton saat fetch pertama — jangan tampilkan data contoh.
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PublicLoading />
      </div>
    );
  }

  return <LandingPage data={mergedData} />;
}

export default HomeContainer;
