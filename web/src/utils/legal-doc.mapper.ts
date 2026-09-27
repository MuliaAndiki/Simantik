import type { DocumentationResponse } from '@/types/service';
import type { LegalDocData } from '@/types/ui';

export function mapDocumentationToLegalDoc(
  doc: DocumentationResponse | undefined | null,
  fallback: {
    title: string;
    badge: string;
    greeting: string;
    defaultContent: string;
    route: string;
  }
): LegalDocData {
  if (doc) {
    try {
      const parsed = JSON.parse(doc.content);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.sections)) {
        return parsed as LegalDocData;
      }
    } catch {
      // Content is HTML or text, handle as single section
    }

    return {
      title: doc.title || fallback.title,
      badge: doc.category || fallback.badge,
      lastUpdated: doc.updatedAt
        ? new Date(doc.updatedAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Terbaru',
      intro: {
        greeting: doc.title || fallback.greeting,
        paragraphs: ['Dokumentasi resmi dan ketentuan operasional platform SIMANTIK.'],
      },
      sections: [
        {
          id: 'section-01',
          number: '01',
          title: doc.title || fallback.title,
          customNote: doc.content || fallback.defaultContent,
        },
      ],
      sidebarQuestion: {
        question: 'Butuh bantuan lebih lanjut mengenai dokumen ini?',
        actionText: 'Pusat Bantuan',
        href: '/help',
      },
    };
  }

  return {
    title: fallback.title,
    badge: fallback.badge,
    lastUpdated: 'Terbaru',
    intro: {
      greeting: fallback.greeting,
      paragraphs: ['Dokumentasi resmi platform SIMANTIK.'],
    },
    sections: [
      {
        id: 'section-01',
        number: '01',
        title: fallback.title,
        customNote: fallback.defaultContent,
      },
    ],
    sidebarQuestion: {
      question: 'Butuh informasi lebih lanjut?',
      actionText: 'Hubungi Bantuan',
      href: '/help',
    },
  };
}
