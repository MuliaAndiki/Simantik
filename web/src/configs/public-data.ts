import type {
  DocumentationPageData,
  LandingPageData,
  TestimonialsPageData,
  TutorialsPageData,
} from '@/types/ui';

// ============================================================================
// 1. LANDING PAGE DATA (Matches landingpage.png)
// ============================================================================

export const DEFAULT_LANDING_DATA: LandingPageData = {
  heroStudent: {
    name: 'Ahmad Dani',
    school: 'SMA Kelas 12 • Pelajar Adaptif',
    badgeLevel: 'Level 5: Pelajar Adaptif',
    avatarInitials: 'AD',
    averageScore: 88,
    maxScore: 100,
    competencies: [
      { name: 'Matematika Dasar', scorePercent: 90 },
      { name: 'Literasi Bahasa', scorePercent: 72 },
      {
        name: 'Numerasi & Data',
        scorePercent: 55,
        isAlert: true,
        alertLabel: 'Perlu Penguatan',
      },
      { name: 'Penalaran Analitis', scorePercent: 78 },
    ],
    dailyRecommendation: {
      title: 'Penguatan Logika Numerasi',
      actionLabel: 'Mulai',
      href: '/login',
    },
    verifiedQuestionsCount: 40,
  },
  valueProps: [
    {
      id: 'prop-1',
      title: 'Gratis Sepenuhnya',
      description:
        'Seluruh fitur belajar dan ujian di aplikasi ini bisa digunakan tanpa biaya apa pun.',
      iconName: 'shield-check',
      colorTheme: 'teal',
    },
    {
      id: 'prop-2',
      title: 'Bebas Akses di Berbagai Perangkat',
      description:
        'Aplikasi ini bisa dibuka dengan lancar dari HP, tablet, maupun laptop/komputer, sehingga siswa bisa belajar kapan saja dan di mana saja.',
      iconName: 'laptop',
      colorTheme: 'cyan',
    },
    {
      id: 'prop-3',
      title: 'Disusun oleh Ahli',
      description:
        'Soal dan sistemnya dibuat langsung oleh tim ahli bahasa dan ahli komputer, sehingga kualitas ujiannya sangat terjamin dan mirip dengan ujian aslinya.',
      iconName: 'award',
      colorTheme: 'blue',
    },
    {
      id: 'prop-4',
      title: 'Penilaian Lebih Akurat',
      description:
        'Berkat sistem ujian yang menyesuaikan kemampuan (adaptif), nilai yang didapatkan benar-benar menggambarkan kemampuan asli siswa.',
      iconName: 'target',
      colorTheme: 'amber',
    },
    {
      id: 'prop-5',
      title: 'Umpan Balik yang Jelas',
      description:
        'Nilai akhir tidak hanya berupa angka, tetapi disertai catatan jelas mengenai apa saja yang masih menjadi kelemahan siswa agar bisa segera diperbaiki.',
      iconName: 'file-text',
      colorTheme: 'emerald',
    },
  ],
  learningCycle: [
    {
      step: '01',
      title: 'Belajar',
      description: 'Pelajari materi konsep dasar & materi kontekstual sesuai silabus belajarmu.',
    },
    {
      step: '02',
      title: 'Uji Kemampuan',
      description: 'Kerjakan simulasi tryout berbatas waktu untuk menguji retensi pemahaman.',
    },
    {
      step: '03',
      title: 'Analisis',
      description:
        'Periksa pemetaan kompetensi: identifikasi materi kuat dan materi yang tertinggal.',
    },
    {
      step: '04',
      title: 'Dapatkan Rekomendasi',
      description: 'Temukan modul spesifik yang diprioritaskan untuk dipelajari kembali.',
      isHighlighted: true,
      highlightBadge: 'Rekomendasi Cerdas',
    },
    {
      step: '05',
      title: 'Belajar Lagi',
      description: 'Tingkatkan penguasaan materi lalu ulangi tryout dengan keyakinan baru.',
    },
  ],
  modules: [
    {
      id: 'mod-1',
      title: 'Matematika Dasar',
      category: 'Konsep Dasar',
      level: 'Pemula',
      duration: '45 Menit',
      progressPercent: 85,
      href: '/login',
    },
    {
      id: 'mod-2',
      title: 'Literasi Teks',
      category: 'Pemahaman Bacaan',
      level: 'Menengah',
      duration: '60 Menit',
      progressPercent: 70,
      href: '/login',
    },
    {
      id: 'mod-3',
      title: 'Numerasi & Data',
      category: 'Prioritas Penguatan',
      level: 'Sedang',
      duration: '50 Menit',
      progressPercent: 40,
      isPriority: true,
      href: '/login',
    },
    {
      id: 'mod-4',
      title: 'Penalaran Analitis',
      category: 'Logika & Kognitif',
      level: 'Lanjutan',
      duration: '55 Menit',
      progressPercent: 60,
      href: '/login',
    },
  ],
  tryoutPackages: [
    {
      id: 'tryout-1',
      title: 'Simulasi Tryout Numerasi Nasional',
      description:
        'Fokus pada penyelesaian problem kuantitatif, penalaran statistik tabel, dan logika matematika kontekstual.',
      badgeLabel: 'Tryout Tersedia',
      badgeType: 'standard',
      difficulty: 'Sedang',
      totalQuestions: 40,
      durationMinutes: 60,
      startHref: '/login',
      detailHref: '/login',
    },
    {
      id: 'tryout-2',
      title: 'Diagnostik Literasi & Bahasa',
      description:
        'Mengukur pemahaman struktur kalimat, daya tangkap wacana bacaan kritis, dan sintesis argumen wacana.',
      badgeLabel: 'Paling Populer',
      badgeType: 'popular',
      difficulty: 'Menengah',
      totalQuestions: 50,
      durationMinutes: 75,
      startHref: '/login',
      detailHref: '/login',
    },
    {
      id: 'tryout-3',
      title: 'Simulasi Lengkap TKA Terpadu',
      description:
        'Paket terintegrasi empat pilar kompetensi dengan tingkat kesulitan bertahap sesuai respon jawaban peserta.',
      badgeLabel: 'Live Weekend • Adaptif Menantang',
      badgeType: 'live',
      difficulty: 'Lanjutan',
      totalQuestions: 80,
      durationMinutes: 120,
      startHref: '/login',
      detailHref: '/login',
    },
  ],
  diagnostics: {
    overallScorePercent: 78,
    grade: 'Baik',
    accuracyPercent: 82,
    answeredRatioText: '33 dari 40 Soal',
    avgTimePerQuestion: '1.2 Menit per Soal',
    targetThresholdPercent: 75,
    competencies: [
      {
        name: 'Matematika Dasar',
        scorePercent: 90,
        statusLabel: 'Sangat Kuat',
      },
      {
        name: 'Literasi & Bahasa',
        scorePercent: 72,
        statusLabel: 'Kuat',
      },
      {
        name: 'Numerasi & Data',
        scorePercent: 55,
        statusLabel: 'PERLU PENGUATAN',
        isAlert: true,
        alertNote:
          'Catatan Diagnostik: Ditemukan kendala pada interpretasi diagram batang ganda dan konsep dasar probabilitas bersyarat.',
      },
      {
        name: 'Penalaran Analitis',
        scorePercent: 78,
        statusLabel: 'Kuat',
      },
    ],
    principleQuote:
      'Bukan sekadar melihat skormu, tapi memahami langkah konkret perbaikan selanjutnya.',
  },
  recommendation: {
    flowSteps: [
      { stepNumber: 1, title: 'Hasil Tryout: 78%' },
      { stepNumber: 2, title: 'Area Terendah: Numerasi (55%)', isHighlighted: true },
      { stepNumber: 3, title: 'Deteksi Gap Konsep' },
      { stepNumber: 4, title: 'Modul Terarah Dihasilkan' },
    ],
    featuredModule: {
      id: 'rec-mod-1',
      title: 'Pelajari Kembali: Dasar–Dasar Numerasi & Analisis Data',
      description:
        'Modul ringkas ini dirancang khusus untuk memulihkan pemahaman logika grafis, interpretasi proporsi, serta teknik eliminasi opsi salah pada soal-soal numerasi berbatas waktu.',
      targetCompetency: 'Numerasi',
      curationReason: 'Skor 55% < Target 75%',
      estimatedDuration: '20 Menit Belajar',
      progressStatus: 'Belum Dimulai (0%)',
      learnHref: '/login',
      saveHref: '/login',
    },
  },
  news: [],
  teamMembers: [
    {
      id: 'team-1',
      name: 'Dr. Afnita, M.Pd.',
      role: 'Dosen PBSI UNP',
      institution: 'Universitas Negeri Padang',
      tag: 'Dosen Ahli Bahasa',
      imageSrc:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'team-2',
      name: 'Dr. Amril Amir, M.Pd.',
      role: 'Dosen PBSI UNP',
      institution: 'Universitas Negeri Padang',
      tag: 'Dosen Ahli Bahasa',
      imageSrc:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'team-3',
      name: 'Dr. Tressyalina, M.Pd.',
      role: 'Dosen PBSI UNP',
      institution: 'Universitas Negeri Padang',
      tag: 'Dosen Ahli Bahasa',
      imageSrc:
        'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'team-4',
      name: 'Faiza Nurrahmah, M.Pd.',
      role: 'Mahasiswa S-3 Ilmu Keguruan Bahasa',
      institution: 'Universitas Negeri Padang',
      tag: 'Riset Pembelajaran',
      imageSrc:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'team-5',
      name: 'Imam Andhika, M.Kom.',
      role: 'Tim Perancang Web-App SIMANTIK',
      institution: 'Sistem Informasi & Rekayasa Perangkat Lunak',
      tag: 'Perancang Sistem',
      imageSrc:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'team-6',
      name: 'Mulia Andiki',
      role: 'Tim Perancang Web-App SIMANTIK',
      institution: 'Pengembang Fullstack & Arsitektur Cloud',
      tag: 'Perancang Sistem',
      imageSrc:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'team-7',
      name: 'Nurul Adfi Sabila',
      role: 'Mahasiswa S-1 PBSI UNP',
      institution: 'Universitas Negeri Padang',
      tag: 'Pengembangan Konten',
      imageSrc:
        'https://images.unsplash.com/photo-1534751516642-a171edd25218?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'team-8',
      name: 'Indah Permata Sari',
      role: 'Mahasiswa S-1 PBSI UNP',
      institution: 'Universitas Negeri Padang',
      tag: 'Pengembangan Konten',
      imageSrc:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    },
  ],
  videoTutorial: undefined,
  documentationHighlights: [],
};

