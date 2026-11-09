'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import TutorialsPage from '@/components/page/private/content_manager/TutorialsPage';
import useApi from '@/hooks/useApi';
import type { TutorialResponse } from '@/types/service';
import type { TutorialFilterState, TutorialStats } from '@/types/ui/content-manager';

const INITIAL_FILTERS: TutorialFilterState = {
  search: '',
  status: 'Semua',
  category: 'Semua',
  page: 1,
  perPage: 6,
};

const TutorialsListContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const [filters, setFilters] = useState<TutorialFilterState>(INITIAL_FILTERS);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialResponse | null>(null);

  const tutorialsQuery = api.content.query.cmsTutorials({
    search: filters.search.trim() || undefined,
    status: filters.status !== 'Semua' ? filters.status : undefined,
    category: filters.category !== 'Semua' ? filters.category : undefined,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  const tutorials = tutorialsQuery.data?.tutorials ?? [];
  const totalItems = tutorialsQuery.data?.total ?? 0;

  const categoriesQuery = api.content.query.cmsTutorialCategories();
  const allCategories = categoriesQuery.data ?? [];

  const categoryOptions = useMemo(() => {
    const distinct = new Set<string>(allCategories);
    for (const item of tutorials) {
      if (item.category?.trim()) distinct.add(item.category.trim());
    }
    return [
      { value: 'Semua', label: 'Semua Kategori' },
      ...Array.from(distinct)
        .sort()
        .map((cat) => ({ value: cat, label: cat })),
    ];
  }, [allCategories, tutorials]);

  const stats = useMemo<TutorialStats>(() => {
    let published = 0;
    let draft = 0;
    let unpublished = 0;

    for (const item of tutorials) {
      const status = item.status.toLowerCase();
      if (status === 'published') published++;
      else if (status === 'draft') draft++;
      else unpublished++;
    }

    return {
      total: totalItems,
      published,
      draft,
      unpublished,
    };
  }, [tutorials, totalItems]);

  const handleAddTutorial = () => {
    router.push(`${basePath}/tutorials/create`);
  };

  const handleEditTutorial = (item: TutorialResponse) => {
    router.push(`${basePath}/tutorials/create?id=${item.id}`);
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleSelectTutorial = (item: TutorialResponse) => {
    setSelectedTutorial(item);
  };

  const handleOpenFull = (item: TutorialResponse) => {
    router.push(`${basePath}/tutorials/${item.slug || item.id}`);
  };

  const handleClosePreview = () => {
    setSelectedTutorial(null);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <TutorialsPage
      stats={stats}
      tutorials={tutorials}
      selectedTutorial={selectedTutorial}
      filters={filters}
      categoryOptions={categoryOptions}
      totalItems={totalItems}
      isPending={tutorialsQuery.isPending}
      onAddTutorial={handleAddTutorial}
      onSearchChange={handleSearchChange}
      onStatusChange={handleStatusChange}
      onCategoryChange={handleCategoryChange}
      onSelectTutorial={handleSelectTutorial}
      onEditTutorial={handleEditTutorial}
      onOpenFull={handleOpenFull}
      onClosePreview={handleClosePreview}
      onPageChange={handlePageChange}
    />
  );
};

export default TutorialsListContainer;
