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
import type { TutorialsPageData, VideoTutorialItem } from '@/types/ui';

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

  // Video CMS (publik) + data statis sebagai fallback.
  const { data: tutorialsData, isLoading } = content.query.tutorials({ limit: 50 });
  const apiVideos: VideoTutorialItem[] = useMemo(() => {
    return (tutorialsData?.tutorials ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category,
      duration: formatDuration(item.duration_seconds),
      videoUrl: item.youtube_embed_url || item.youtube_url,
    }));
  }, [tutorialsData]);

  const filteredData: TutorialsPageData = useMemo(() => {
    let videos: VideoTutorialItem[] = [...apiVideos, ...DEFAULT_TUTORIALS_DATA.videos];

    if (submittedQuery.trim()) {
      const q = submittedQuery.toLowerCase();
      videos = videos.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategoryId !== 'all') {
      videos = videos.filter((v) => {
        if (selectedCategoryId === 'basics') return v.category === 'Panduan Dasar';
        if (selectedCategoryId === 'practice') return v.category === 'Latihan Mandiri';
        if (selectedCategoryId === 'tryout') return v.category === 'Simulasi Tryout';
        if (selectedCategoryId === 'account') return v.category === 'Akun & Profil';
        return true;
      });
    }

    return {
      ...DEFAULT_TUTORIALS_DATA,
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
    const found =
      apiVideos.find((v) => v.id === id) ??
      DEFAULT_TUTORIALS_DATA.videos.find((v) => v.id === id) ??
      (DEFAULT_TUTORIALS_DATA.featuredVideo.id === id
        ? DEFAULT_TUTORIALS_DATA.featuredVideo
        : undefined);
    if (!found) return;
    setPlaying({ id: found.id, title: found.title, videoUrl: found.videoUrl });
  };

  // Loading saat fetch pertama — tampilkan animasi logo loader premium.
  if (isLoading) {
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
