import { Info, Zap } from 'lucide-react';
import type * as React from 'react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

export interface LearningDetailContentCardProps {
  content?: string;
  className?: string;
}

export function LearningDetailContentCard({ content, className }: LearningDetailContentCardProps) {
  // If dynamic content is provided and is long custom markdown/html text,
  // we render it. If not provided or default template, we render the exact structured
  // textbook curriculum format from the mockup.
  const hasCustomContent =
    content && content.trim().length > 30 && !content.includes('Contoh Materi');

  return (
    <Card
      className={cn(
        'p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[#E5E7EB] bg-white shadow-xs space-y-6',
        className
      )}
    >
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">Materi</h2>
        <p className="text-xs sm:text-sm text-[#546A72]">
          Area baca terstruktur disesuaikan untuk dokumen modul kurikulum CMS sekolah.
        </p>
      </div>

      <div className="border-b border-[#E5E7EB]" />

      {/* Content Body */}
      {hasCustomContent ? (
        <div className="prose max-w-none text-[#374151] leading-relaxed space-y-4 whitespace-pre-wrap text-sm sm:text-base">
          {content}
        </div>
      ) : (
        <div className="space-y-6 text-[#374151]">
          {/* 1. Pengenalan Konsep Dasar Gagasan Utama */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#111827]">
              1. Pengenalan Konsep Dasar Gagasan Utama
            </h3>
            <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
              Gagasan utama merupakan pokok pikiran atau pesan inti yang ingin disampaikan oleh
              penulis dalam sebuah paragraf atau naskah bacaan utuh. Dalam struktur teks akademik,
              gagasan pokok berfungsi sebagai fondasi logika yang mempersatukan kalimat-kalimat
              penjelasan menjadi satu kesatuan yang koheren.
            </p>
          </div>

          {/* Callout Box - Info */}
          <div className="rounded-2xl bg-[#F0F9FA] border border-[#BDEAF0] p-4 sm:p-5 flex items-start gap-3.5">
            <span className="shrink-0 size-6 rounded-full bg-[#E0F7FA] text-[#0284C7] flex items-center justify-center mt-0.5">
              <Info className="size-4" />
            </span>
            <div className="space-y-1 text-xs sm:text-sm text-[#1A4D5C] leading-relaxed">
              <span className="font-bold">Wadah Modul Fleksibel: </span>
              <span>
                Konten materi dari sekolah akan ditampilkan di area ini secara otomatis sesuai
                dengan input teks, tabel, atau kutipan bacaan yang disediakan pengajar.
              </span>
            </div>
          </div>

          {/* Penempatan Gagasan Pokok Berdasarkan Jenis Paragraf */}
          <div className="space-y-3 pt-2">
            <h4 className="text-base sm:text-lg font-bold text-[#111827]">
              Penempatan Gagasan Pokok Berdasarkan Jenis Paragraf
            </h4>
            <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
              Setiap paragraf memiliki variasi letak gagasan utama yang dapat dibedakan berdasarkan
              gaya penulisan deduktif, induktif, maupun campuran:
            </p>

            {/* Blockquote Quote */}
            <div className="border-l-4 border-[#0EA5E9] bg-[#F8FAFC] rounded-r-2xl p-4 sm:p-5 my-4">
              <blockquote className="italic text-xs sm:text-sm md:text-base text-[#334155] leading-relaxed font-serif">
                &ldquo;Pendidikan literasi bukan semata-mata kecakapan merangkai huruf dan kata,
                melainkan kemampuan berpikir kritis dalam menganalisis data, membedakan fakta dengan
                opini, serta mengambil simpulan yang berakar pada bukti empiris.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Table Komparasi Struktur Paragraf */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm sm:text-base font-bold text-[#111827]">
              Tabel Komparasi Struktur Paragraf
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#111827] font-semibold">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Tipe Paragraf</th>
                    <th className="py-3 px-4 sm:px-6">Posisi Gagasan Pokok</th>
                    <th className="py-3 px-4 sm:px-6">Karakteristik Penanda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#475569]">
                  <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#111827]">Deduktif</td>
                    <td className="py-3.5 px-4 sm:px-6">Awal Paragraf</td>
                    <td className="py-3.5 px-4 sm:px-6">
                      Pernyataan umum disusul penjelasan rinci
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#111827]">Induktif</td>
                    <td className="py-3.5 px-4 sm:px-6">Akhir Paragraf</td>
                    <td className="py-3.5 px-4 sm:px-6">
                      Rangkaian bukti khusus diakhiri simpulan umum
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#111827]">Campuran</td>
                    <td className="py-3.5 px-4 sm:px-6">Awal & Akhir Paragraf</td>
                    <td className="py-3.5 px-4 sm:px-6">
                      Pernyataan ditegaskan kembali di akhir paragraf
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Callout Box - Tip Baca Cepat */}
          <div className="rounded-2xl bg-[#F0F9FA] border border-[#BDEAF0] p-4 sm:p-5 flex items-start gap-3.5">
            <span className="shrink-0 size-6 rounded-full bg-[#E0F7FA] text-[#0284C7] flex items-center justify-center mt-0.5">
              <Zap className="size-4" />
            </span>
            <div className="space-y-1 text-xs sm:text-sm text-[#1A4D5C] leading-relaxed">
              <span className="font-bold">Poin Kunci Membaca Cepat: </span>
              <span>
                Hindari membaca kata demi kata saat memindai paragraf panjang. Fokuskan perhatian
                pada kalimat topik pertama serta kata penghubung antarkalimat seperti{' '}
                <em className="font-medium">&quot;sehingga&quot;</em>,{' '}
                <em className="font-medium">&quot;oleh sebab itu&quot;</em>, atau{' '}
                <em className="font-medium">&quot;akan tetapi&quot;</em>.
              </span>
            </div>
          </div>

          {/* Langkah-Langkah Menemukan Ide Pokok */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm sm:text-base font-bold text-[#111827]">
              Langkah-Langkah Menemukan Ide Pokok:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="shrink-0 size-7 rounded-xl bg-[#F1F5F9] text-[#1E293B] font-bold text-xs sm:text-sm flex items-center justify-center border border-[#E2E8F0]">
                  1
                </span>
                <p className="text-xs sm:text-sm text-[#374151] leading-relaxed pt-1">
                  <span className="font-bold text-[#111827]">Membaca Sepintas:</span> Dapatkan
                  gambaran umum tentang topik bahasan utama dari teks naskah.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="shrink-0 size-7 rounded-xl bg-[#F1F5F9] text-[#1E293B] font-bold text-xs sm:text-sm flex items-center justify-center border border-[#E2E8F0]">
                  2
                </span>
                <p className="text-xs sm:text-sm text-[#374151] leading-relaxed pt-1">
                  <span className="font-bold text-[#111827]">Identifikasi Subjek Pembahasan:</span>{' '}
                  Tentukan hal atau objek apa yang paling sering dibicarakan dalam tiap paragraf.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="shrink-0 size-7 rounded-xl bg-[#F1F5F9] text-[#1E293B] font-bold text-xs sm:text-sm flex items-center justify-center border border-[#E2E8F0]">
                  3
                </span>
                <p className="text-xs sm:text-sm text-[#374151] leading-relaxed pt-1">
                  <span className="font-bold text-[#111827]">Pisahkan Kalimat Pendukung:</span>{' '}
                  Kesampingkan contoh angka statistik, kutipan wawancara, atau perumpamaan penjelas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
