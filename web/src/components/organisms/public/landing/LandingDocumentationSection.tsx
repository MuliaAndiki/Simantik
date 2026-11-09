import { ArrowRight, Calendar, Camera, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { DocumentationHighlightItem } from '@/types/ui';

export interface LandingDocumentationSectionProps {
  items?: DocumentationHighlightItem[];
  isLoading?: boolean;
}

export function LandingDocumentationSection({
  items = [],
  isLoading = false,
}: LandingDocumentationSectionProps) {
  // Jika tidak loading dan database dokumentasi masih kosong, sembunyikan seksi ini
  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
              Dokumentasi Kegiatan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Aktivitas Riset, Uji Coba &amp; Implementasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Jejak kolaborasi pengembangan SIMANTIK bersama para guru, pakar asesmen, dan siswa di
              berbagai sekolah.
            </p>
          </div>

          <Link
            href="/documentation"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors shrink-0"
          >
            <span>Buka Semua Dokumentasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Highlights Cards or Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[1, 2, 3].map((i) => (
              <div
                key={`doc-skel-${i}`}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full bg-slate-100 animate-pulse" />
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-20 h-3 rounded-md bg-slate-200 animate-pulse" />
                    <div className="w-full h-4 rounded-md bg-slate-200 animate-pulse" />
                    <div className="w-3/4 h-4 rounded-md bg-slate-200 animate-pulse" />
                  </div>
                  <div className="w-24 h-3.5 rounded-md bg-slate-100 animate-pulse pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.slug ? `/documentation/${item.slug}` : '/documentation'}
                className="group rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Photo Area */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {/* biome-ignore lint/performance/noImgElement: intentional for activity documentation */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-teal-900/80 backdrop-blur-xs text-[11px] font-bold text-white border border-teal-500/30 flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    <span>{item.category}</span>
                  </div>
                </div>

                {/* Text Info */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-teal-800 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 pt-2 border-t border-slate-100">
                    <span>Lihat Dokumentasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LandingDocumentationSection;
