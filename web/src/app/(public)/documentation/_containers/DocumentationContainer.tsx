'use client';

import { useMemo, useState } from 'react';
import { PublicPageLoader } from '@/components/atoms/loading';
import { DocumentationPage } from '@/components/page/public/DocumentationPage';
import { DEFAULT_DOCUMENTATION_DATA } from '@/configs/public-data';
import { useApi } from '@/hooks/useApi';
import type { DocArticleItem, DocumentationPageData } from '@/types/ui';

export function DocumentationContainer() {
  const { content } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  // Fetch live documentation list from backend
  const { data: docApiData, isLoading } = content.query.documentation({
    search: submittedQuery || undefined,
    limit: 50,
  });

  const mergedData: DocumentationPageData = useMemo(() => {
    const rawDocs = docApiData?.documentation ?? [];

    const liveArticles: DocArticleItem[] = rawDocs.map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      excerpt: d.content ? `${d.content.replace(/<[^>]*>?/gm, '').substring(0, 140)}...` : '',
      category: d.category || 'Panduan Penggunaan',
      categoryColorClass: 'bg-cyan-50 text-teal-800 border-cyan-200',
      readTimeMinutes: Math.max(2, Math.ceil((d.content?.length || 500) / 400)),
      publishedDate: d.createdAt
        ? new Date(d.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Terbaru',
      href: `/documentation/${d.slug || d.id}`,
    }));

    // Filter by category if selected
    const filteredArticles =
      selectedCategoryId === 'all'
        ? liveArticles
        : liveArticles.filter((art) => {
            const cat = art.category.toLowerCase();
            if (selectedCategoryId === 'guide') return cat.includes('panduan');
            if (selectedCategoryId === 'account') return cat.includes('akun');
            if (selectedCategoryId === 'practice') return cat.includes('latihan');
            if (selectedCategoryId === 'tryout') return cat.includes('tryout');
            if (selectedCategoryId === 'features') return cat.includes('fitur');
            return true;
          });

    // Update categories count dynamically based on real data
    const categoryCounts: Record<string, number> = {
      all: liveArticles.length,
      guide: 0,
      account: 0,
      practice: 0,
      tryout: 0,
      features: 0,
    };

    for (const art of liveArticles) {
      const cat = art.category.toLowerCase();
      if (cat.includes('panduan')) categoryCounts.guide++;
      if (cat.includes('akun')) categoryCounts.account++;
      if (cat.includes('latihan')) categoryCounts.practice++;
      if (cat.includes('tryout')) categoryCounts.tryout++;
      if (cat.includes('fitur')) categoryCounts.features++;
    }

    const categories = DEFAULT_DOCUMENTATION_DATA.categories.map((c) => ({
      ...c,
      count: categoryCounts[c.id] ?? 0,
    }));

    return {
      ...DEFAULT_DOCUMENTATION_DATA,
      categories,
      articles: filteredArticles,
    };
  }, [docApiData, selectedCategoryId]);

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  const handleSelectKeyword = (kw: string) => {
    setSearchQuery(kw);
    setSubmittedQuery(kw);
  };

  // Loading saat fetch awal data
  if (isLoading && !docApiData) {
    return (
      <PublicPageLoader
        label="Memuat Dokumentasi..."
        sublabel="Menyiapkan direktori panduan dan rujukan resmi SIMANTIK..."
      />
    );
  }

  return (
    <DocumentationPage
      data={mergedData}
      searchQuery={searchQuery}
      selectedCategoryId={selectedCategoryId}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      onSelectKeyword={handleSelectKeyword}
      onSelectCategory={setSelectedCategoryId}
    />
  );
}

export default DocumentationContainer;
