'use client';

import { useEffect, useMemo, useState } from 'react';
import { HelpPage } from '@/components/page/legal/HelpPage';
import { useApi } from '@/hooks/useApi';
import { mapDocumentationToLegalDoc } from '@/utils/legal-doc.mapper';

export default function HelpContainer() {
  const { content } = useApi();
  const { data: docData, isLoading } = content.query.documentationBySlug('bantuan');

  const legalDoc = useMemo(
    () =>
      mapDocumentationToLegalDoc(docData, {
        title: 'Pusat Bantuan',
        badge: 'PANDUAN & BANTUAN',
        greeting: 'Pusat Bantuan & Panduan SIMANTIK',
        defaultContent:
          'Selamat datang di Pusat Bantuan SIMANTIK. Temukan jawaban atas pertanyaan umum seputar akun, pelaksanaan tryout, materi pembelajaran, dan kendala teknis lainnya.',
        route: '/help',
      }),
    [docData]
  );

  const [activeSectionId, setActiveSectionId] = useState<string>(
    legalDoc.sections[0]?.id || 'section-01'
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setActiveSectionId(targetId);
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    const sectionElements = document.querySelectorAll('article[id^="section-"]');
    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Memuat pusat bantuan...</p>
      </div>
    );
  }

  return (
    <HelpPage
      data={legalDoc}
      activeSectionId={activeSectionId}
      onSelectSection={handleSelectSection}
      onPrint={handlePrint}
    />
  );
}
