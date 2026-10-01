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
    limit: 12,
  });

  const mergedData: DocumentationPageData = useMemo(() => {
    // If backend has articles, map them
    if (docApiData?.documentation && docApiData.documentation.length > 0) {
      const liveArticles: DocArticleItem[] = docApiData.documentation.map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        excerpt: d.content ? `${d.content.replace(/<[^>]*>?/gm, '').substring(0, 140)}...` : '',
        category: d.category || 'Panduan Penggunaan',
        categoryColorClass: 'bg-cyan-50 text-teal-800 border-cyan-200',
        readTimeMinutes: 4,
        publishedDate: d.createdAt
          ? new Date(d.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'Terbaru',
        href: `/help`,
      }));

      // Filter by category if selected
      const filteredArticles =
        selectedCategoryId === 'all'
          ? liveArticles
          : liveArticles.filter((art) => {
              if (selectedCategoryId === 'guide')
                return art.category.toLowerCase().includes('panduan');
              if (selectedCategoryId === 'account')
                return art.category.toLowerCase().includes('akun');
              if (selectedCategoryId === 'practice')
                return art.category.toLowerCase().includes('latihan');
              if (selectedCategoryId === 'tryout')
                return art.category.toLowerCase().includes('tryout');
              if (selectedCategoryId === 'features')
                return art.category.toLowerCase().includes('fitur');
              return true;
            });

      return {
        ...DEFAULT_DOCUMENTATION_DATA,
        articles:
          filteredArticles.length > 0 ? filteredArticles : DEFAULT_DOCUMENTATION_DATA.articles,
      };
    }

    // Otherwise filter default articles locally
    let filtered = DEFAULT_DOCUMENTATION_DATA.articles;

    if (submittedQuery.trim()) {
      const q = submittedQuery.toLowerCase();
      filtered = filtered.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }

    if (selectedCategoryId !== 'all') {
      filtered = filtered.filter((art) => {
        if (selectedCategoryId === 'guide') return art.category === 'Panduan Penggunaan';
        if (selectedCategoryId === 'account') return art.category === 'Akun';
        if (selectedCategoryId === 'practice') return art.category === 'Latihan';
        if (selectedCategoryId === 'tryout') return art.category === 'Tryout';
        if (selectedCategoryId === 'features') return art.category === 'Fitur SIMANTIK';
        return true;
      });
    }

    return {
      ...DEFAULT_DOCUMENTATION_DATA,
      articles: filtered,
    };
  }, [docApiData, submittedQuery, selectedCategoryId]);

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  const handleSelectKeyword = (kw: string) => {
    setSearchQuery(kw);
    setSubmittedQuery(kw);
  };

  // Loading saat fetch pertama — tampilkan animasi logo loader premium.
  if (isLoading) {
    return (
      <PublicPageLoader
        label="Memuat Dokumentasi..."
        sublabel="Menyiapkan panduan dan direktori artikel SIMANTIK..."
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
      onSelectCategory={setSelectedCategoryId}
      onSelectKeyword={handleSelectKeyword}
    />
  );
}

export default DocumentationContainer;
