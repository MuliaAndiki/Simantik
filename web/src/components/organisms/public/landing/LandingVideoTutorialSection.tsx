import { ArrowRight, CheckCircle2, Play, Sparkles, Video } from 'lucide-react';
import Link from 'next/link';
import type { VideoTutorialHighlight } from '@/types/ui';

export interface LandingVideoTutorialSectionProps {
  data?: VideoTutorialHighlight;
  isLoading?: boolean;
}

export function LandingVideoTutorialSection({
  data,
  isLoading = false,
}: LandingVideoTutorialSectionProps) {
  // Jika tidak loading dan belum ada video di database, sembunyikan seksi ini
  if (!isLoading && !data) {
    return null;
  }

  return (
    <section id="video-panduan" className="py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
              Video Panduan Penggunaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ketahui Cara Menggunakan SIMANTIK
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Tonton video pengenalan ringkas agar kamu dapat memaksimalkan setiap modul belajar dan
              simulasi ujian mandiri.
            </p>
          </div>

          <Link
            href="/tutorials"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors shrink-0"
          >
            <span>Buka Semua Tutorial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Card Showcase or Skeleton */}
        {isLoading || !data ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-slate-900/90 p-6 sm:p-10 shadow-xl">
            <div className="lg:col-span-7 aspect-video w-full rounded-2xl bg-slate-800 animate-pulse" />
            <div className="lg:col-span-5 space-y-4">
              <div className="w-32 h-6 rounded-full bg-slate-800 animate-pulse" />
              <div className="w-3/4 h-8 rounded-lg bg-slate-800 animate-pulse" />
              <div className="w-full h-16 rounded-lg bg-slate-800 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-linear-to-br from-teal-900 to-[#134653] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            {/* Subtle Decorative Circle */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

            {/* Left Column: Video Thumbnail with Play Overlay */}
            <div className="lg:col-span-7">
              <Link
                href="/tutorials"
                className="group relative block aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-white/15 bg-slate-900"
              >
                {/* biome-ignore lint/performance/noImgElement: Video thumbnail preview */}
                <img
                  src={data.thumbnailUrl}
                  alt={data.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{data.duration}</span>
                </div>

                {/* Big Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F5B731] text-slate-950 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[11px] text-white/70 block">Klik untuk memutar di</span>
                  <span className="text-xs font-bold text-white">SIMANTIK Video Hub</span>
                </div>
              </Link>
            </div>

            {/* Right Column: Descriptions & Checklist */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tutorial Interaktif</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
                  {data.title}
                </h3>

                <p className="text-xs sm:text-sm text-cyan-50/80 leading-relaxed font-normal">
                  {data.description}
                </p>
              </div>

              {/* Bullet Features */}
              <div className="space-y-2.5 pt-2 border-t border-white/15">
                {data.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-start gap-2.5 text-xs text-cyan-50/90 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F5B731] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/tutorials"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Mulai Tonton Video</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default LandingVideoTutorialSection;
