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
      title: 'Belajar Terarah',
      description:
        'Materi kurikulum disusun sistematis agar alur belajarmu tidak membingungkan dan mudah dipahami bertahap.',
      iconName: 'compass',
      colorTheme: 'teal',
    },
    {
      id: 'prop-2',
      title: 'Uji Kemampuan',
      description:
        'Uji pemahamanmu secara berkala lewat ribuan bank soal tryout standar asesmen nasional terkini.',
      iconName: 'check-circle',
      colorTheme: 'cyan',
    },
    {
      id: 'prop-3',
      title: 'Analisis Performa',
      description:
        'Bukan hanya nilai akhir, pahami indikator kelemahan topik dan statistik ketepatan waktu pengerjaanmu.',
      iconName: 'bar-chart',
      colorTheme: 'blue',
    },
    {
      id: 'prop-4',
      title: 'Rekomendasi Personal',
      description:
        'Sistem cerdas SIMANTIK memilihkan modul latihan yang relevan tepat pada materi yang belum kamu kuasai.',
      iconName: 'lightbulb',
      colorTheme: 'amber',
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
  news: [
    {
      id: 'news-1',
      tag: 'Tips & Trik',
      date: '12 Maret 2026',
      title: 'Strategi Efektif Menyelesaikan Soal Numerasi dalam 60 Detik',
      excerpt:
        'Pelajari trik dekonstruksi soal panjang, eliminasi cepat opsi distractor, serta optimasi manajemen waktu saat menghadapi soal data grafik.',
      slug: 'strategi-efektif-soal-numerasi-60-detik',
      imageUrl: '/illustrations/student-learning.jpg',
    },
    {
      id: 'news-2',
      tag: 'Kebijakan',
      date: '8 Maret 2026',
      title: 'Panduan Asesmen Kemampuan Akademik Terbaru 2026',
      excerpt:
        'Membedah kisi-kisi standar soal baru, proporsi pembobotan penalaran kognitif, dan tips adaptasi terhadap format soal stimulus teks ganda.',
      slug: 'panduan-asesmen-kemampuan-akademik-terbaru-2026',
      imageUrl: '/illustrations/student-evaluation.jpg',
    },
    {
      id: 'news-3',
      tag: 'Studi Efektif',
      date: '3 Maret 2026',
      title: 'Membangun Konsistensi Belajar dengan Metode Siklus Tertutup',
      excerpt:
        'Riset membuktikan evaluasi mingguan dengan rekomendasi terarah meningkatkan retensi materi hingga 3x lipat dibanding sistem kebut semalam.',
      slug: 'membangun-konsistensi-belajar-metode-siklus-tertutup',
      imageUrl: '/illustrations/student-recommendation.jpg',
    },
  ],
};

// ============================================================================
// 2. DOCUMENTATION PAGE DATA (Matches SIMANTIK - Public Documentation.png)
// ============================================================================

