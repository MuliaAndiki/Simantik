import { TestimonialFeaturedSpotlight } from '@/components/organisms/public/testimonials/TestimonialFeaturedSpotlight';
import { TestimonialGrid } from '@/components/organisms/public/testimonials/TestimonialGrid';
import { TestimonialHeroMetrics } from '@/components/organisms/public/testimonials/TestimonialHeroMetrics';
import { TestimonialSubmissionBanner } from '@/components/organisms/public/testimonials/TestimonialSubmissionBanner';
import { TestimonialSubmitModal } from '@/components/organisms/public/testimonials/TestimonialSubmitModal';
import NavLayout from '@/core/layouts/nav.layout';
import type { TestimonialsPageData } from '@/types/ui';

export interface TestimonialsTemplateProps {
  data: TestimonialsPageData;
  isSubmitModalOpen?: boolean;
  isSubmitting?: boolean;
  onOpenSubmissionModal?: () => void;
  onCloseSubmissionModal?: () => void;
  onSubmitTestimonial?: (data: {
    authorName: string;
    authorRole: string;
    content: string;
    rating: number;
  }) => Promise<void>;
}

export function TestimonialsTemplate({
  data,
  isSubmitModalOpen = false,
  isSubmitting = false,
  onOpenSubmissionModal,
  onCloseSubmissionModal,
  onSubmitTestimonial,
}: TestimonialsTemplateProps) {
  return (
    <NavLayout themeVariant="light">
      <TestimonialHeroMetrics metrics={data.impactMetrics} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <TestimonialFeaturedSpotlight spotlight={data.featuredSpotlight} />

        <TestimonialGrid testimonials={data.testimonials} />

        <TestimonialSubmissionBanner onOpenSubmissionModal={onOpenSubmissionModal} />
      </div>

      {onSubmitTestimonial && onCloseSubmissionModal && (
        <TestimonialSubmitModal
          isOpen={isSubmitModalOpen}
          onClose={onCloseSubmissionModal}
          onSubmit={onSubmitTestimonial}
          isLoading={isSubmitting}
        />
      )}
    </NavLayout>
  );
}

export default TestimonialsTemplate;
