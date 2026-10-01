'use client';

import { useMemo, useState } from 'react';
import { PublicPageLoader } from '@/components/atoms/loading';
import { TestimonialsPage } from '@/components/page/public/TestimonialsPage';
import { DEFAULT_TESTIMONIALS_DATA } from '@/configs/public-data';
import { useApi } from '@/hooks/useApi';
import type { TestimonialsPageData, UserTestimonialItem } from '@/types/ui';

export function TestimonialsContainer() {
  const { content } = useApi();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Live query from API
  const { data: testimonialApiData, isLoading } = content.query.testimonials({ limit: 12 });
  const createTestimonialMutation = content.mutate.createTestimonial();

  const mergedData: TestimonialsPageData = useMemo(() => {
    if (testimonialApiData?.testimonials && testimonialApiData.testimonials.length > 0) {
      const liveTestimonials: UserTestimonialItem[] = testimonialApiData.testimonials.map(
        (t, idx) => ({
          id: t.id,
          authorName: t.authorName,
          authorRole: t.authorRole || 'Siswa Berprestasi',
          quote: t.content,
          categoryTag: t.authorRole?.includes('Guru') ? 'Guru & Pendidik' : 'Siswa SMA/SMK',
          rating: t.rating || 5,
          avatarUrl: `/avatars/${(idx % 8) + 1}.png`,
        })
      );

      return {
        ...DEFAULT_TESTIMONIALS_DATA,
        testimonials:
          liveTestimonials.length >= 6
            ? liveTestimonials
            : [
                ...liveTestimonials,
                ...DEFAULT_TESTIMONIALS_DATA.testimonials.slice(liveTestimonials.length),
              ],
      };
    }

    return DEFAULT_TESTIMONIALS_DATA;
  }, [testimonialApiData]);

  const handleSubmitTestimonial = async (formData: {
    authorName: string;
    authorRole: string;
    content: string;
    rating: number;
  }) => {
    await createTestimonialMutation.mutateAsync({
      authorName: formData.authorName,
      authorRole: formData.authorRole,
      content: formData.content,
      rating: formData.rating,
    });
  };

  // Loading saat fetch pertama — tampilkan animasi logo loader premium.
  if (isLoading) {
    return (
      <PublicPageLoader
        label="Memuat Testimoni..."
        sublabel="Menyiapkan ulasan dan cerita pengalaman belajar siswa..."
      />
    );
  }

  return (
    <TestimonialsPage
      data={mergedData}
      isSubmitModalOpen={isSubmitModalOpen}
      isSubmitting={createTestimonialMutation.isPending}
      onOpenSubmissionModal={() => setIsSubmitModalOpen(true)}
      onCloseSubmissionModal={() => setIsSubmitModalOpen(false)}
      onSubmitTestimonial={handleSubmitTestimonial}
    />
  );
}

export default TestimonialsContainer;
