import { ArrowRight, BookOpen, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { LandingNewsItem } from '@/types/ui';

export interface LandingNewsSectionProps {
  news: LandingNewsItem[];
  isLoading?: boolean;
}

export function LandingNewsSection({ news, isLoading = false }: LandingNewsSectionProps) {
  // Jika tidak loading dan database berita masih kosong, jangan render bagian ini
  if (!isLoading && news.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
              Wawasan &amp; Pembaruan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Berita &amp; Informasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Tips belajar efektif, pembaruan skema asesmen terkini, dan panduan persiapan ujian.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors shrink-0"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 News Cards or Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[1, 2, 3].map((i) => (
              <div
                key={`news-skel-${i}`}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                <div className="w-full h-44 bg-slate-100 animate-pulse" />
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-24 h-3 rounded-md bg-slate-200 animate-pulse" />
                    <div className="w-4/5 h-5 rounded-md bg-slate-200 animate-pulse" />
                    <div className="space-y-1.5 pt-1">
                      <div className="w-full h-3 rounded-md bg-slate-100 animate-pulse" />
                      <div className="w-5/6 h-3 rounded-md bg-slate-100 animate-pulse" />
                    </div>
                  </div>
                  <div className="w-28 h-4 rounded-md bg-slate-200 animate-pulse pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {news.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cyan-50 text-teal-700">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}

                  {/* Badge Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-teal-800 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <Link
                    href={item.slug ? `/news/${item.slug}` : '/news'}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 pt-2"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LandingNewsSection;
