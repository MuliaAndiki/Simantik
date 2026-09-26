'use client';

import Link from 'next/link';
import { NewsUpdateCard } from '@/components/molecules/student/NewsUpdateCard';
import { themeConfig } from '@/configs/theme.config';
import NavLayout from '@/core/layouts/nav.layout';
import { useTheme } from '@/core/providers/theme.provider';
import { useApi } from '@/hooks/useApi';

export default function ContainerHome() {
  const { theme } = useTheme();
  const { content } = useApi();

  const { data: newsData } = content.query.news({ limit: 3 });
  const { data: testimonialsData } = content.query.testimonials({ limit: 4 });

  return (
    <NavLayout>
      <main className={`min-h-screen bg-[${themeConfig[theme].primary.background}] pb-20`}>
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 pt-24 pb-16 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Persiapan <span className="text-teal-600">Terbaik</span> Untuk Masa Depanmu
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            SIMANTIK menyediakan evaluasi adaptif, latihan presisi, dan analitik kompetensi
            terstruktur untuk membantu meraih skor maksimal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-transform active:scale-95 text-lg"
            >
              Mulai Sekarang
            </Link>
            <Link
              href="/#fitur"
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-full transition-transform active:scale-95 text-lg"
            >
              Pelajari Fitur
            </Link>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section id="fitur" className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-3xl text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Tryout Adaptif CBT</h3>
              <p className="text-slate-600">
                Simulasi ujian dengan engine responsif seperti tes resmi.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-3xl text-center">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Analitik Kompetensi</h3>
              <p className="text-slate-600">
                Laporan kekuatan, kelemahan, dan rekam jejak historis lengkap.
              </p>
            </div>
            <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-3xl text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Materi & Latihan</h3>
              <p className="text-slate-600">
                Ratusan bank soal dan modul pembelajaran terintegrasi.
              </p>
            </div>
          </div>
        </section>

        {/* LATEST NEWS */}
        {newsData?.news && newsData.news.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-black text-center mb-10 text-slate-900">
              Beita & Pengumuman
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {newsData.news.map((n) => (
                <NewsUpdateCard
                  key={n.id}
                  title={n.title}
                  excerpt={n.content.substring(0, 100) + '...'}
                  category="Pengumuman"
                  date={new Date(n.createdAt).toLocaleDateString('id-ID')}
                  href={`/news/${n.slug}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        {testimonialsData?.testimonials && testimonialsData.testimonials.length > 0 && (
          <section className="bg-slate-50 border-y border-slate-100 py-16 mt-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-black mb-10 text-slate-900">Kata Mereka</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {testimonialsData.testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200"
                  >
                    <p className="text-slate-600 italic mb-4">"{t.content}"</p>
                    <h4 className="font-bold text-slate-900">{t.authorName}</h4>
                    <span className="text-xs text-slate-500">{t.authorRole}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </NavLayout>
  );
}
