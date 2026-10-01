import { LandingDiagnosticsSection } from '@/components/organisms/public/landing/LandingDiagnosticsSection';
import { LandingFinalCtaSection } from '@/components/organisms/public/landing/LandingFinalCtaSection';
import { LandingHeroSection } from '@/components/organisms/public/landing/LandingHeroSection';
import { LandingLearningCycleSection } from '@/components/organisms/public/landing/LandingLearningCycleSection';
import { LandingModulesSection } from '@/components/organisms/public/landing/LandingModulesSection';
import { LandingNewsSection } from '@/components/organisms/public/landing/LandingNewsSection';
import { LandingRecommendationSection } from '@/components/organisms/public/landing/LandingRecommendationSection';
import { LandingTryoutSection } from '@/components/organisms/public/landing/LandingTryoutSection';
import { LandingValuePropsSection } from '@/components/organisms/public/landing/LandingValuePropsSection';
import NavLayout from '@/core/layouts/nav.layout';
import type { LandingPageData } from '@/types/ui';

export interface LandingTemplateProps {
  data: LandingPageData;
}

export function LandingTemplate({ data }: LandingTemplateProps) {
  return (
    <NavLayout themeVariant="dark">
      <LandingHeroSection student={data.heroStudent} />
      <LandingValuePropsSection items={data.valueProps} />
      <LandingLearningCycleSection steps={data.learningCycle} />
      <LandingModulesSection modules={data.modules} />
      <LandingTryoutSection packages={data.tryoutPackages} />
      <LandingDiagnosticsSection diagnostics={data.diagnostics} />
      <LandingRecommendationSection data={data.recommendation} />
      <LandingNewsSection news={data.news} />
      <LandingFinalCtaSection />
    </NavLayout>
  );
}

export default LandingTemplate;