// ============================================================================
// 2. DOCUMENTATION PAGE DATA (Matches SIMANTIK - Public Documentation.png)
// ============================================================================

export const DEFAULT_DOCUMENTATION_DATA: DocumentationPageData = {
  popularKeywords: ['Pengerjaan Tryout', 'Reset Password', 'Format Soal MCMA'],
  categories: [
    { id: 'all', label: 'Semua', count: 0 },
    { id: 'guide', label: 'Panduan Penggunaan', count: 0 },
    { id: 'account', label: 'Akun', count: 0 },
    { id: 'practice', label: 'Latihan', count: 0 },
    { id: 'tryout', label: 'Tryout', count: 0 },
    { id: 'features', label: 'Fitur SIMANTIK', count: 0 },
  ],
  articles: [],
};

// ============================================================================
// 3. TUTORIALS PAGE DATA (Matches SIMANTIK - Tutorials.png)
// ============================================================================

export const DEFAULT_TUTORIALS_DATA: TutorialsPageData = {
  popularKeywords: [
    'Cara Mengerjakan Soal',
    'Simulasi Tryout 120 Menit',
    'Reset Sandi',
    'Analisis IRT',
  ],
  categories: [
    { id: 'all', label: 'Semua Tutorial', count: 0 },
    { id: 'basics', label: 'Panduan Dasar', count: 0 },
    { id: 'practice', label: 'Latihan Mandiri', count: 0 },
    { id: 'tryout', label: 'Simulasi Tryout', count: 0 },
    { id: 'account', label: 'Akun & Profil', count: 0 },
  ],
  featuredVideo: null,
  videos: [],
};

// ============================================================================
// 4. TESTIMONIALS PAGE DATA (Matches SIMANTIK - Testimonials.png)
// ============================================================================

export const DEFAULT_TESTIMONIALS_DATA: TestimonialsPageData = {
  impactMetrics: [
    {
      value: '98.4%',
      label: 'Siswa Merasa Lebih Percaya Diri',
      sublabel: 'Menghadapi TKA',
    },
    {
      value: '150+',
      label: 'Bank Soal Terstandarisasi BSKAP',
      sublabel: 'Kemendikbud',
    },
    {
      value: '45.000+',
      label: 'Siswa SMA/SMK Terdaftar',
      sublabel: 'Se-Indonesia',
    },
  ],
  featuredSpotlight: null,
  testimonials: [],
};
