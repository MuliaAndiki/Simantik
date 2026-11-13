'use client';

import { useMemo, useState } from 'react';
import { PublicPageLoader } from '@/components/atoms/loading';
import { TestimonialsPage } from '@/components/page/public/TestimonialsPage';
import { DEFAULT_TESTIMONIALS_DATA } from '@/configs/public-data';
import { useApi } from '@/hooks/useApi';
import type {
  FeaturedSpotlightTestimonial,
  TestimonialsPageData,
  UserTestimonialItem,
} from '@/types/ui';

export function TestimonialsContainer() {
  const { content } = useApi();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Live query from API
  const { data: testimonialApiData, isLoading } = content.query.testimonials({ limit: 50 });
  const createTestimonialMutation = content.mutate.createTestimonial();

  const mergedData: TestimonialsPageData = useMemo(() => {
    const rawList = testimonialApiData?.testimonials ?? [];

    if (rawList.length > 0) {
      const liveTestimonials: UserTestimonialItem[] = rawList.map((t, idx) => ({
        id: t.id,
        authorName: t.authorName,
        authorRole: t.authorRole || 'Siswa Berprestasi',
        quote: t.content,
        categoryTag: t.authorRole?.includes('Guru') ? 'Guru & Pendidik' : 'Siswa SMA/SMK',
        rating: t.rating || 5,
        avatarUrl: `/avatars/${(idx % 8) + 1}.png`,
      }));

      const topTestimonial =
        liveTestimonials.find((t) => (t.rating ?? 5) >= 5) || liveTestimonials[0];

      const featuredSpotlight: FeaturedSpotlightTestimonial | null = topTestimonial
        ? {
            name: topTestimonial.authorName,
            role: topTestimonial.authorRole,
            school: topTestimonial.school || topTestimonial.authorRole,
            province: topTestimonial.province || 'Indonesia',
            academicTarget: 'Pencapaian Prestasi Literasi SIMANTIK',
            quote: topTestimonial.quote.startsWith('“')
              ? topTestimonial.quote
              : `“${topTestimonial.quote}”`,
            badges: ['Pengguna Aktif Terakreditasi', 'Ulasan Terverifikasi'],
            tryoutCompletedCount: 24,
            calibratedScore: 780,
            maxScore: 800,
            avatarUrl: topTestimonial.avatarUrl || '/avatars/1.png',
          }
        : null;

      return {
        ...DEFAULT_TESTIMONIALS_DATA,
        featuredSpotlight,
        testimonials: liveTestimonials,
      };
    }

    return {
      ...DEFAULT_TESTIMONIALS_DATA,
      featuredSpotlight: null,
      testimonials: [],
    };
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

  // Loading saat fetch pertama — animasi loader transisi halaman
  if (isLoading && !testimonialApiData) {
    return (
      <div className="w-full flex-1 min-h-screen flex items-center justify-center bg-white">
        <PublicPageLoader
          label="Memuat Testimoni..."
          sublabel="Menyiapkan ulasan dan cerita pengalaman belajar siswa..."
          containerClassName="min-h-screen w-full flex-1"
        />
      </div>
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
