import { FloatingPwaQrCard } from '@/components/organisms/public/landing/FloatingPwaQrCard';
import { LandingDiagnosticsSection } from '@/components/organisms/public/landing/LandingDiagnosticsSection';
import { LandingDocumentationSection } from '@/components/organisms/public/landing/LandingDocumentationSection';
import { LandingFinalCtaSection } from '@/components/organisms/public/landing/LandingFinalCtaSection';
import { LandingHeroSection } from '@/components/organisms/public/landing/LandingHeroSection';
import { LandingLearningCycleSection } from '@/components/organisms/public/landing/LandingLearningCycleSection';
import { LandingModulesSection } from '@/components/organisms/public/landing/LandingModulesSection';
import { LandingNewsSection } from '@/components/organisms/public/landing/LandingNewsSection';
import { LandingRecommendationSection } from '@/components/organisms/public/landing/LandingRecommendationSection';
import { LandingTeamSection } from '@/components/organisms/public/landing/LandingTeamSection';
import { LandingTestimonialsSection } from '@/components/organisms/public/landing/LandingTestimonialsSection';
import { LandingTryoutSection } from '@/components/organisms/public/landing/LandingTryoutSection';
import { LandingValuePropsSection } from '@/components/organisms/public/landing/LandingValuePropsSection';
import { LandingVideoTutorialSection } from '@/components/organisms/public/landing/LandingVideoTutorialSection';
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
      <LandingVideoTutorialSection data={data.videoTutorial} />
      <LandingTestimonialsSection items={data.testimonials} />
      <LandingDocumentationSection items={data.documentationHighlights} />
      <LandingNewsSection news={data.news} />
      <LandingTeamSection members={data.teamMembers} />
      <LandingFinalCtaSection />
      <FloatingPwaQrCard />
    </NavLayout>
  );
}

export default LandingTemplate;
