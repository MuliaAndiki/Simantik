import { TutorialCategoryTabs } from '@/components/organisms/public/tutorials/TutorialCategoryTabs';
import { TutorialFeaturedSpotlight } from '@/components/organisms/public/tutorials/TutorialFeaturedSpotlight';
import { TutorialHeroSearch } from '@/components/organisms/public/tutorials/TutorialHeroSearch';
import { TutorialSupportBanner } from '@/components/organisms/public/tutorials/TutorialSupportBanner';
import { TutorialVideoGrid } from '@/components/organisms/public/tutorials/TutorialVideoGrid';
import NavLayout from '@/core/layouts/nav.layout';
import type { TutorialsPageData } from '@/types/ui';

export interface TutorialsTemplateProps {
  data: TutorialsPageData;
  searchQuery: string;
  selectedCategoryId: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectCategory: (id: string) => void;
  onSelectKeyword: (kw: string) => void;
  onPlayVideo?: (id: string) => void;
}

export function TutorialsTemplate({
  data,
  searchQuery,
  selectedCategoryId,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  onSelectKeyword,
  onPlayVideo,
}: TutorialsTemplateProps) {
  return (
    <NavLayout themeVariant="light">
      <TutorialHeroSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        popularKeywords={data.popularKeywords}
        onSelectKeyword={onSelectKeyword}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <TutorialCategoryTabs
          categories={data.categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
        />

        <TutorialFeaturedSpotlight featured={data.featuredVideo} onPlayVideo={onPlayVideo} />

        <TutorialVideoGrid videos={data.videos} onSelectVideo={onPlayVideo} />

        <TutorialSupportBanner />
      </div>
    </NavLayout>
  );
}

export default TutorialsTemplate;
