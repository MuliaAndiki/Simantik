'use client';

import { useEffect, useState } from 'react';
import { TermsPage } from '@/components/page/legal/TermsPage';
import { TERMS_OF_SERVICE_DATA } from '@/data/legal-docs.data';

export default function TermsContainer() {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    TERMS_OF_SERVICE_DATA.sections[0]?.id || 'section-01'
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

  return (
    <TermsPage
      activeSectionId={activeSectionId}
      onSelectSection={handleSelectSection}
      onPrint={handlePrint}
    />
  );
}