export const DEFAULT_DOCUMENTATION_DATA: DocumentationPageData = {
  popularKeywords: ['Pengerjaan Tryout', 'Reset Password', 'Format Soal MCMA'],
  categories: [
    { id: 'all', label: 'Semua', count: 24 },
    { id: 'guide', label: 'Panduan Penggunaan', count: 6 },
    { id: 'account', label: 'Akun', count: 4 },
    { id: 'practice', label: 'Latihan', count: 5 },
    { id: 'tryout', label: 'Tryout', count: 5 },
    { id: 'features', label: 'Fitur SIMANTIK', count: 4 },
  ],
  articles: [
    {
      id: 'doc-1',
      title: 'Cara Menggunakan SIMANTIK',
      slug: 'cara-menggunakan-simantik',
      excerpt:
        'Pelajari cara navigasi modul materi, latihan soal terarah, dan alur simulasi ujian nasional Bahasa Indonesia dengan optimal di perangkat apa pun.',
      category: 'Panduan Penggunaan',
      categoryColorClass: 'bg-cyan-50 text-teal-800 border-cyan-200',
      readTimeMinutes: 4,
      publishedDate: '21 Sep 2026',
      href: '/help',
    },
    {
      id: 'doc-2',
      title: 'Panduan Mengikuti Latihan',
      slug: 'panduan-mengikuti-latihan',
      excerpt:
        'Ketahui langkah-langkah mengerjakan latihan Bahasa Indonesia, aturan anti-curang otomatis, pelacakan waktu butir, dan review pembahasan.',
      category: 'Latihan',
      categoryColorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      readTimeMinutes: 5,
      publishedDate: '20 Sep 2026',
      href: '/help',
    },
    {
      id: 'doc-3',
      title: 'Panduan Mengikuti Tryout',
      slug: 'panduan-mengikuti-tryout',
      excerpt:
        'Pelajari cara mengikuti simulasi tryout berbatas waktu di SIMANTIK dengan matriks 150 butir kognitif C1–C5 dan pembobotan skor standar.',
      category: 'Tryout',
      categoryColorClass: 'bg-amber-50 text-amber-800 border-amber-200',
      readTimeMinutes: 6,
      publishedDate: '19 Sep 2026',
      href: '/help',
    },
    {
      id: 'doc-4',
      title: 'Pengaturan Akun & Keamanan Siswa',
      slug: 'pengaturan-akun-keamanan-siswa',
      excerpt:
        'Panduan verifikasi email OTP, aktivasi Google Auth, ganti kata sandi berkala, serta tips menjaga kerahasiaan identitas digital saat ujian.',
      category: 'Akun',
      categoryColorClass: 'bg-slate-100 text-slate-800 border-slate-200',
      readTimeMinutes: 3,
      publishedDate: '18 Sep 2026',
      href: '/help',
    },
    {
      id: 'doc-5',
      title: 'Sistem Pengacakan Bank Soal Cerdas',
      slug: 'sistem-pengacakan-bank-soal-cerdas',
      excerpt:
        'Penjelasan algoritma cerdas pemilihan butir soal adaptif berbasis capaian Kurikulum Merdeka dan pemetaan tingkat kemahiran.',
      category: 'Fitur SIMANTIK',
      categoryColorClass: 'bg-sky-50 text-sky-800 border-sky-200',
      readTimeMinutes: 5,
      publishedDate: '15 Sep 2026',
      href: '/help',
    },
    {
      id: 'doc-6',
      title: 'Format Soal PGK & Benar–Salah',
      slug: 'format-soal-pgk-benar-salah',
      excerpt:
        'Mengenal instrumen penilaian modern: Pilihan Ganda Kompleks (MCMA), penalaran stimulus wacana berantai, dan matriks evaluasi benar-salah.',
      category: 'Latihan',
      categoryColorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      readTimeMinutes: 4,
      publishedDate: '12 Sep 2026',
      href: '/help',
    },
  ],
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
    { id: 'all', label: 'Semua Tutorial', count: 12 },
    { id: 'basics', label: 'Panduan Dasar', count: 4 },
    { id: 'practice', label: 'Latihan Mandiri', count: 3 },
    { id: 'tryout', label: 'Simulasi Tryout', count: 3 },
    { id: 'account', label: 'Akun & Profil', count: 2 },
  ],
  featuredVideo: {
    id: 'feat-vid-1',
    title: 'Cara Menggunakan SIMANTIK dari Awal',
    description:
      'Panduan komprehensif eksplorasi beranda siswa, memilih modul capaian Kurikulum Merdeka, dan navigasi bank soal tanpa hambatan teknis.',
    moduleInfo: 'PANDUAN DASAR • Modul 01 / Orientasi',
    duration: '04:25 Menit',
    badgeLabel: 'Video Terpopuler',
    videoQuality: 'Resolusi Full HD',
    languageTrack: 'Teks Bahasa Indonesia',
    featureCheckpoints: [
      'Tersedia Video HD • Langkah Bernomor Terstruktur',
      'Termasuk Pengaturan Mode Ujian & Ukuran Huruf Soal',
    ],
    thumbnailUrl: '/illustrations/student-learning.jpg',
  },
  videos: [
    {
      id: 'vid-1',
      title: 'Cara Menggunakan SIMANTIK',
      description:
        'Panduan dasar menggunakan fitur utama SIMANTIK, aktivasi akun, dan navigasi menu belajar.',
      category: 'Panduan Dasar',
      duration: '03:15',
      thumbnailUrl: '/illustrations/student-learning.jpg',
    },
    {
      id: 'vid-2',
      title: 'Cara Mengikuti Latihan',
      description:
        'Panduan menggunakan fitur latihan Bahasa Indonesia, jenis instrumen soal MCMA, dan pembahasan.',
      category: 'Latihan Mandiri',
      duration: '05:40',
      thumbnailUrl: '/illustrations/student-evaluation.jpg',
    },
    {
      id: 'vid-3',
      title: 'Cara Mengikuti Tryout',
      description:
        'Panduan mengikuti tryout dari awal sampai selesai, manajemen alokasi waktu 120 menit, dan sistem anti-curang.',
      category: 'Simulasi Tryout',
      duration: '06:10',
      thumbnailUrl: '/illustrations/student-recommendation.jpg',
    },
    {
      id: 'vid-4',
      title: 'Menjawab Soal Tipe Benar / Salah',
      description:
        'Teknik menganalisis stimulus wacana panjang dan menandai matriks evaluasi benar-salah secara presisi.',
      category: 'Latihan Mandiri',
      duration: '02:50',
      thumbnailUrl: '/illustrations/student-learning.jpg',
    },
    {
      id: 'vid-5',
      title: 'Membaca Rapor Skor IRT & Analisis...',
      description:
        'Memahami persentil nasional, diagnosis sub-kompetensi morfologi dan penalaran wacana pasca-ujian.',
      category: 'Evaluasi & Rapor',
      duration: '04:15',
      thumbnailUrl: '/illustrations/student-evaluation.jpg',
    },
    {
      id: 'vid-6',
      title: 'Sinkronisasi NISN & Keamanan Sandi',
      description:
        'Cara menghubungkan akun dengan data sekolah Dapodik dan verifikasi keamanan akun secara berkala.',
      category: 'Akun & Profil',
      duration: '03:00',
      thumbnailUrl: '/illustrations/student-recommendation.jpg',
    },
  ],
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
  featuredSpotlight: {
    name: 'Anindya Putri Rahmadani',
    role: 'Siswa Kelas XII SMA • Peraih Skor Tertinggi Simulasi TKA 2026',
    school: 'SMAN 1 Jakarta',
    province: 'Provinsi DKI Jakarta',
    academicTarget: 'Fakultas Hukum Universitas Indonesia',
    quote:
      '“SIMANTIK membantu saya lebih terbiasa mengerjakan berbagai jenis soal Bahasa Indonesia. Analisis mendalam per sub–topik membuat persiapan TKA terasa seperti permainan strategi yang terarah, bukan beban hafalan!”',
    badges: ['Top Scorer Tryout Nasional #1', 'Siswa Aktif Terakreditasi • DKI Jakarta'],
    tryoutCompletedCount: 48,
    calibratedScore: 780,
    maxScore: 800,
    avatarUrl: '/avatars/1.png',
  },
  testimonials: [
    {
      id: 'testi-1',
      authorName: 'Arya Satria',
      authorRole: 'Siswa SMA',
      school: 'SMAN 5 Surabaya',
      province: 'Jawa Timur',
      quote:
        '“Latihan format MCMA kompleks di SIMANTIK membuat saya terbiasa membaca opsi jawaban kritis yang mirip-mirip tapi beda nuansa makna.”',
      categoryTag: 'Siswa SMA',
      avatarUrl: '/avatars/2.png',
      rating: 5,
    },
    {
      id: 'testi-2',
      authorName: 'Hendra Wijaya, S.Pd.',
      authorRole: 'Guru Bahasa Indonesia SMA Al-Azhar',
      school: 'SMA Al-Azhar',
      province: 'DKI Jakarta',
      quote:
        '“Bank soal di SIMANTIK sangat kontekstual dan sesuai standar Asesmen Nasional. Siswa kami jadi terbiasa dengan model bacaan sains, sosial, dan sastra.”',
      categoryTag: 'Guru & Pembimbing',
      avatarUrl: '/avatars/3.png',
      rating: 5,
    },
    {
      id: 'testi-3',
      authorName: 'Bima Danuarta',
      authorRole: 'Siswa SMK',
      school: 'SMKN 2 Bandung',
      province: 'Jawa Barat',
      quote:
        '“Saya siswa SMK kejuruan teknologi yang awalnya kurang pede dengan tes literasi. Berkat penjelasan konsep di tiap pembahasan, skor saya melonjak drastis.”',
      categoryTag: 'Siswa SMK',
      avatarUrl: '/avatars/4.png',
      rating: 5,
    },
    {
      id: 'testi-4',
      authorName: 'Siti Aisyah',
      authorRole: 'Siswa SMA',
      school: 'SMAN 1 Denpasar',
      province: 'Bali',
      quote:
        '“Sistem peringatan tab dan timer adaptif bikin mental ujian terbentuk. Jadi pas tryout resmi serentak di lab komputer sekolah sama sekali tidak panik.”',
      categoryTag: 'Siswa SMA',
      avatarUrl: '/avatars/5.png',
      rating: 5,
    },
    {
      id: 'testi-5',
      authorName: 'Nurul Hikmah, M.Pd.',
      authorRole: 'Koordinator Kurikulum Nasional',
      school: 'Konsultan Pendidikan',
      province: 'DKI Jakarta',
      quote:
        '“Fitur pembagian pilar pemahaman tekstual, inferensial, dan evaluasi sangat membantu guru mendiagnosis kekurangan masing-masing murid.”',
      categoryTag: 'Guru & Konsultan',
      avatarUrl: '/avatars/6.png',
      rating: 5,
    },
    {
      id: 'testi-6',
      authorName: 'Fikri Pratama',
      authorRole: 'Mahasiswa Sastra Indonesia UI',
      school: 'Alumni SMAN 8 Jakarta',
      province: 'DKI Jakarta',
      quote:
        '“Kunci lolos seleksi PTN impian saya ada di konsistensi latihan soal inferensial SIMANTIK tiap hari. Sangat direkomendasikan untuk pejuang SNBT & TKA!”',
      categoryTag: 'Alumni TKA Berprestasi',
      avatarUrl: '/avatars/7.png',
      rating: 5,
    },
  ],
};
