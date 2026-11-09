'use client';

import { useMemo, useState } from 'react';
import { PublicPageLoader } from '@/components/atoms/loading';
import {
  type PlayingVideo,
  VideoPlayerModal,
} from '@/components/organisms/public/tutorials/VideoPlayerModal';
import { TutorialsPage } from '@/components/page/public/TutorialsPage';
import { DEFAULT_TUTORIALS_DATA } from '@/configs/public-data';
import { useApi } from '@/hooks/useApi';
import type { FeaturedVideoTutorial, TutorialsPageData, VideoTutorialItem } from '@/types/ui';

function formatDuration(totalSeconds?: number | null): string {
  if (!totalSeconds || totalSeconds <= 0) return 'Video';
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TutorialsContainer() {
  const { content } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [playing, setPlaying] = useState<PlayingVideo | null>(null);

  // Video CMS (publik) dari database backend
  const { data: tutorialsData, isLoading } = content.query.tutorials({ limit: 50 });

  const apiVideos: VideoTutorialItem[] = useMemo(() => {
    return (tutorialsData?.tutorials ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category,
      duration: formatDuration(item.duration_seconds),
      videoUrl: item.youtube_embed_url || item.youtube_url,
      thumbnailUrl: '/illustrations/student-learning.jpg',
    }));
  }, [tutorialsData]);

  const filteredData: TutorialsPageData = useMemo(() => {
    let featuredVideo: FeaturedVideoTutorial | null = null;
    let poolVideos: VideoTutorialItem[] = [];

    if (apiVideos.length > 0) {
      const top = apiVideos[0];
      featuredVideo = {
        id: top.id,
        title: top.title,
        description: top.description,
        moduleInfo: `PANDUAN • ${top.category}`,
        duration: top.duration,
        badgeLabel: 'Video Unggulan',
        videoQuality: 'HD',
        languageTrack: 'Bahasa Indonesia',
        featureCheckpoints: [
          'Tersedia Video Interaktif',
          'Panduan Terstruktur Langkah demi Langkah',
        ],
        thumbnailUrl: top.thumbnailUrl || '/illustrations/student-learning.jpg',
        videoUrl: top.videoUrl,
      };
      poolVideos = apiVideos.slice(1);
    }

    let videos: VideoTutorialItem[] = poolVideos;

    if (submittedQuery.trim()) {
      const q = submittedQuery.toLowerCase();
      videos = videos.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategoryId !== 'all') {
      videos = videos.filter((v) => {
        const cat = v.category.toLowerCase();
        if (selectedCategoryId === 'basics') return cat.includes('dasar');
        if (selectedCategoryId === 'practice') return cat.includes('latihan');
        if (selectedCategoryId === 'tryout') return cat.includes('tryout');
        if (selectedCategoryId === 'account') return cat.includes('akun') || cat.includes('profil');
        return true;
      });
    }

    // Dynamic category counts based on real video items
    const categoryCounts: Record<string, number> = {
      all: apiVideos.length,
      basics: 0,
      practice: 0,
      tryout: 0,
      account: 0,
    };

    for (const v of apiVideos) {
      const cat = v.category.toLowerCase();
      if (cat.includes('dasar')) categoryCounts.basics++;
      if (cat.includes('latihan')) categoryCounts.practice++;
      if (cat.includes('tryout')) categoryCounts.tryout++;
      if (cat.includes('akun') || cat.includes('profil')) categoryCounts.account++;
    }

    const categories = DEFAULT_TUTORIALS_DATA.categories.map((c) => ({
      ...c,
      count: categoryCounts[c.id] ?? 0,
    }));

    return {
      ...DEFAULT_TUTORIALS_DATA,
      categories,
      featuredVideo,
      videos,
    };
  }, [submittedQuery, selectedCategoryId, apiVideos]);

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  const handleSelectKeyword = (kw: string) => {
    setSearchQuery(kw);
    setSubmittedQuery(kw);
  };

  const handlePlayVideo = (id: string) => {
    const found = apiVideos.find((v) => v.id === id);
    if (!found) return;
    setPlaying({ id: found.id, title: found.title, videoUrl: found.videoUrl });
  };

  // Loading saat fetch pertama — animasi loader transisi halaman
  if (isLoading && !tutorialsData) {
    return (
      <PublicPageLoader
        label="Memuat Video Tutorial..."
        sublabel="Menyiapkan direktori video panduan belajar SIMANTIK..."
      />
    );
  }

  return (
    <>
      <TutorialsPage
        data={filteredData}
        searchQuery={searchQuery}
        selectedCategoryId={selectedCategoryId}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSelectCategory={setSelectedCategoryId}
        onSelectKeyword={handleSelectKeyword}
        onPlayVideo={handlePlayVideo}
      />

      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </>
  );
}

export default TutorialsContainer;
