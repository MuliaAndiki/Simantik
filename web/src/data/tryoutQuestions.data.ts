import type { TryoutQuestionItem } from '@/types/ui';

export const DEFAULT_TRYOUT_QUESTIONS: TryoutQuestionItem[] = [
  // 01. Pilihan Ganda Biasa
  {
    id: 'tryout-q-01',
    questionNumber: 1,
    type: 'pilihan-ganda',
    instruction:
      'Petunjuk: Baca wacana secara teliti, lalu pilih satu opsi jawaban yang paling tepat dari pilihan A sampai E.',
    questionText:
      'Berdasarkan wacana ekonomi digital, manakah pernyataan berikut yang paling tepat menggambarkan fokus utama transformasi digital UKM?',
    options: [
      {
        id: 'opt-01-a',
        label: 'A',
        title: 'Semata-mata membuka toko di kanal e-commerce populer tanpa integrasi sistem.',
      },
      {
        id: 'opt-01-b',
        label: 'B',
        title:
          'Rekonfigurasi tata kelola rantai pasok dan adopsi pencatatan keuangan modern berbasis komputasi awan.',
      },
      {
        id: 'opt-01-c',
        label: 'C',
        title:
          'Menghentikan seluruh transaksi perbankan fisik dan menggantinya dengan mata uang kripto.',
      },
      {
        id: 'opt-01-d',
        label: 'D',
        title:
          'Memaksimalkan promosi media sosial tanpa mengubah mekanisme logistik dan persediaan.',
      },
      {
        id: 'opt-01-e',
        label: 'E',
        title: 'Membatasi jangkauan pasar hanya pada konsumen perkotaan berpendapatan tinggi.',
      },
    ],
    difficultyLevel: 2,
  },

  // 02. Pilihan Ganda Biasa
  {
    id: 'tryout-q-02',
    questionNumber: 2,
    type: 'pilihan-ganda',
    instruction:
      'Petunjuk: Analisis data empiris dalam teks wacana, lalu tentukan kesimpulan yang paling valid.',
    questionText:
      'Peningkatan rasio solvabilitas rata-rata sebesar 23,8% yang dialami oleh entitas bisnis mengindikasikan bahwa...',
    options: [
      {
        id: 'opt-02-a',
        label: 'A',
        title:
          'Penggunaan komputasi awan berdampak langsung pada penguatan kapasitas pemenuhan kewajiban finansial jangka panjang.',
      },
      {
        id: 'opt-02-b',
        label: 'B',
        title: 'Sektor usaha mikro tidak lagi memerlukan permodalan dari lembaga perbankan formal.',
      },
      {
        id: 'opt-02-c',
        label: 'C',
        title: 'Biaya operasional telekomunikasi mengalami penurunan drastis hingga mendekati nol.',
      },
      {
        id: 'opt-02-d',
        label: 'D',
        title:
          'Seluruh UKM di Indonesia telah berhasil mencapai target pertumbuhan ekonomi kuartalan.',
      },
    ],
    difficultyLevel: 3,
  },

  // 03. Kategori Benar Salah
  {
    id: 'tryout-q-03',
    questionNumber: 3,
    type: 'benar-salah',
    instruction:
      'Petunjuk: Tentukan kebenaran dari masing-masing pernyataan berikut berdasarkan wacana komparatif.',
    questionText:
      'Tentukan status BENAR atau SALAH untuk setiap implikasi kebijakan digitalisasi berikut:',
    statements: [
      {
        id: 'stmt-03-1',
        label: 'A',
        statement:
          'Solvabilitas usaha mengalami perbaikan terukur setelah adopsi pencatatan keuangan berbasis komputasi awan.',
      },
      {
        id: 'stmt-03-2',
        label: 'B',
        statement:
          'Disparitas infrastruktur broadband tidak mempengaruhi kecepatan ekspansi komersial antardaerah.',
      },
      {
        id: 'stmt-03-3',
        label: 'C',
        statement:
          'Literasi keuangan digital merupakan determinan krusial dalam adaptasi transaksi non-tunai.',
      },
    ],
    difficultyLevel: 3,
  },

  // 04. Pilihan Ganda Kompleks - PRESISI SESUAI REFERENSI DESAIN TryOut - Pilihan Ganda Kompleks.png
  {
    id: 'tryout-q-04',
    questionNumber: 4,
    type: 'pilihan-ganda-kompleks',
    instruction:
      'Petunjuk: Pilihlah satu atau lebih faktor yang relevan sesuai dengan konteks wacana bacaan.',
    questionText:
      'Faktor-faktor apa sajakah yang secara eksplisit dinyatakan sebagai determinan penghambat percepatan transformasi digital UKM dalam wacana?',
    options: [
      {
        id: 'opt-04-1',
        label: 'A',
        title: 'Keterbatasan pemahaman literasi perbankan digital',
        description:
          'Hambatan kompetensi adaptasi transaksi perbankan non-tunai di tingkat pelaku usaha.',
      },
      {
        id: 'opt-04-2',
        label: 'B',
        title: 'Tingginya tarif pajak ekspor produk manufaktur',
        description: 'Beban fiskal bea keluar lintas batas wilayah kepulauan.',
      },
      {
        id: 'opt-04-3',
        label: 'C',
        title: 'Disparitas ketersediaan infrastruktur jaringan telekomunikasi',
        description: 'Kesenjangan jangkauan broadband serat optik antardaerah terluar.',
      },
      {
        id: 'opt-04-4',
        label: 'D',
        title: 'Keengganan konsumen lokal berbelanja di pasar swalayan',
        description: 'Preferensi kultural terhadap pola barter fisik di pedesaan.',
      },
    ],
    difficultyLevel: 4,
  },

  // 05. Pilihan Ganda Biasa
  {
    id: 'tryout-q-05',
    questionNumber: 5,
    type: 'pilihan-ganda',
    instruction: 'Petunjuk: Tentukan makna istilah kontekstual pada kalimat bertanda.',
    questionText:
      'Kata "rekonfigurasi" dalam frasa "rekonfigurasi tata kelola rantai pasok" paling dekat maknanya dengan...',
    options: [
      {
        id: 'opt-05-a',
        label: 'A',
        title: 'Penyusunan dan penataan kembali pola alur operasional agar lebih efisien',
      },
      { id: 'opt-05-b', label: 'B', title: 'Penutupan sementara kegiatan logistik antarpulau' },
      { id: 'opt-05-c', label: 'C', title: 'Penghapusan seluruh perantara pedagang besar' },
      { id: 'opt-05-d', label: 'D', title: 'Peningkatan beban biaya administrasi pergudangan' },
      { id: 'opt-05-e', label: 'E', title: 'Penetapan harga acuan tertinggi secara sepihak' },
    ],
    difficultyLevel: 2,
  },

  // 06. Tepat Tidak Tepat
  {
    id: 'tryout-q-06',
    questionNumber: 6,
    type: 'tepat-tidak-tepat',
    instruction: 'Petunjuk: Evaluasi ketepatan rekomendasi strategis berikut.',
    questionText:
      'Tentukan apakah rekomendasi berikut TEPAT atau TIDAK TEPAT guna mengatasi kesenjangan infrastruktur digital:',
    statements: [
      {
        id: 'stmt-06-1',
        label: 'A',
        statement:
          'Memperluas jangkauan jaringan serat optik ke wilayah tertinggal, terdepan, dan terluar.',
      },
      {
        id: 'stmt-06-2',
        label: 'B',
        statement: 'Mewajibkan UKM membeli perangkat keras server berbiaya miliaran rupiah.',
      },
      {
        id: 'stmt-06-3',
        label: 'C',
        statement:
          'Menyediakan program pendampingan literasi keuangan digital terstruktur bagi pelaku usaha.',
      },
    ],
    difficultyLevel: 3,
  },

  // 07. Pilihan Ganda Biasa
  {
    id: 'tryout-q-07',
    questionNumber: 7,
    type: 'pilihan-ganda',
    instruction: 'Petunjuk: Analisis ide pokok paragraf wacana.',
    questionText: 'Gagasan utama yang mendasari wacana di atas terpusat pada...',
    options: [
      {
        id: 'opt-07-a',
        label: 'A',
        title:
          'Peluang dan tantangan struktural dalam transformasi digital pelaku UKM di Indonesia.',
      },
      {
        id: 'opt-07-b',
        label: 'B',
        title: 'Penurunan omzet pedagang pasar tradisional akibat dominasi ritel modern.',
      },
      {
        id: 'opt-07-c',
        label: 'C',
        title: 'Persaingan tarif penyedia jasa layanan seluler antarwilayah.',
      },
      {
        id: 'opt-07-d',
        label: 'D',
        title: 'Kebijakan tarif pajak pertambahan nilai transaksi elektronik.',
      },
    ],
    difficultyLevel: 3,
  },

  // 08. Pilihan Ganda Kompleks
  {
    id: 'tryout-q-08',
    questionNumber: 8,
    type: 'pilihan-ganda-kompleks',
    instruction:
      'Petunjuk: Pilihlah semua manfaat nyata dari integrasi pencatatan keuangan komputasi awan.',
    questionText:
      'Manfaat nyata yang diperoleh entitas bisnis dari pencatatan keuangan berbasis cloud mencakup:',
    options: [
      {
        id: 'opt-08-1',
        label: 'A',
        title: 'Transparansi arus kas secara real-time antardivisi operasional.',
        description: 'Laporan pemasukan dan pengeluaran terdata otomatis tanpa jeda manual.',
      },
      {
        id: 'opt-08-2',
        label: 'B',
        title: 'Akurasi rekonsiliasi perbankan yang meminimalkan human error.',
        description: 'Pencocokan mutasi rekening berjalan teratur dengan verifikasi sistem.',
      },
      {
        id: 'opt-08-3',
        label: 'C',
        title: 'Penghapusan seluruh kewajiban audit pajak oleh otoritas fiskal.',
        description: 'Pembebasan tanpa syarat dari regulasi perundang-undangan.',
      },
      {
        id: 'opt-08-4',
        label: 'D',
        title: 'Kemudahan akses pembiayaan melalui data credit scoring yang valid.',
        description: 'Lembaga keuangan dapat memverifikasi kelayakan kredit secara cepat.',
      },
    ],
    difficultyLevel: 4,
  },

  // 09. Setuju Tidak Setuju
  {
    id: 'tryout-q-09',
    questionNumber: 9,
    type: 'setuju-tidak-setuju',
    instruction: 'Petunjuk: Tentukan sikap terhadap argumen sosiologis berikut.',
    questionText:
      'Tentukan SETUJU atau TIDAK SETUJU terhadap implikasi sosial digitalisasi berikut:',
    statements: [
      {
        id: 'stmt-09-1',
        label: 'A',
        statement:
          'Pelatihan literasi digital bagi pelaku usaha senior perlu pendekatan personal dan berbasis komunitas.',
      },
      {
        id: 'stmt-09-2',
        label: 'B',
        statement:
          'Penggunaan transaksi non-tunai menurunkan nilai kepercayaan antarpenjual dan pembeli tradisional.',
      },
    ],
    difficultyLevel: 3,
  },

  // 10. Pilihan Ganda Biasa
  {
    id: 'tryout-q-10',
    questionNumber: 10,
    type: 'pilihan-ganda',
    instruction: 'Petunjuk: Pilih simpulan logis paling komprehensif.',
    questionText: 'Simpulan paling komprehensif dari keseluruhan pembahasan wacana adalah...',
    options: [
      {
        id: 'opt-10-a',
        label: 'A',
        title:
          'Digitalisasi UKM membutuhkan kolaborasi holistik antara kesiapan infrastruktur dan peningkatan kapabilitas literasi sumber daya manusia.',
      },
      {
        id: 'opt-10-b',
        label: 'B',
        title:
          'Pemerintah sebaiknya membatasi adopsi teknologi asing untuk melindungi pelaku ekonomi mikro.',
      },
      {
        id: 'opt-10-c',
        label: 'C',
        title:
          'Setiap UKM wajib mengalokasikan separuh pendapatannya untuk belanja perangkat komputasi.',
      },
      {
        id: 'opt-10-d',
        label: 'D',
        title:
          'Ekspansi pasar internasional hanya dapat dicapai melalui penjualan luring skala masif.',
      },
    ],
    difficultyLevel: 3,
  },

  // 11-30. Generate remaining questions dynamically for comprehensive 30 questions pool
  ...Array.from({ length: 20 }, (_, idx) => {
    const qNum = idx + 11;
    const isEven = qNum % 2 === 0;
    const isComplex = qNum % 3 === 0;

    if (isComplex) {
      return {
        id: `tryout-q-${qNum}`,
        questionNumber: qNum,
        type: 'pilihan-ganda-kompleks' as const,
        instruction: 'Petunjuk: Pilihlah pernyataan yang sesuai dengan kajian wacana analitis.',
        questionText: `Pada butir nomor ${qNum}, faktor manakah yang paling menentukan ketahanan operasional wirausaha muda di era revolusi industri 4.0?`,
        options: [
          {
            id: `opt-${qNum}-1`,
            label: 'A',
            title: 'Diversifikasi kanal penjualan omnichannel.',
            description: 'Memadukan gerai fisik dengan marketplace daring.',
          },
          {
            id: `opt-${qNum}-2`,
            label: 'B',
            title: 'Kemitraan logistik terintegrasi.',
            description: 'Menjamin kecepatan pengiriman barang antarkota.',
          },
          {
            id: `opt-${qNum}-3`,
            label: 'C',
            title: 'Sikap spekulatif tanpa kalkulasi risiko.',
            description: 'Mengabaikan rencana mitigasi krisis likuiditas.',
          },
          {
            id: `opt-${qNum}-4`,
            label: 'D',
            title: 'Pengelolaan hubungan pelanggan (CRM) terukur.',
            description: 'Membangun loyalitas pembeli melalui analisis kepuasan.',
          },
        ],
        difficultyLevel: (qNum % 5) + 1,
      };
    }

    if (isEven) {
      return {
        id: `tryout-q-${qNum}`,
        questionNumber: qNum,
        type: 'benar-salah' as const,
        instruction: 'Petunjuk: Tentukan status kebenaran pernyataan berikut.',
        questionText: `Analisis pernyataan nomor ${qNum} mengenai efektivitas strategi adaptif sektor riil:`,
        statements: [
          {
            id: `stmt-${qNum}-1`,
            label: 'A',
            statement: 'Efisiensi rantai pasok secara langsung menekan beban pokok penjualan.',
          },
          {
            id: `stmt-${qNum}-2`,
            label: 'B',
            statement: 'Pencatatan manual lebih akurat dibandingkan sistem otomatis terverifikasi.',
          },
        ],
        difficultyLevel: (qNum % 5) + 1,
      };
    }

    return {
      id: `tryout-q-${qNum}`,
      questionNumber: qNum,
      type: 'pilihan-ganda' as const,
      instruction: 'Petunjuk: Pilih satu opsi jawaban paling logis.',
      questionText: `Berdasarkan prinsip inferensi pada butir nomor ${qNum}, langkah mitigasi risiko bisnis yang paling krusial adalah...`,
      options: [
        {
          id: `opt-${qNum}-a`,
          label: 'A',
          title: 'Penyusunan dana cadangan operasional darurat minimal 6 bulan.',
        },
        {
          id: `opt-${qNum}-b`,
          label: 'B',
          title: 'Penambahan utang jangka pendek tanpa agunan produktif.',
        },
        {
          id: `opt-${qNum}-c`,
          label: 'C',
          title: 'Penghentian total program riset dan inovasi produk.',
        },
        {
          id: `opt-${qNum}-d`,
          label: 'D',
          title: 'Pengurangan gaji tenaga kerja inti secara sepihak.',
        },
        {
          id: `opt-${qNum}-e`,
          label: 'E',
          title: 'Penolakan terhadap adopsi sistem pembayaran non-tunai.',
        },
      ],
      difficultyLevel: (qNum % 5) + 1,
    };
  }),
];
