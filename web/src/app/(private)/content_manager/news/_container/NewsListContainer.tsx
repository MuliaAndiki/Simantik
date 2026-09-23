'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import NewsPage from '@/components/page/private/content_manager/NewsPage';
import useApi from '@/hooks/useApi';
import type { NewsResponse } from '@/types/service';
import type { NewsFilterState, NewsStats } from '@/types/ui/content-manager';

const INITIAL_FILTERS: NewsFilterState = {
  search: '',
  status: 'Semua',
  page: 1,
  perPage: 6,
};

const NewsListContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const [filters, setFilters] = useState<NewsFilterState>(INITIAL_FILTERS);
  const [selectedNews, setSelectedNews] = useState<NewsResponse | null>(null);

  const newsQuery = api.content.query.cmsNews({
    search: filters.search.trim() || undefined,
    status: filters.status !== 'Semua' ? filters.status : undefined,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  const news = newsQuery.data?.news ?? [];
  const totalItems = newsQuery.data?.total ?? 0;

  const stats = useMemo<NewsStats>(() => {
    let published = 0;
    let draft = 0;
    let unpublished = 0;

    for (const item of news) {
      const status = item.status.toLowerCase();
      if (status === 'published') published++;
      else if (status === 'draft') draft++;
      else unpublished++;
    }

    return {
      total: totalItems,
      totalChange: '+3 bulan ini',
      published,
      draft,
      unpublished,
    };
  }, [news, totalItems]);

  const handleAddNews = () => {
    router.push(`${basePath}/news/create`);
  };

  const handleEditNews = (item: NewsResponse) => {
    router.push(`${basePath}/news/create?id=${item.id}`);
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleSelectNews = (item: NewsResponse) => {
    setSelectedNews(item);
  };

  const handleClosePreview = () => {
    setSelectedNews(null);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <NewsPage
      stats={stats}
      news={news}
      selectedNews={selectedNews}
      filters={filters}
      totalItems={totalItems}
      isPending={newsQuery.isPending}
      onAddNews={handleAddNews}
      onSearchChange={handleSearchChange}
      onStatusChange={handleStatusChange}
      onSelectNews={handleSelectNews}
      onEditNews={handleEditNews}
      onClosePreview={handleClosePreview}
      onPageChange={handlePageChange}
    />
  );
};

export default NewsListContainer;
