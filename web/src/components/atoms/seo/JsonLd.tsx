export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['SoftwareApplication', 'EducationalApplication'],
        '@id': 'https://simantik.educourse.id/#app',
        name: 'SIMANTIK',
        alternateName: [
          'Simulasi Mandiri Tes Kemampuan Akademik',
          'SIMANTIK UNP',
          'TKA Bahasa Indonesia SIMANTIK',
        ],
        headline: 'Platform Pembelajaran Adaptif dan Asesmen Mandiri TKA Bahasa Indonesia SMA/SMK',
        description:
          'Aplikasi web dan Progressive Web App (PWA) edukasi untuk latihan membaca wacana kritis, simulasi tryout adaptif, analisis diagnostik kelemahan, dan rekomendasi remedial materi TKA Bahasa Indonesia bagi siswa SMA/SMK di seluruh Indonesia.',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web, Android, iOS (PWA)',
        url: 'https://simantik.educourse.id',
        image: 'https://simantik.educourse.id/images/logo.png',
        screenshot: 'https://simantik.educourse.id/images/modal.png',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IDR',
          availability: 'https://schema.org/InStock',
        },
        creator: {
          '@type': 'EducationalOrganization',
          '@id': 'https://simantik.educourse.id/#organization',
          name: 'Universitas Negeri Padang (UNP)',
          url: 'https://unp.ac.id',
          logo: 'https://simantik.educourse.id/images/logo.png',
          sameAs: ['https://unp.ac.id', 'https://simantik.educourse.id'],
        },
        publisher: {
          '@id': 'https://simantik.educourse.id/#organization',
        },
        inLanguage: 'id-ID',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://simantik.educourse.id/#website',
        url: 'https://simantik.educourse.id',
        name: 'SIMANTIK',
        description:
          'Simulasi Mandiri Tes Kemampuan Akademik (TKA) Bahasa Indonesia untuk Siswa SMA/SMK se-Indonesia.',
        publisher: {
          '@id': 'https://simantik.educourse.id/#organization',
        },
        inLanguage: 'id-ID',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://simantik.educourse.id/documentation?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Course',
        '@id': 'https://simantik.educourse.id/#course-tka',
        name: 'Persiapan & Asesmen Mandiri TKA Bahasa Indonesia SMA/SMK',
        description:
          'Program penguasaan membaca kritis, penalaran wacana beragam genre, dan simulasi tryout adaptif berstandar TKA dan SNBT.',
        provider: {
          '@id': 'https://simantik.educourse.id/#organization',
        },
        isAccessibleForFree: true,
        inLanguage: 'id-ID',
        educationalLevel: 'Secondary Education (SMA/SMK)',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://simantik.educourse.id/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Apa itu SIMANTIK?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SIMANTIK (Simulasi Mandiri Tes Kemampuan Akademik) adalah platform asesmen adaptif dan pembelajaran berbasis wacana Bahasa Indonesia untuk siswa SMA/SMK di Indonesia yang dikembangkan oleh tim ahli Universitas Negeri Padang (UNP).',
            },
          },
          {
            '@type': 'Question',
            name: 'Apakah latihan dan tryout TKA di SIMANTIK gratis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, seluruh layanan pembelajaran mandiri, bank soal wacana, tryout asesmen adaptif, analisis diagnostik kelemahan, dan rekomendasi materi remedial di SIMANTIK 100% gratis untuk seluruh siswa dan sekolah di Indonesia.',
            },
          },
          {
            '@type': 'Question',
            name: 'Bagaimana SIMANTIK membantu siswa menghadapi TKA Bahasa Indonesia?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SIMANTIK menyediakan 4 siklus belajar terpadu: Belajar Mandiri Berbasis Wacana, Tryout Asesmen Adaptif, Analisis Diagnostik Kelemahan Pemahaman Membaca, dan Rekomendasi Remedial Berbasis Skor Kompetensi.',
            },
          },
          {
            '@type': 'Question',
            name: 'Apakah SIMANTIK bisa dipasang sebagai aplikasi di smartphone?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, SIMANTIK mendukung teknologi Progressive Web App (PWA). Siswa dapat memindai kode QR PWA atau membuka situs di Google Chrome (Android) atau Safari (iOS) lalu memilih menu Tambahkan ke Layar Utama (Add to Home Screen). Sangat ringan (< 2 MB) tanpa perlu mengunduh file besar dari App Store atau Play Store.',
            },
          },
          {
            '@type': 'Question',
            name: 'Siapa yang mengembangkan platform SIMANTIK?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SIMANTIK dikembangkan oleh tim ahli bahasa dan komputer dari Universitas Negeri Padang (UNP) bekerja sama dengan praktisi pendidikan untuk meningkatkan mutu literasi membaca kritis siswa di Indonesia.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data injection
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default JsonLd;
