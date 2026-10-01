'use client';

import { useEffect, useMemo, useState } from 'react';
import { PublicPageLoader } from '@/components/atoms/loading';
import { TermsPage } from '@/components/page/legal/TermsPage';
import { useApi } from '@/hooks/useApi';
import { mapDocumentationToLegalDoc } from '@/utils/legal-doc.mapper';

export default function TermsContainer() {
  const { content } = useApi();
  const { data: docData, isLoading } = content.query.documentationBySlug('syarat-ketentuan');

  const legalDoc = useMemo(
    () =>
      mapDocumentationToLegalDoc(docData, {
        title: 'Syarat & Ketentuan',
        badge: 'KETENTUAN HUKUM',
        greeting: 'Syarat & Ketentuan Layanan SIMANTIK',
        defaultContent:
          'Dengan mengakses dan menggunakan platform SIMANTIK, pengguna menyetujui seluruh syarat dan ketentuan yang berlaku. Harap membaca dokumen ini secara saksama sebelum menggunakan layanan kami.',
        route: '/terms',
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
      <PublicPageLoader
        label="Memuat Syarat & Ketentuan..."
        sublabel="Menyiapkan dokumen syarat dan ketentuan layanan SIMANTIK..."
      />
    );
  }

  return (
    <TermsPage
      data={legalDoc}
      activeSectionId={activeSectionId}
      onSelectSection={handleSelectSection}
      onPrint={handlePrint}
    />
  );
}
