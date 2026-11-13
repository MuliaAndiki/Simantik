'use client';

import { useMemo } from 'react';
import { LandingPage } from '@/components/page/public/LandingPage';
import { DEFAULT_LANDING_DATA } from '@/configs/public-data';
import { useApi } from '@/hooks/useApi';
import type {
  DocumentationHighlightItem,
  LandingNewsItem,
  LandingPageData,
  UserTestimonialItem,
  VideoTutorialHighlight,
} from '@/types/ui';
import PublicLoading from '../../loading';

export function HomeContainer() {
  const { content } = useApi();

  // Parallel queries for all 4 content domains from backend API
  const { data: newsData, isLoading: isNewsLoading } = content.query.news({ limit: 3 });
  const { data: docData, isLoading: isDocLoading } = content.query.documentation({ limit: 3 });
  const { data: tutorialData, isLoading: isTutorialLoading } = content.query.tutorials({
    limit: 1,
  });
  const { data: testimonialData, isLoading: isTestimonialLoading } = content.query.testimonials({
    limit: 6,
  });

  // Loading terpadu transisi halaman saat fetch awal data
  const isInitialLoading =
    (isNewsLoading && !newsData) ||
    (isDocLoading && !docData) ||
    (isTutorialLoading && !tutorialData) ||
    (isTestimonialLoading && !testimonialData);

  // Map data riil dari backend tanpa data dummy
  const mergedData: LandingPageData = useMemo(() => {
    // 1. News riil
    const liveNews: LandingNewsItem[] = (newsData?.news ?? []).map((item, idx) => ({
      id: item.id || `news-${idx}`,
      tag: 'Berita Resmi',
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Terbaru',
      title: item.title,
      excerpt: item.content ? `${item.content.replace(/<[^>]*>?/gm, '').substring(0, 140)}...` : '',
      slug: item.slug || item.id,
      imageUrl: item.thumbnailUrl || '/illustrations/student-learning.jpg',
    }));

    // 2. Documentation Highlights riil
    const liveDocs: DocumentationHighlightItem[] = (docData?.documentation ?? []).map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category || 'Panduan Penggunaan',
      date: d.createdAt
        ? new Date(d.createdAt).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
          })
        : 'Terbaru',
      imageUrl: '/illustrations/student-learning.jpg',
      slug: d.slug || d.id,
    }));

    // 3. Testimonials riil
    const liveTestimonials: UserTestimonialItem[] = (testimonialData?.testimonials ?? []).map(
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

    // 4. Video Tutorial riil
    let liveVideoTutorial: VideoTutorialHighlight | undefined;
    if (tutorialData?.tutorials && tutorialData.tutorials.length > 0) {
      const topVid = tutorialData.tutorials[0];
      const durationText = topVid.duration_seconds
        ? `${Math.floor(topVid.duration_seconds / 60)}:${String(topVid.duration_seconds % 60).padStart(2, '0')} Menit`
        : 'Video Panduan';

      liveVideoTutorial = {
        title: topVid.title,
        description: topVid.description || 'Pelajari panduan belajar terstruktur di SIMANTIK.',
        duration: durationText,
        thumbnailUrl: '/illustrations/student-learning.jpg',
        features: [
          'Panduan Ringkas & Cara Cepat (Trik) Menjawab Soal',
          'Latihan Soal Terkelompok dengan Ulasan Langsung',
          'Ujian Tryout Adaptif & Rapor Evaluasi Otomatis PDF',
        ],
      };
    }

    return {
      ...DEFAULT_LANDING_DATA,
      news: liveNews,
      documentationHighlights: liveDocs,
      testimonials: liveTestimonials.length > 0 ? liveTestimonials : undefined,
      videoTutorial: liveVideoTutorial,
    };
  }, [newsData, docData, tutorialData, testimonialData]);

  if (isInitialLoading) {
    return <PublicLoading />;
  }

  return <LandingPage data={mergedData} />;
}

export default HomeContainer;
