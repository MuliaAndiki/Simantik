export interface LegalSectionSubItem {
  id?: string;
  title: string;
  description?: string;
  points?: string[];
  note?: string;
}

export interface LegalRoleItem {
  role: string;
  description: string;
  attributes?: string[];
  note?: string;
}

export interface LegalSection {
  id: string; // e.g. "section-01"
  number: string; // e.g. "01"
  title: string;
  lead?: string;
  subsections?: LegalSectionSubItem[];
  points?: string[];
  roles?: LegalRoleItem[];
  tags?: string[];
  checks?: string[];
  contactBox?: {
    title: string;
    subtitle?: string;
    email?: string;
    website?: string;
    note?: string;
  };
  agreementBox?: {
    title: string;
    paragraphs: string[];
    warning?: string;
  };
  customNote?: string;
}

export interface LegalDocData {
  title: string;
  badge: string;
  lastUpdated: string;
  intro: {
    greeting: string;
    paragraphs: string[];
    highlightCallout?: string;
  };
  sections: LegalSection[];
  sidebarQuestion: {
    question: string;
    actionText: string;
    href: string;
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   1. KEBIJAKAN PRIVASI (20 SECTIONS - MATCHING BANTUAN.PNG & DOCS)
   ────────────────────────────────────────────────────────────────────────── */

export const PRIVACY_POLICY_DATA: LegalDocData = {
  title: 'Kebijakan Privasi SIMANTIK',
  badge: 'Kebijakan Privasi',
  lastUpdated: '10 September 2026',
  intro: {
    greeting: 'Selamat datang di SIMANTIK.',
    paragraphs: [
      'Kebijakan Privasi ini menjelaskan bagaimana SIMANTIK mengumpulkan, menggunakan, menyimpan, melindungi, dan mengelola informasi pengguna dalam penyelenggaraan layanan SIMANTIK.',
      'SIMANTIK merupakan platform pendidikan yang menyediakan materi, latihan, tryout, evaluasi kemampuan, dan rekomendasi untuk membantu siswa dalam mempersiapkan Tes Kemampuan Akademik (TKA), khususnya Bahasa Indonesia.',
    ],
    highlightCallout:
      'Dengan mengakses atau menggunakan layanan SIMANTIK, pengguna dianggap telah membaca dan memahami Kebijakan Privasi ini.',
  },
  sidebarQuestion: {
    question: 'Punya pertanyaan hukum?',
    actionText: 'Kontak',
    href: 'mailto:privasi@simantik.id',
  },
  sections: [
    {
      id: 'section-01',
      number: '01',
      title: 'Pengelola SIMANTIK',
      lead: 'SIMANTIK dikelola oleh Pengelola SIMANTIK sebagai pihak yang bertanggung jawab atas penyelenggaraan dan pengelolaan layanan pada platform.',
      customNote:
        'Dalam menjalankan layanan, SIMANTIK menerapkan pengelolaan akses berdasarkan peran pengguna. Sistem membedakan pengguna menjadi Student, Admin, dan Content Manager sesuai dengan fungsi dan kewenangan masing-masing.',
    },
    {
      id: 'section-02',
      number: '02',
      title: 'Informasi yang Dikumpulkan',
      lead: 'SIMANTIK hanya mengumpulkan dan memproses informasi yang diperlukan untuk menyediakan, menjalankan, mengamankan, dan meningkatkan layanan.',
      subsections: [
        {
          id: 'sub-2-1',
          title: '2.1 Informasi Akun',
          description: 'Informasi yang berkaitan dengan akun pengguna dapat meliputi:',
          points: [
            'nama;',
            'alamat email;',
            'informasi login;',
            'password;',
            'status akun; dan',
            'informasi yang berkaitan dengan pendaftaran akun.',
          ],
          note: 'SIMANTIK menyediakan mekanisme autentikasi berupa Login, Forgot Password, Reset Password, dan Verify OTP. Informasi autentikasi digunakan untuk memastikan bahwa hanya pengguna yang berwenang yang dapat mengakses akun dan fitur yang membutuhkan autentikasi.',
        },
        {
          id: 'sub-2-2',
          title: '2.2 Informasi Profil',
          description:
            'Pada halaman Profile, pengguna dapat mengelola informasi akun yang tersedia pada SIMANTIK. Informasi tersebut mencakup:',
          points: ['nama;', 'email;', 'informasi profil; dan', 'informasi akun.'],
          note: 'SIMANTIK menyediakan fungsi untuk mengedit profil, mengubah password, dan keluar dari akun.',
        },
        {
          id: 'sub-2-3',
          title: '2.3 Data Aktivitas dan Evaluasi',
          description:
            'Ketika menggunakan fitur latihan dan evaluasi, SIMANTIK dapat memproses informasi yang berkaitan dengan aktivitas pengguna, termasuk:',
          points: [
            'aktivitas latihan;',
            'jawaban;',
            'hasil latihan;',
            'skor;',
            'performa;',
            'kompetensi;',
            'tingkat kemampuan;',
            'kekuatan;',
            'kelemahan; dan',
            'rekomendasi.',
          ],
          note: 'Data tersebut digunakan untuk membantu pengguna memahami hasil yang diperoleh dan menentukan tindakan belajar berikutnya. Sistem evaluasi SIMANTIK dirancang untuk menampilkan kompetensi, skor, tingkat performa, status, tren, dan materi terkait.',
        },
        {
          id: 'sub-2-4',
          title: '2.4 Data Tryout',
          description:
            'SIMANTIK juga memproses informasi yang berkaitan dengan pelaksanaan tryout. Data tersebut dapat berkaitan dengan:',
          points: [
            'tryout yang diikuti;',
            'sesi tryout;',
            'jawaban;',
            'skor;',
            'hasil; dan',
            'dan informasi performa yang dihasilkan dari tryout.',
          ],
        },
      ],
    },
    {
      id: 'section-03',
      number: '03',
      title: 'Tujuan Penggunaan Informasi',
      lead: 'Informasi pengguna digunakan untuk tujuan berikut:',
      points: [
        'membuat dan mengelola akun pengguna;',
        'melakukan autentikasi pengguna;',
        'menjaga keamanan akun;',
        'menyediakan materi pembelajaran;',
        'menyediakan fitur latihan;',
        'menyediakan fitur tryout;',
        'memproses jawaban dan hasil latihan;',
        'menghasilkan evaluasi kemampuan;',
        'menampilkan informasi kompetensi;',
        'mengidentifikasi kemampuan yang perlu ditingkatkan;',
        'memberikan rekomendasi materi, latihan, atau tryout;',
        'mengelola layanan dan konten SIMANTIK;',
        'mengirimkan informasi yang berkaitan dengan layanan;',
        'menjaga keamanan dan keandalan platform; dan',
        'melakukan pengembangan serta peningkatan kualitas layanan.',
      ],
    },
    {
      id: 'section-04',
      number: '04',
      title: 'Evaluasi dan Rekomendasi',
      lead: 'SIMANTIK dapat menggunakan hasil latihan dan tryout untuk membantu memberikan gambaran mengenai kemampuan pengguna.',
      subsections: [
        {
          id: 'sub-4-1',
          title: 'Hasil evaluasi dapat mencakup informasi seperti:',
          points: [
            'skor;',
            'kompetensi;',
            'tingkat performa;',
            'tren performa;',
            'kemampuan yang sudah dikuasai;',
            'kemampuan yang perlu ditingkatkan; dan',
            'rekomendasi tindakan berikutnya.',
          ],
        },
        {
          id: 'sub-4-2',
          title: 'Rekomendasi dapat berupa:',
          points: ['materi;', 'latihan;', 'tryout; atau', 'peningkatan kompetensi tertentu.'],
        },
      ],
      customNote:
        'Tujuan dari pengolahan tersebut adalah membantu pengguna memahami hasil evaluasinya, bukan sekadar mengetahui nilai.',
    },
    {
      id: 'section-05',
      number: '05',
      title: 'Penggunaan Email',
      lead: 'Alamat email pengguna dapat digunakan untuk kebutuhan yang berkaitan dengan akun dan layanan SIMANTIK.',
      subsections: [
        {
          id: 'sub-5-1',
          title: 'Mekanisme Pengiriman Lembar Evaluasi Tryout:',
          description:
            'Dalam fitur tryout, hasil tryout dapat dikirimkan ke alamat email yang terdaftar pada akun pengguna sesuai dengan mekanisme layanan yang diterapkan. Email yang berkaitan dengan hasil tryout dapat berisi informasi seperti hasil, soal, jawaban, dan pembahasan sesuai dengan fitur yang tersedia.',
        },
      ],
      customNote:
        'Pengguna bertanggung jawab memastikan alamat email yang terdaftar pada akun merupakan alamat email yang benar dan dapat diakses.',
    },
    {
      id: 'section-06',
      number: '06',
      title: 'Akses Data oleh Pengelola',
      lead: 'SIMANTIK menerapkan pembagian akses berdasarkan peran.',
      roles: [
        {
          role: 'STUDENT',
          description:
            'Student memiliki akses terhadap data dan fitur yang berkaitan dengan akun dan aktivitasnya sendiri.',
        },
        {
          role: 'ADMIN',
          description:
            'Admin dapat mengelola data siswa sesuai dengan kewenangan yang diberikan oleh sistem. Informasi siswa yang dirancang tersedia pada halaman pengelolaan siswa meliputi:',
          attributes: [
            'nama siswa;',
            'email;',
            'tanggal pendaftaran;',
            'status;',
            'aktivitas; dan',
            'performa terbaru.',
          ],
          note: 'Akses tersebut digunakan untuk kepentingan administrasi dan pengelolaan layanan SIMANTIK.',
        },
        {
          role: 'CONTENT MANAGER',
          description:
            'Content Manager memiliki kewenangan yang berkaitan dengan pengelolaan konten SIMANTIK sesuai dengan permission yang diberikan.',
          note: 'Perbedaan kewenangan antara Admin dan Content Manager mengikuti konfigurasi hak akses yang diterapkan pada sistem.',
        },
      ],
    },
    {
      id: 'section-07',
      number: '07',
      title: 'Keamanan Informasi',
      lead: 'SIMANTIK berupaya melindungi informasi pengguna dari akses, penggunaan, perubahan, pengungkapan, atau pengelolaan yang tidak sah.',
      customNote:
        'Upaya perlindungan dilakukan melalui penerapan mekanisme keamanan pada akun dan pembatasan akses berdasarkan peran. SIMANTIK juga menyediakan mekanisme untuk menangani kondisi seperti akun tidak aktif, kredensial yang tidak valid, serta kesalahan autentikasi.',
      checks: [
        'menjaga kerahasiaan password;',
        'tidak memberikan informasi login kepada orang lain;',
        'menggunakan perangkat yang aman;',
        'segera melaporkan aktivitas akun yang mencurigakan kepada Pengelola SIMANTIK.',
      ],
    },
    {
      id: 'section-08',
      number: '08',
      title: 'Informasi untuk Pengguna di Bawah Umur',
      lead: 'SIMANTIK ditujukan untuk siswa SMA sehingga layanan dapat digunakan oleh pengguna yang belum berusia 18 tahun.',
      customNote:
        'Pengelola SIMANTIK memahami bahwa informasi yang berkaitan dengan pengguna di bawah umur memerlukan perhatian dan perlindungan yang lebih tinggi.\n\nSIMANTIK berupaya membatasi pengumpulan dan penggunaan informasi sesuai dengan kebutuhan layanan serta menerapkan akses berdasarkan kewenangan pengguna.\n\nApabila diperlukan persetujuan orang tua atau wali berdasarkan usia pengguna, cara pendaftaran, atau ketentuan yang berlaku, mekanisme tersebut akan diterapkan sesuai dengan kebijakan dan prosedur Pengelola SIMANTIK.',
      subsections: [
        {
          id: 'sub-8-1',
          title: 'Pertanyaan Orang Tua atau Wali:',
          description:
            'Orang tua atau wali yang memiliki pertanyaan mengenai penggunaan informasi anak dapat menghubungi Pengelola SIMANTIK melalui kontak yang tersedia pada bagian Hubungi Kami.',
        },
      ],
    },
    {
      id: 'section-09',
      number: '09',
      title: 'Konten Publik',
      lead: 'SIMANTIK menyediakan sejumlah halaman yang dapat diakses oleh masyarakat tanpa harus masuk ke akun. Konten publik dapat mencakup:',
      tags: [
        'Beranda',
        'Tentang SIMANTIK',
        'Materi',
        'Berita',
        'Dokumentasi',
        'Testimoni',
        'Tutorial',
      ],
      customNote:
        'Konten yang telah dipublikasikan dapat diakses oleh pengunjung sesuai dengan status publikasinya.',
    },
    {
      id: 'section-10',
      number: '10',
      title: 'Testimoni',
      lead: 'SIMANTIK dapat menampilkan testimonial pada halaman publik. Apabila testimonial digunakan, informasi yang dapat ditampilkan antara lain:',
      points: [
        'nama;',
        'peran atau deskripsi;',
        'isi testimonial;',
        'foto; dan',
        'status publikasi.',
      ],
      customNote:
        'Informasi testimonial yang ditampilkan kepada publik akan digunakan sesuai dengan tujuan publikasi testimonial tersebut.',
    },
    {
      id: 'section-11',
      number: '11',
      title: 'Berita, Dokumentasi, dan Tutorial',
      lead: 'SIMANTIK menyediakan konten publik yang dikelola melalui Content Management System. Konten tersebut mencakup:',
      points: ['News;', 'Documentation;', 'Testimonials; dan', 'Tutorials.'],
      customNote:
        'Informasi yang berkaitan dengan konten seperti judul, isi, thumbnail, penulis, tanggal publikasi, dan status dapat dikelola oleh pihak yang memiliki kewenangan.',
    },
    {
      id: 'section-12',
      number: '12',
      title: 'Cookie dan Teknologi Serupa',
      lead: 'SIMANTIK dapat menggunakan cookie atau teknologi serupa yang diperlukan untuk menjalankan fungsi website dan menjaga sesi pengguna. Cookie atau teknologi serupa dapat digunakan untuk kebutuhan seperti:',
      points: [
        'menjaga sesi login;',
        'mendukung keamanan;',
        'mempertahankan fungsi tertentu;',
        'membantu layanan berjalan lancar.',
      ],
      customNote: 'Penggunaan cookie akan disesuaikan dengan kebutuhan teknis SIMANTIK.',
    },
    {
      id: 'section-13',
      number: '13',
      title: 'Penyimpanan Informasi',
      lead: 'Informasi pengguna disimpan selama diperlukan untuk:',
      points: [
        'menyediakan layanan;',
        'menjalankan fungsi akun;',
        'menjalankan fitur latihan dan evaluasi;',
        'menjaga keamanan sistem;',
        'memenuhi kebutuhan operasional; dan',
        'memenuhi kewajiban yang berlaku.',
      ],
      customNote:
        'Data tidak akan disimpan lebih lama dari yang diperlukan untuk tujuan penggunaannya, kecuali terdapat alasan yang sah atau kewajiban yang mengharuskan penyimpanan lebih lama. Periode penyimpanan spesifik untuk masing-masing jenis data mengikuti kebijakan operasional dan teknis Pengelola SIMANTIK.',
    },
    {
      id: 'section-14',
      number: '14',
      title: 'Perubahan atau Pembaruan Informasi',
      lead: 'Pengguna dapat memperbarui informasi profil yang tersedia melalui fitur Profile.',
      customNote:
        'SIMANTIK menyediakan fungsi Edit Profile dan Change Password sebagai bagian dari pengelolaan akun pengguna.\n\nApabila pengguna menemukan informasi yang tidak benar atau tidak sesuai, pengguna dapat menghubungi Pengelola SIMANTIK untuk mendapatkan bantuan sesuai dengan prosedur yang berlaku.',
    },
    {
      id: 'section-15',
      number: '15',
      title: 'Permintaan Pengguna atas Informasi Pribadi',
      lead: 'Pengguna dapat menghubungi Pengelola SIMANTIK untuk mengajukan pertanyaan atau permintaan yang berkaitan dengan informasi pribadinya. Permintaan dapat berkaitan dengan:',
      points: [
        'informasi mengenai data yang dikelola;',
        'koreksi informasi yang tidak sesuai;',
        'pertanyaan mengenai penggunaan informasi;',
        'keamanan akun; atau',
        'hal lain yang berkaitan dengan privasi pengguna.',
      ],
      customNote:
        'Setiap permintaan akan diproses dengan mempertimbangkan keamanan, identitas pemohon, hak pengguna lain, serta ketentuan yang berlaku.',
    },
    {
      id: 'section-16',
      number: '16',
      title: 'Penghapusan Akun dan Data',
      lead: 'Penghapusan akun atau data pengguna dilakukan sesuai dengan mekanisme yang ditetapkan oleh Pengelola SIMANTIK.',
      customNote:
        'Permintaan penghapusan data dapat diajukan melalui kontak resmi SIMANTIK.\n\nPenghapusan data tidak selalu dapat dilakukan secara langsung apabila data tersebut masih diperlukan untuk tujuan keamanan, administrasi, penyelesaian sengketa, pemenuhan kewajiban hukum, atau tujuan lain yang diperbolehkan berdasarkan ketentuan yang berlaku.',
    },
    {
      id: 'section-17',
      number: '17',
      title: 'Tautan ke Situs atau Layanan Lain',
      lead: 'SIMANTIK dapat menyediakan tautan menuju situs atau layanan pihak lain.',
      customNote:
        'Apabila pengguna mengakses layanan eksternal tersebut, penggunaan informasi pengguna akan mengikuti kebijakan privasi dan ketentuan masing-masing pihak.\n\nPengelola SIMANTIK tidak bertanggung jawab atas kebijakan privasi atau praktik pengelolaan informasi yang diterapkan oleh situs atau layanan eksternal yang berada di luar kendali SIMANTIK.',
    },
    {
      id: 'section-18',
      number: '18',
      title: 'Perubahan Kebijakan Privasi',
      lead: 'Pengelola SIMANTIK dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu apabila terdapat perubahan pada:',
      points: [
        'fitur SIMANTIK;',
        'layanan;',
        'teknologi;',
        'cara pengelolaan informasi;',
        'kebutuhan keamanan; atau',
        'ketentuan yang berlaku.',
      ],
      customNote:
        'Tanggal "Terakhir diperbarui" pada bagian awal kebijakan akan diperbarui apabila terdapat perubahan. Pengguna disarankan untuk membaca Kebijakan Privasi secara berkala agar mengetahui perubahan yang berlaku.',
    },
    {
      id: 'section-19',
      number: '19',
      title: 'Hubungi Kami',
      lead: 'Jika pengguna memiliki pertanyaan, permintaan, atau keluhan mengenai Kebijakan Privasi atau pengelolaan informasi pribadi di SIMANTIK, pengguna dapat menghubungi:',
      contactBox: {
        title: 'Pengelola SIMANTIK',
        subtitle: 'Layanan Bantuan Akun & Perlindungan Privasi',
        email: 'privasi@simantik.id',
        website: 'https://simantik.id',
        note: 'Pengelola SIMANTIK akan menangani pertanyaan atau permintaan yang berkaitan dengan privasi sesuai dengan prosedur yang berlaku.',
      },
    },
    {
      id: 'section-20',
      number: '20',
      title: 'Persetujuan',
      agreementBox: {
        title: 'Konfirmasi Pemahaman Layanan',
        paragraphs: [
          'Dengan menggunakan SIMANTIK, pengguna menyatakan bahwa pengguna telah membaca dan memahami Kebijakan Privasi ini.',
          'Pengguna juga memahami bahwa informasi dapat diproses sebagaimana dijelaskan dalam Kebijakan Privasi ini untuk menyediakan dan menjalankan layanan SIMANTIK.',
        ],
        warning:
          'Apabila pengguna tidak menyetujui ketentuan dalam Kebijakan Privasi ini, pengguna dapat berhenti menggunakan layanan SIMANTIK.',
      },
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
   2. SYARAT & KETENTUAN (14 SECTIONS - SUMMARIZED FROM DOCS/ BUSINESS RULES)
   ────────────────────────────────────────────────────────────────────────── */

export const TERMS_OF_SERVICE_DATA: LegalDocData = {
  title: 'Syarat & Ketentuan Layanan SIMANTIK',
  badge: 'Syarat & Ketentuan',
  lastUpdated: '10 September 2026',
  intro: {
    greeting: 'Selamat datang di Platform SIMANTIK.',
    paragraphs: [
      'Syarat dan Ketentuan ini mengatur hak, kewajiban, serta batasan hukum bagi setiap individu atau pihak yang mengakses, mendaftar, atau menggunakan layanan platform SIMANTIK.',
      'SIMANTIK diselenggarakan khusus sebagai ekosistem pembelajaran adaptif, bank soal berstandar kompetensi, dan simulasi asesmen Tes Kemampuan Akademik (TKA) Bahasa Indonesia untuk jenjang SMA/SMK.',
    ],
    highlightCallout:
      'Dengan mendaftar akun atau menggunakan fitur SIMANTIK, Anda menyetujui untuk terikat secara hukum pada seluruh Syarat dan Ketentuan ini.',
  },
  sidebarQuestion: {
    question: 'Butuh kejelasan legal?',
    actionText: 'Bantuan',
    href: 'mailto:legal@simantik.id',
  },
  sections: [
    {
      id: 'section-01',
      number: '01',
      title: 'Definisi & Ruang Lingkup Layanan',
      lead: 'Dalam dokumen Syarat & Ketentuan ini, istilah-istilah di bawah ini memiliki arti sebagaimana didefinisikan:',
      points: [
        '"SIMANTIK" merujuk pada platform teknologi web penyedia materi edukasi, latihan soal terstruktur, tryout adaptif, dan sistem evaluasi kemampuan TKA Bahasa Indonesia;',
        '"Pengguna" adalah setiap individu yang mengakses platform, baik sebagai Student, Guru/Pendamping, Admin, maupun Content Manager;',
        '"Layanan" mencakup akses modul pembelajaran, pengerjaan latihan, simulasi tryout berbasis batas waktu, evaluasi rapor kompetensi, dan lembar pembahasan;',
        '"Bank Soal" adalah kumpulan instrumen asesmen yang telah dikurasi dan dipetakan ke dalam sub-kompetensi TKA.',
      ],
    },
    {
      id: 'section-02',
      number: '02',
      title: 'Kelayakan & Akun Pengguna',
      lead: 'Pendaftaran dan kepemilikan akun diatur dengan kriteria ketat demi menjamin validitas hasil evaluasi belajar:',
      points: [
        'Layanan Student ditujukan bagi siswa SMA/SMK atau calon peserta ujian TKA yang membutuhkan persiapan akademis;',
        'Setiap pengguna wajib memberikan informasi pendaftaran yang benar, akurat, dan dapat diverifikasi (termasuk nama lengkap dan alamat email aktif);',
        'Satu siswa hanya diperkenankan memiliki 1 (satu) akun resmi terdaftar agar rekam jejak penilaian dan riwayat performa tidak terdistorsi;',
        'Akun bersifat personal dan dilarang dipindahtangankan, dialihkan, atau dipinjamkan kepada pihak ketiga.',
      ],
    },
    {
      id: 'section-03',
      number: '03',
      title: 'Kredensial, Sandi, & Verifikasi OTP',
      lead: 'Pengguna bertanggung jawab penuh atas keamanan kredensial akun pribadinya:',
      points: [
        'Mekanisme pendaftaran dan pemulihan sandi mewajibkan verifikasi kode OTP (One-Time Password) yang dikirimkan ke email terdaftar;',
        'Kode OTP bersifat rahasia dan memiliki masa kedaluwarsa terbatas. Dilarang membagikan OTP kepada siapa pun, termasuk pihak yang mengatasnamakan SIMANTIK;',
        'Pengguna wajib segera menghubungi Pengelola SIMANTIK jika menemukan indikasi peretasan, kebocoran sandi, atau akses tidak sah pada akun.',
      ],
    },
    {
      id: 'section-04',
      number: '04',
      title: 'Integritas Akademik & Larangan Kecurangan',
      lead: 'SIMANTIK memegang teguh prinsip objektivitas dan kejujuran dalam setiap simulasi ujian.',
      customNote:
        'Pengguna dilarang keras melakukan tindakan yang mencemari integritas asesmen, termasuk namun tidak terbatas pada:\n\n• Menggunakan skrip otomatis, bot, crawler, atau ekstensi peramban ilegal untuk memanipulasi pengerjaan ujian;\n• Menggandakan, memotret, merekam, atau menyebarluaskan butir soal tryout ke forum publik atau media sosial;\n• Memanfaatkan celah sistem (exploit/bug) untuk mengubah kunci jawaban atau waktu pengerjaan;\n• Menggunakan joki ujian atau bantuan pihak ketiga selama sesi tryout berlangsung.',
      checks: [
        'pengerjaan dilakukan secara mandiri oleh pemilik akun;',
        'mematuhi instruksi pengerjaan pada masing-masing paket soal;',
        'tidak mendistribusikan materi hak cipta milik SIMANTIK tanpa izin.',
      ],
    },
    {
      id: 'section-05',
      number: '05',
      title: 'Ketentuan Pengerjaan Tryout & Aturan Waktu (Timer)',
      lead: 'Sistem Tryout SIMANTIK diatur oleh aturan teknis ketat (BR-TRYOUT) untuk menjaga standar ujian nasional:',
      subsections: [
        {
          id: 'sub-5-1',
          title: '5.1 Server sebagai Source of Truth',
          description:
            'Waktu mulai (start time), batas kedaluwarsa (expires at), dan sisa waktu pengerjaan dihitung dan divalidasi secara terpusat oleh Server Backend SIMANTIK. Perubahan jam sistem atau manipulasi JavaScript pada peramban pengguna tidak akan memengaruhi sisa waktu nyata di server.',
        },
        {
          id: 'sub-5-2',
          title: '5.2 Batas Waktu & Auto-Submit',
          description:
            'Tryout memiliki batas waktu tertentu (misal: 30 soal dalam durasi 75 menit). Ketika sisa waktu di server mencapai 00:00, sistem secara otomatis mengunci lembar jawaban dan melakukan auto-submit terhadap seluruh jawaban yang tersimpan.',
        },
        {
          id: 'sub-5-3',
          title: '5.3 Ketahanan Gangguan Koneksi (Session Recovery)',
          description:
            'Jika terjadi gangguan jaringan, peramban tertutup, atau gawai mati mendadak saat sesi tryout masih berjalan, siswa dapat masuk kembali selama durasi pengerjaan belum kedaluwarsa. Jawaban yang telah terkirim ke server tetap aman tersimpan.',
        },
      ],
    },
    {
      id: 'section-06',
      number: '06',
      title: 'Sistem Penilaian & Rapor Evaluasi Kemampuan',
      lead: 'Pemrosesan skor dan analisis kompetensi mengikuti kaidah evaluasi akademik SIMANTIK (BR-EVAL & BR-SCORE):',
      points: [
        'Skor dihitung secara objektif berdasarkan kunci jawaban terverifikasi dan bobot model asesmen (seperti Item Response Theory / IRT jika diaktifkan);',
        'Evaluasi mengelompokkan capaian belajar ke dalam kompetensi kunci: Pemahaman Tekstual, Pemahaman Inferensial, dan Evaluasi/Apresiasi;',
        'Hasil yang sudah disubmit bersifat final dan tidak dapat diubah kembali oleh siswa demi konsistensi data riwayat belajar;',
        'Sistem akan menyajikan rekomendasi materi spesifik berdasarkan indikator kelemahan yang terdeteksi pada hasil evaluasi.',
      ],
    },
    {
      id: 'section-07',
      number: '07',
      title: 'Hak Kekayaan Intelektual (HAKI)',
      lead: 'Seluruh materi, struktur kurikulum, dan perangkat lunak dilindungi oleh undang-undang hak cipta Republik Indonesia.',
      customNote:
        'Semua butir soal, teks stimulus sastra/non-sastra, modul materi, video tutorial, kode sumber aplikasi, logo, dan identitas visual SIMANTIK adalah hak cipta eksklusif Pengelola SIMANTIK atau pemberi lisensi resminya.\n\nPengguna hanya diberikan lisensi non-eksklusif, terbatas, dan tidak dapat dipindahtangankan semata-mata untuk tujuan belajar pribadi.',
    },
    {
      id: 'section-08',
      number: '08',
      title: 'Konten Publik & Ulasan Pengguna',
      lead: 'Pengguna yang memberikan testimoni, ulasan, atau saran pengembangan menyetujui ketentuan berikut:',
      points: [
        'Testimoni yang dikirimkan dapat ditampilkan pada halaman beranda atau materi informasi publik SIMANTIK;',
        'Pengelola SIMANTIK berhak menyunting tata bahasa atau menghapus ulasan yang mengandung unsur SARA, ujaran kebencian, atau promosi ilegal;',
        'Pemberian testimoni bersifat sukarela dan tidak menimbulkan klaim royalti atau kompensasi finansial.',
      ],
    },
    {
      id: 'section-09',
      number: '09',
      title: 'Layanan Pihak Ketiga & Integrasi OAuth',
      lead: 'SIMANTIK dapat mengintegrasikan fasilitas login pihak ketiga (seperti Masuk dengan Akun Google / OAuth) serta layanan pengiriman email transaksional:',
      points: [
        'Penggunaan layanan pihak ketiga tunduk pada syarat layanan masing-masing penyedia (contoh: Google API Services);',
        'SIMANTIK tidak bertanggung jawab atas kendala ketersediaan layanan otentikasi eksternal di luar kendali teknis platform.',
      ],
    },
    {
      id: 'section-10',
      number: '10',
      title: 'Batasan Tanggung Jawab & Jaminan Layanan',
      lead: 'SIMANTIK berkomitmen menyediakan platform belajar yang stabil dan akurat dengan batasan wajar:',
      points: [
        'Platform disediakan atas dasar "sebagaimana adanya" (as is) dan "sebagaimana tersedia" (as available);',
        'SIMANTIK tidak menjamin bahwa layanan akan bebas dari interupsi sementara akibat pemeliharaan rutin server atau kendala penyedia internet pengguna;',
        'Hasil tryout pada SIMANTIK merupakan indikator simulasi belajar dan bukan jaminan mutlak kelulusan siswa pada seleksi resmi pemerintah/universitas.',
      ],
    },
    {
      id: 'section-11',
      number: '11',
      title: 'Penangguhan, Pembatasan, & Penghentian Akun',
      lead: 'Pengelola SIMANTIK berhak menonaktifkan atau memblokir akses akun pengguna sewaktu-waktu apabila ditemukan:',
      points: [
        'Pelanggaran terhadap integritas tryout atau pembajakan soal;',
        'Penyalahgunaan celah keamanan atau serangan penolakan layanan (DoS/DDoS);',
        'Pemberian data identitas palsu saat pendaftaran;',
        'Instruksi dari otoritas hukum yang berwenang.',
      ],
    },
    {
      id: 'section-12',
      number: '12',
      title: 'Pembaruan Syarat & Ketentuan',
      lead: 'Pengelola berhak memperbarui klausul Syarat & Ketentuan ini sewaktu-waktu sesuai perkembangan fitur atau regulasi hukum yang berlaku.',
      customNote:
        'Pembaruan akan diumumkan melalui pembaruan tanggal efektif di halaman ini atau notifikasi pada platform. Keikutsertaan pengguna yang berlanjut setelah tanggal perubahan menandakan persetujuan penuh terhadap ketentuan yang diperbarui.',
    },
    {
      id: 'section-13',
      number: '13',
      title: 'Hukum yang Berlaku & Penyelesaian Sengketa',
      lead: 'Syarat & Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Negara Kesatuan Republik Indonesia.',
      customNote:
        'Segala perselisihan atau sengketa yang timbul sehubungan dengan penggunaan platform SIMANTIK akan diselesaikan terlebih dahulu melalui musyawarah untuk mufakat. Apabila tidak tercapai mufakat, perselisihan akan diselesaikan melalui yurisdiksi pengadilan negeri yang berwenang di wilayah hukum domisili Pengelola SIMANTIK.',
    },
    {
      id: 'section-14',
      number: '14',
      title: 'Persetujuan Ketentuan Layanan',
      agreementBox: {
        title: 'Pernyataan Kesepakatan Hukum',
        paragraphs: [
          'Dengan menekan tombol pendaftaran atau terus menggunakan fitur pada platform SIMANTIK, Anda menegaskan bahwa Anda telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini tanpa syarat.',
        ],
        warning:
          'Jika Anda tidak menyetujui salah satu butir ketentuan dalam dokumen ini, mohon untuk tidak melanjutkan proses pendaftaran atau segera berhenti menggunakan platform SIMANTIK.',
      },
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
   3. PUSAT BANTUAN & FAQ (10 SECTIONS - SUMMARIZED FROM DOCS/ USER EXPERIENCE)
   ────────────────────────────────────────────────────────────────────────── */

export const HELP_CENTER_DATA: LegalDocData = {
  title: 'Pusat Bantuan & Panduan SIMANTIK',
  badge: 'Pusat Bantuan',
  lastUpdated: '10 September 2026',
  intro: {
    greeting: 'Butuh bantuan seputar penggunaan platform SIMANTIK?',
    paragraphs: [
      'Halaman Pusat Bantuan menyajikan panduan lengkap, langkah praktis penggunaan fitur, dan solusi atas kendala yang sering ditemui oleh siswa maupun guru pendamping.',
      'Pelajari cara mendaftar akun, memahami 3 pilar kompetensi TKA Bahasa Indonesia, memaksimalkan latihan soal, serta membaca laporan evaluasi kemampuan belajar Anda.',
    ],
    highlightCallout:
      'Cari jawaban cepat di bawah ini atau hubungi tim pengelola jika Anda memerlukan panduan interaktif lebih lanjut.',
  },
  sidebarQuestion: {
    question: 'Belum menemukan jawaban?',
    actionText: 'Hubungi Kami',
    href: '#section-10',
  },
  sections: [
    {
      id: 'section-01',
      number: '01',
      title: 'Memulai Akun & Pendaftaran (Registrasi)',
      lead: 'Panduan langkah awal membuat akun siswa dan memulai persiapan ujian di SIMANTIK:',
      subsections: [
        {
          id: 'sub-1-1',
          title: 'Bagaimana cara mendaftar akun siswa?',
          description:
            'Kunjungi halaman Registrasi, masukkan nama lengkap, alamat email aktif, dan kata sandi yang kuat. Anda juga dapat menggunakan opsi cepat "Masuk dengan Google" untuk integrasi instan.',
        },
        {
          id: 'sub-1-2',
          title: 'Apa fungsi kode OTP saat mendaftar atau reset sandi?',
          description:
            'OTP (One-Time Password) berupa 6 digit angka dikirimkan ke email Anda untuk memastikan validitas kepemilikan email dan mencegah registrasi palsu. Masukkan kode tersebut pada layar Verifikasi OTP dalam batas waktu 5 menit.',
        },
        {
          id: 'sub-1-3',
          title: 'Tidak menerima email kode OTP?',
          description:
            'Periksa folder Spam/Junk pada email Anda. Jika masih belum masuk setelah 60 detik, tekan tombol "Kirim Ulang Kode OTP" di halaman verifikasi.',
        },
      ],
    },
    {
      id: 'section-02',
      number: '02',
      title: 'Materi Pembelajaran TKA Bahasa Indonesia',
      lead: 'Struktur materi pada SIMANTIK dirancang khusus mengacu pada standar resmi Tes Kemampuan Akademik (TKA) Bahasa Indonesia:',
      subsections: [
        {
          id: 'sub-2-1',
          title: 'Tiga Kompetensi Utama Pembelajaran',
          points: [
            'Pemahaman Tekstual: Menemukan gagasan pokok, arti kata dalam konteks, fakta tersurat, dan ide penjelas;',
            'Pemahaman Inferensial: Menarik simpulan logis, menganalisis sebab-akibat, memprediksi kelanjutan teks, dan menangkap maksud tersirat;',
            'Evaluasi dan Apresiasi: Menilai efektivitas argumen, akurasi fakta vs opini, nada penulis, serta gaya bahasa sastra/non-sastra.',
          ],
        },
        {
          id: 'sub-2-2',
          title: 'Bagaimana cara mengakses modul materi?',
          description:
            'Buka menu "Materi" dari dashboard atau halaman publik. Anda dapat memfilter modul berdasarkan tingkat kelas (SMA/SMK) atau topik kompetensi spesifik yang ingin diperdalam.',
        },
      ],
    },
    {
      id: 'section-03',
      number: '03',
      title: 'Fitur Latihan Soal & Pembahasan Mandiri',
      lead: 'Latihan mandiri memungkinkan siswa mengasah pemahaman sebelum mengikuti simulasi ujian bertarget waktu:',
      subsections: [
        {
          id: 'sub-3-1',
          title: 'Apa perbedaan Latihan Soal dengan Tryout?',
          description:
            'Pada Latihan Soal, tidak ada batasan waktu ketat dan kunci pembahasan langsung tersedia setelah Anda menjawab tiap butir. Sedangkan Tryout menerapkan batas waktu simulasi resmi (countdown timer) dan pembahasannya dirilis setelah sesi submit.',
        },
        {
          id: 'sub-3-2',
          title: 'Tipe-tipe soal yang didukung',
          points: [
            'Pilihan Ganda Tunggal (Single Choice A-B-C-D-E);',
            'Pilihan Ganda Kompleks / Multi-Select (MCMA);',
            'Kategori Pernyataan Tepat/Tidak Tepat atau Benar/Salah.',
          ],
        },
      ],
    },
    {
      id: 'section-04',
      number: '04',
      title: 'Pelaksanaan Tryout Adaptif & Simulasi Ujian',
      lead: 'Tryout dirancang menyerupai kondisi ujian riil untuk melatih mental dan manajemen waktu:',
      subsections: [
        {
          id: 'sub-4-1',
          title: 'Berapa durasi dan jumlah soal dalam satu sesi Tryout?',
          description:
            'Sesuai standar TKA, konfigurasi baseline adalah 30 butir soal dengan durasi 75 menit. Setiap paket tryout memiliki deskripsi jumlah butir soal dan petunjuk pengerjaan di layar awal.',
        },
        {
          id: 'sub-4-2',
          title: 'Navigasi soal dan penanda ragu-ragu',
          description:
            'Lembar ujian dilengkapi kisi-kisi nomor soal. Nomor yang sudah dijawab akan ditandai dengan warna teal/hijau, nomor yang belum dijawab berwarna netral, dan Anda dapat berpindah butir soal kapan saja.',
        },
      ],
    },
    {
      id: 'section-05',
      number: '05',
      title: 'Aturan Timer & Penguncian Otomatis (Auto-Submit)',
      lead: 'Penjelasan mekanisme waktu yang berlaku pada ruang ujian SIMANTIK:',
      subsections: [
        {
          id: 'sub-5-1',
          title: 'Bagaimana jika waktu ujian habis sebelum saya menekan Submit?',
          description:
            'Sistem backend SIMANTIK memantau kedaluwarsa sesi secara realtime. Ketika waktu 00:00 tercapai, sistem secara otomatis mengeksekusi auto-submit. Seluruh jawaban yang telah dipilih akan tetap tersimpan dan dinilai.',
        },
        {
          id: 'sub-5-2',
          title: 'Apakah timer berhenti jika saya me-refresh halaman browser?',
          description:
            'Tidak. Waktu dihitung berdasarkan jam server (Server as Source of Truth). Me-refresh tab atau menutup peramban tidak akan memperpanjang sisa waktu ujian.',
        },
      ],
    },
    {
      id: 'section-06',
      number: '06',
      title: 'Pemulihan Sesi Ujian (Session Recovery) & Koneksi',
      lead: 'Panduan jika Anda menghadapi kendala jaringan saat tryout sedang berlangsung:',
      subsections: [
        {
          id: 'sub-6-1',
          title: 'Apa yang harus dilakukan jika laptop restart atau internet mati?',
          description:
            'Jangan panik. Buka kembali peramban Anda, masuk ke SIMANTIK, dan buka halaman Tryout. Sistem akan mendeteksi sesi aktif Anda dan menampilkan tombol "Lanjutkan Ujian" dengan seluruh jawaban terakhir yang berhasil disinkronkan.',
        },
        {
          id: 'sub-6-2',
          title: 'Status indikator penyimpanan jawaban',
          description:
            'Setiap kali Anda mengklik opsi jawaban, sistem menampilkan indikator status "Tersimpan" di sudut layar. Pastikan indikator berwarna hijau sebelum melanjutkan ke soal berikutnya.',
        },
      ],
    },
    {
      id: 'section-07',
      number: '07',
      title: 'Hasil Ujian, Skor IRT, & Pengiriman Lembar Evaluasi',
      lead: 'Membaca dan menerima rekap hasil asesmen setelah menyelesaikan tryout:',
      subsections: [
        {
          id: 'sub-7-1',
          title: 'Kapan hasil nilai dan pembahasan keluar?',
          description:
            'Segera setelah sesi tryout Anda disubmit, sistem akan melakukan kalkulasi skor dan membuka lembar hasil lengkap beserta pembahasan per butir soal.',
        },
        {
          id: 'sub-7-2',
          title: 'Pengiriman lembar evaluasi ke email',
          description:
            'Sesuai ketentuan layanan SIMANTIK, ringkasan rapor capaian tryout juga akan dikirimkan otomatis ke alamat email akun Anda sebagai arsip portofolio belajar.',
        },
      ],
    },
    {
      id: 'section-08',
      number: '08',
      title: 'Rapor Kompetensi & Rekomendasi Belajar Personal',
      lead: 'Memanfaatkan analitik belajar SIMANTIK untuk mendongkrak nilai ujian:',
      subsections: [
        {
          id: 'sub-8-1',
          title: 'Bagaimana SIMANTIK menganalisis kelemahan saya?',
          description:
            'Sistem memetakan setiap jawaban salah ke sub-kompetensi terkait. Di halaman Evaluasi, Anda akan melihat grafik persentase penguasaan, indikator kompetensi terkuat, dan kompetensi yang mendesak untuk diperbaiki.',
        },
        {
          id: 'sub-8-2',
          title: 'Fungsi rekomendasi otomatis',
          description:
            'Di bawah grafik performa, SIMANTIK secara otomatis menampilkan daftar kartu modul dan paket latihan yang direkomendasikan khusus untuk menutup celah kelemahan Anda.',
        },
      ],
    },
    {
      id: 'section-09',
      number: '09',
      title: 'Pengaturan Profil & Keamanan Kata Sandi',
      lead: 'Mengelola informasi akun siswa Anda secara mandiri:',
      subsections: [
        {
          id: 'sub-9-1',
          title: 'Mengubah nama atau informasi profil',
          description:
            'Masuk ke halaman Profil Pengguna melalui menu avatar di pojok kanan atas. Anda dapat memperbarui nama tampilan dan data asal sekolah.',
        },
        {
          id: 'sub-9-2',
          title: 'Lupa kata sandi saat hendak masuk',
          description:
            'Klik tautan "Lupa kata sandi?" di layar Login. Masukkan alamat email akun Anda, dan ikuti instruksi pengiriman kode OTP verifikasi untuk mengatur ulang kata sandi baru.',
        },
      ],
    },
    {
      id: 'section-10',
      number: '10',
      title: 'Hubungi Tim Dukungan & Layanan Pengaduan',
      lead: 'Jika Anda memerlukan bantuan langsung dari tim teknis atau pengelola platform SIMANTIK:',
      contactBox: {
        title: 'Pusat Bantuan & Pengaduan SIMANTIK',
        subtitle: 'Waktu Operasional: Senin - Jumat (08.00 - 17.00 WIB)',
        email: 'bantuan@simantik.id',
        website: 'https://simantik.id',
        note: 'Sertakan informasi alamat email akun dan tangkapan layar (screenshot) kendala untuk mempercepat proses investigasi oleh tim dukungan.',
      },
    },
  ],
};
