import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import type { DocArticleItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface DocArticleGridProps {
  articles: DocArticleItem[];
}

export function DocArticleGrid({ articles }: DocArticleGridProps) {
  return (
    <section className="space-y-6 text-left">
      {/* Grid Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Semua Artikel Dokumentasi
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Menampilkan panduan langkah demi langkah dan rujukan teknis sistem SIMANTIK.
          </p>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-bold w-fit">
          {articles.length} Dokumen Ditampilkan
        </span>
      </div>

      {/* Cards Grid or Empty State */}
      {articles.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-50 text-teal-800 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700">Belum ada artikel dokumentasi</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Dokumen panduan resmi platform SIMANTIK akan ditampilkan di sini setelah dipublikasikan
            oleh tim kurikulum.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="group rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
            >
              {/* Top Tag & Read Time */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold border',
                    art.categoryColorClass || 'bg-cyan-50 text-teal-800 border-cyan-200'
                  )}
                >
                  {art.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readTimeMinutes} mnt baca</span>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-2 flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-teal-800 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              {/* Footer Date & Read Link */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{art.publishedDate}</span>
                </div>

                <Link
                  href={art.href}
                  className="inline-flex items-center gap-1 font-bold text-teal-800 hover:text-teal-950 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Baca Dokumentasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DocArticleGrid;
