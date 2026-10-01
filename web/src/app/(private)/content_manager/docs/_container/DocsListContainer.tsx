'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DocsPage from '@/components/page/private/content_manager/DocsPage';
import useApi from '@/hooks/useApi';
import type { DocumentationResponse } from '@/types/service';
import type { DocsFilterState, DocsStats } from '@/types/ui/content-manager';

const INITIAL_FILTERS: DocsFilterState = {
  search: '',
  status: 'Semua',
  category: 'Semua',
  page: 1,
  perPage: 6,
};

const DocsListContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const api = useApi();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const [filters, setFilters] = useState<DocsFilterState>(INITIAL_FILTERS);
  const [selectedDoc, setSelectedDoc] = useState<DocumentationResponse | null>(null);

  const docsQuery = api.content.query.cmsDocumentation({
    search: filters.search.trim() || undefined,
    status: filters.status !== 'Semua' ? filters.status : undefined,
    category: filters.category !== 'Semua' ? filters.category : undefined,
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
  });

  const docs = docsQuery.data?.documentation ?? [];
  const totalItems = docsQuery.data?.total ?? 0;

  const categoryOptions = useMemo(() => {
    const distinct = new Set<string>();
    for (const item of docs) {
      if (item.category?.trim()) distinct.add(item.category.trim());
    }
    return [
      { value: 'Semua', label: 'Semua Kategori' },
      ...Array.from(distinct)
        .sort()
        .map((cat) => ({ value: cat, label: cat })),
    ];
  }, [docs]);

  const stats = useMemo<DocsStats>(() => {
    let published = 0;
    let draft = 0;
    let unpublished = 0;

    for (const item of docs) {
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
  }, [docs, totalItems]);

  const handleAddDoc = () => {
    router.push(`${basePath}/docs/create`);
  };

  const handleEditDoc = (item: DocumentationResponse) => {
    router.push(`${basePath}/docs/create?id=${item.id}`);
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

  const handleSelectDoc = (item: DocumentationResponse) => {
    setSelectedDoc(item);
  };

  const handleOpenFull = (item: DocumentationResponse) => {
    router.push(`${basePath}/docs/${item.slug || item.id}`);
  };

  const handleClosePreview = () => {
    setSelectedDoc(null);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <DocsPage
      stats={stats}
      docs={docs}
      selectedDoc={selectedDoc}
      filters={filters}
      categoryOptions={categoryOptions}
      totalItems={totalItems}
      isPending={docsQuery.isPending}
      onAddDoc={handleAddDoc}
      onSearchChange={handleSearchChange}
      onStatusChange={handleStatusChange}
      onCategoryChange={handleCategoryChange}
      onSelectDoc={handleSelectDoc}
      onEditDoc={handleEditDoc}
      onOpenFull={handleOpenFull}
      onClosePreview={handleClosePreview}
      onPageChange={handlePageChange}
    />
  );
};

export default DocsListContainer;
