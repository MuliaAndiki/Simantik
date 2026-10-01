import { DocArticleGrid } from '@/components/organisms/public/documentation/DocArticleGrid';
import { DocCategoryTabs } from '@/components/organisms/public/documentation/DocCategoryTabs';
import { DocHelpBanner } from '@/components/organisms/public/documentation/DocHelpBanner';
import { DocHeroSearch } from '@/components/organisms/public/documentation/DocHeroSearch';
import NavLayout from '@/core/layouts/nav.layout';
import type { DocumentationPageData } from '@/types/ui';

export interface DocumentationTemplateProps {
  data: DocumentationPageData;
  searchQuery: string;
  selectedCategoryId: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectCategory: (id: string) => void;
  onSelectKeyword: (kw: string) => void;
}

export function DocumentationTemplate({
  data,
  searchQuery,
  selectedCategoryId,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  onSelectKeyword,
}: DocumentationTemplateProps) {
  return (
    <NavLayout themeVariant="light">
      <DocHeroSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        popularKeywords={data.popularKeywords}
        onSelectKeyword={onSelectKeyword}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <DocCategoryTabs
          categories={data.categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
        />

        <DocArticleGrid articles={data.articles} />

        <DocHelpBanner />
      </div>
    </NavLayout>
  );
}

export default DocumentationTemplate;
