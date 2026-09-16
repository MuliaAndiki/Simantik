import type { PracticeQuestionItem } from '@/types/ui';

export const DEFAULT_PRACTICE_QUESTIONS: PracticeQuestionItem[] = [
  // 1. Pilihan Ganda (Single Choice) - Sesuai Pilihan Ganda.png
  {
    id: 'q-1',
    questionNumber: 1,
    competencyBadge: 'MENEMUKAN INFORMASI TERSURAT • PEMAHAMAN INFERENSIAL',
    type: 'pilihan-ganda',
    instruction:
      'Petunjuk: Baca wacana secara teliti, lalu pilih satu opsi respon yang paling tepat dari pilihan A sampai E.',
    promptCategory: 'PERTANYAAN ANALITIS & INFERENSIAL:',
    questionText:
      'Berdasarkan paragraf di atas, hubungan semantik yang paling tepat antara kalimat pertama dan kalimat kedua adalah...',
    stimulus: {
      title: 'WACANA BACAAN 02 • EKONOMI DIGITAL NUSANTARA',
      content: [
        'Transformasi digital pada segmen Usaha Kecil dan Menengah (UKM) di Indonesia tidak semata-mata berpusat pada migrasi kanal pemasaran menuju platform lokapasar daring, melainkan menyangkut rekonfigurasi tata kelola rantai pasok dan adopsi pencatatan keuangan terdesentralisasi.',
        'Studi Bank Indonesia (2024) mengindikasikan bahwa entitas bisnis yang mengintegrasikan sistem pelaporan berbasis komputasi awan mengalami peningkatan rasio solvabilitas rata-rata sebesar 23,8% dalam kurun waktu empat kuartal operasional. Kendati demikian, keterbatasan literasi digital perbankan dan disparitas infrastruktur telekomunikasi antardaerah tetap menjadi determinan penghambat utama ekspansi kapabilitas komersial tersebut.',
      ],
      source: 'Disadur dari: Jurnal Kebijakan Fiskal & Digitalisasi Sektor Riil (2024)',
    },
    options: [
      {
        id: 'opt-1-a',
        label: 'A',
        title:
          'Kalimat kedua membantah premis mendasar transformasi digital yang telah dirumuskan pada kalimat pertama.',
      },
      {
        id: 'opt-1-b',
        label: 'B',
        title:
          'Kalimat kedua menyajikan elaborasi empiris berupa bukti statistik atas aspek rekonfigurasi tata kelola yang disebut pada kalimat pertama.',
      },
      {
        id: 'opt-1-c',
        label: 'C',
        title:
          'Kalimat kedua mereduksi urgensi migrasi kanal digital dengan memperkenalkan regulasi operasional perbankan baru.',
      },
      {
        id: 'opt-1-d',
        label: 'D',
        title:
          'Kalimat kedua mengabaikan faktor rantai pasok dan berfokus tunggal pada mitigasi risiko disparitas jaringan.',
      },
      {
        id: 'opt-1-e',
        label: 'E',
        title:
          'Kalimat kedua memaparkan perbandingan performa makroekonomi antara sektor manufaktur berat dan perdagangan eceran.',
      },
    ],
  },

  // 2. Pilihan Ganda Kompleks (MCMA) - Sesuai Pilihan Ganda Kompleks.png
  {
    id: 'q-2',
    questionNumber: 2,
    competencyBadge: 'MENEMUKAN INFORMASI TERSURAT • PEMAHAMAN INFERENSIAL',
    type: 'pilihan-ganda-kompleks',
    instruction:
      'Pilih semua opsi yang tepat berdasarkan isi argumen. Jawaban benar dapat lebih dari satu.',
    questionText:
      'Faktor-faktor apa sajakah yang secara eksplisit dinyatakan sebagai determinan penghambat percepatan transformasi digital UKM dalam wacana?',
    options: [
      {
        id: 'opt-2-a',
        label: 'A',
        title: 'Keterbatasan pemahaman literasi perbankan digital',
        description:
          'Hambatan kompetensi adaptasi transaksi perbankan non-tunai di tingkat pelaku usaha.',
      },
      {
        id: 'opt-2-b',
        label: 'B',
        title: 'Tingginya tarif pajak ekspor produk manufaktur',
        description: 'Beban fiskal bea keluar lintas batas wilayah kepulauan.',
      },
      {
        id: 'opt-2-c',
        label: 'C',
        title: 'Disparitas ketersediaan infrastruktur jaringan telekomunikasi',
        description: 'Kesenjangan jangkauan broadband serat optik antardaerah terluar.',
      },
      {
        id: 'opt-2-d',
        label: 'D',
        title: 'Keengganan konsumen lokal berbelanja di pasar swalayan',
        description: 'Preferensi kultural terhadap pola barter fisik di pedesaan.',
      },
    ],
  },

  // 3. Kategori Benar Salah - Sesuai Kategori Benar Salah.png
  {
    id: 'q-3',
    questionNumber: 3,
    competencyBadge: 'MENEMUKAN INFORMASI TERSURAT • PEMAHAMAN INFERENSIAL',
    type: 'benar-salah',
    stimulus: {
      title: 'Kutipan Teks / Stimulus',
      quote: '“Solusi tersebut tidak mudah.”',
    },
    questionText: 'Mengapa penulis menggunakan kalimat tersebut pada teks?',
    instruction:
      'Petunjuk Pengerjaan: Tentukan Benar atau Salah untuk setiap butir pernyataan di bawah ini berdasarkan relevansi tujuan penulis!',
    statements: [
      {
        id: 'stmt-3-a',
        label: 'A',
        statement:
          'Menginformasikan kepada pembaca bahwa pemecahan masalah sampah merupakan tanggung jawab utama kita sebagai masyarakat sipil sehingga sulit untuk diselesaikan.',
      },
      {
        id: 'stmt-3-b',
        label: 'B',
        statement:
          'Menunjukkan kepada pembaca bahwa permasalahan sampah plastik sangat rumit dan tidak bisa diselesaikan dalam jangka waktu singkat.',
      },
      {
        id: 'stmt-3-c',
        label: 'C',
        statement:
          'Membuktikan kepada pembaca bahwa permasalahan sampah yang rumit disebabkan pemecahan masalah yang bergantung pada perekonomian negara berkembang.',
      },
    ],
  },

  // 4. Kategori Tepat Tidak Tepat - Sesuai Katagori Tetap Tidak Tepat.png
  {
    id: 'q-4',
    questionNumber: 4,
    competencyBadge: 'MENEMUKAN INFORMASI TERSURAT • PEMAHAMAN INFERENSIAL',
    type: 'tepat-tidak-tepat',
    stimulus: {
      title: 'Kutipan Teks / Stimulus',
      quote: '“Solusi tersebut tidak mudah.”',
    },
    questionText: 'Mengapa penulis menggunakan kalimat tersebut pada teks?',
    instruction:
      'Petunjuk Pengerjaan: Tentukan Tepat atau Tidak Tepat untuk setiap butir pernyataan di bawah ini berdasarkan relevansi tujuan penulis!',
    statements: [
      {
        id: 'stmt-4-a',
        label: 'A',
        statement:
          'Menginformasikan kepada pembaca bahwa pemecahan masalah sampah merupakan tanggung jawab utama kita sebagai masyarakat sipil sehingga sulit untuk diselesaikan.',
      },
      {
        id: 'stmt-4-b',
        label: 'B',
        statement:
          'Menunjukkan kepada pembaca bahwa permasalahan sampah plastik sangat rumit dan tidak bisa diselesaikan dalam jangka waktu singkat.',
      },
      {
        id: 'stmt-4-c',
        label: 'C',
        statement:
          'Membuktikan kepada pembaca bahwa permasalahan sampah yang rumit disebabkan pemecahan masalah yang bergantung pada perekonomian negara berkembang.',
      },
    ],
  },

  // 5. Kategori Setuju Tidak Setuju - Sesuai Katagori Sutuju Tidak Setuju.png
  {
    id: 'q-5',
    questionNumber: 5,
    competencyBadge: 'MENEMUKAN INFORMASI TERSURAT • PEMAHAMAN INFERENSIAL',
    type: 'setuju-tidak-setuju',
    stimulus: {
      title: 'Kutipan Teks / Stimulus',
      quote: '“Solusi tersebut tidak mudah.”',
    },
    questionText: 'Mengapa penulis menggunakan kalimat tersebut pada teks?',
    instruction:
      'Petunjuk Pengerjaan: Tentukan Setuju atau Tidak Setuju untuk setiap butir pernyataan di bawah ini berdasarkan relevansi tujuan penulis!',
    statements: [
      {
        id: 'stmt-5-a',
        label: 'A',
        statement:
          'Menginformasikan kepada pembaca bahwa pemecahan masalah sampah merupakan tanggung jawab utama kita sebagai masyarakat sipil sehingga sulit untuk diselesaikan.',
      },
      {
        id: 'stmt-5-b',
        label: 'B',
        statement:
          'Menunjukkan kepada pembaca bahwa permasalahan sampah plastik sangat rumit dan tidak bisa diselesaikan dalam jangka waktu singkat.',
      },
      {
        id: 'stmt-5-c',
        label: 'C',
        statement:
          'Membuktikan kepada pembaca bahwa permasalahan sampah yang rumit disebabkan pemecahan masalah yang bergantung pada perekonomian negara berkembang.',
      },
    ],
  },

  // 6. Pilihan Ganda (Single Choice)
  {
    id: 'q-6',
    questionNumber: 6,
    competencyBadge: 'MENEMUKAN INFORMASI TERSURAT • PEMAHAMAN TEKSTUAL',
    type: 'pilihan-ganda',
    instruction:
      'Pilihlah salah satu jawaban yang paling tepat berdasarkan makna denotatif dan konteks teks.',
    promptCategory: 'PERTANYAAN TEKSTUAL & DETAIL:',
    questionText:
      'Berdasarkan studi Bank Indonesia (2024), berapakah persentase rata-rata peningkatan rasio solvabilitas bagi entitas bisnis yang mengadopsi pelaporan berbasis komputasi awan?',
    options: [
      { id: 'opt-6-a', label: 'A', title: '12,5% dalam kurun waktu dua kuartal' },
      { id: 'opt-6-b', label: 'B', title: '18,2% dalam periode semesteran' },
      { id: 'opt-6-c', label: 'C', title: '23,8% dalam kurun waktu empat kuartal operasional' },
      { id: 'opt-6-d', label: 'D', title: '31,4% setelah implementasi menyeluruh' },
      { id: 'opt-6-e', label: 'E', title: '35,0% pada segmen industri skala menengah ke atas' },
    ],
  },

  // 7. Pilihan Ganda Kompleks (MCMA)
  {
    id: 'q-7',
    questionNumber: 7,
    competencyBadge: 'EVALUASI DAN REFLEKSI • RELEVANSI ARGUMEN',
    type: 'pilihan-ganda-kompleks',
    instruction:
      'Pilih semua rekomendasi yang paling tepat untuk mengatasi disparitas infrastruktur telekomunikasi.',
    questionText:
      'Strategi inklusif apa sajakah yang dapat diterapkan pemangku kebijakan guna memitigasi kesenjangan digital di wilayah non-metropolitan?',
    options: [
      {
        id: 'opt-7-a',
        label: 'A',
        title: 'Perluasan jaringan transmisi backbone serat optik ke wilayah 3T',
        description:
          'Penyediaan akses konektivitas dasar berkecepatan stabil di daerah tertinggal.',
      },
      {
        id: 'opt-7-b',
        label: 'B',
        title: 'Program subsidi kuota data terarah bagi pelaku UMKM rintisan',
        description: 'Bantuan stimulus biaya operasional komunikasi bisnis daring skala mikro.',
      },
      {
        id: 'opt-7-c',
        label: 'C',
        title: 'Moratorium total terhadap pembaruan teknologi satelit komunikasi',
        description: 'Penghentian sementara peluncuran satelit orbit rendah.',
      },
      {
        id: 'opt-7-d',
        label: 'D',
        title: 'Pelatihan vokasional literasi keuangan digital terdesentralisasi',
        description: 'Pendampingan langsung tata kelola transaksi perbankan dan pencatatan kas.',
      },
    ],
  },

  // 8. Kategori Benar Salah
  {
    id: 'q-8',
    questionNumber: 8,
    competencyBadge: 'EVALUASI DAN REFLEKSI • KREDIBILITAS SUMBER',
    type: 'benar-salah',
    questionText:
      'Tentukan kebenaran dari pernyataan-pernyataan evaluatif berikut terkait karakteristik ekonomi digital Indonesia!',
    instruction:
      'Petunjuk: Tentukan Benar atau Salah untuk masing-masing pernyataan berikut berdasarkan wawasan logis dan faktual!',
    statements: [
      {
        id: 'stmt-8-a',
        label: 'A',
        statement:
          'Transformasi digital UKM hanya bergantung pada pembukaan akun di toko e-commerce tanpa perlu penyesuaian tata kelola internal.',
      },
      {
        id: 'stmt-8-b',
        label: 'B',
        statement:
          'Pencatatan keuangan berbasis komputasi awan membantu transparansi arus kas dan meningkatkan kepercayaan lembaga perbankan.',
      },
      {
        id: 'stmt-8-c',
        label: 'C',
        statement:
          'Kesiapan sumber daya manusia dalam mengoperasikan aplikasi digital sama pentingnya dengan penyediaan infrastruktur fisik.',
      },
    ],
  },

  // 9. Kategori Tepat Tidak Tepat
  {
    id: 'q-9',
    questionNumber: 9,
    competencyBadge: 'PEMAHAMAN INFERENSIAL • SINTESIS PARAGRAF',
    type: 'tepat-tidak-tepat',
    questionText:
      'Tentukan ketepatan inferensi berikut mengenai implikasi solvabilitas terhadap ketahanan bisnis UKM!',
    instruction:
      'Petunjuk: Tentukan Tepat atau Tidak Tepat untuk setiap pernyataan inferensial di bawah ini!',
    statements: [
      {
        id: 'stmt-9-a',
        label: 'A',
        statement:
          'Peningkatan solvabilitas berarti rasio kemampuan UKM dalam memenuhi kewajiban jangka panjang menjadi lebih sehat.',
      },
      {
        id: 'stmt-9-b',
        label: 'B',
        statement:
          'UKM yang tidak melakukan transformasi digital dipastikan langsung mengalami likuidasi dalam kurun satu bulan.',
      },
      {
        id: 'stmt-9-c',
        label: 'C',
        statement:
          'Integrasi cloud computing mempermudah mitigasi risiko gagal bayar melalui pencatatan beban operasional yang terukur.',
      },
    ],
  },

  // 10. Kategori Setuju Tidak Setuju
  {
    id: 'q-10',
    questionNumber: 10,
    competencyBadge: 'APRESIASI & SIKAP KRITIS • REFLEKSI PEMBACA',
    type: 'setuju-tidak-setuju',
    questionText:
      'Sebagai calon lulusan yang melek digital, bagaimana sikapmu terhadap langkah-langkah kolaborasi pentahelix dalam penguatan ekosistem digital nasional?',
    instruction:
      'Petunjuk: Tentukan Setuju atau Tidak Setuju untuk setiap pernyataan sikap berikut!',
    statements: [
      {
        id: 'stmt-10-a',
        label: 'A',
        statement:
          'Pemerintah, akademisi, komunitas, dan pelaku industri wajib bersinergi memfasilitasi sertifikasi literasi digital bagi wirausahawan muda.',
      },
      {
        id: 'stmt-10-b',
        label: 'B',
        statement:
          'Penyediaan internet murah cukup dibebankan sepenuhnya kepada inisiatif swasta tanpa keterlibatan regulasi negara.',
      },
      {
        id: 'stmt-10-c',
        label: 'C',
        statement:
          'Edukasi keamanan siber dan perlindungan data pribadi harus menjadi kurikulum esensial sejak jenjang pendidikan menengah.',
      },
    ],
  },
];
