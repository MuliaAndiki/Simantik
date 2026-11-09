import { ArrowRight, CheckCircle2, Clock, Film, Languages, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type { FeaturedVideoTutorial } from '@/types/ui';

export interface TutorialFeaturedSpotlightProps {
  featured?: FeaturedVideoTutorial | null;
  onPlayVideo?: (id: string) => void;
}

export function TutorialFeaturedSpotlight({
  featured,
  onPlayVideo,
}: TutorialFeaturedSpotlightProps) {
  if (!featured) return null;
  return (
    <div className="p-6 sm:p-8 rounded-[32px] bg-linear-to-tr from-cyan-50/90 via-sky-50/50 to-white border border-cyan-200/90 shadow-sm text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Video Player Preview Card */}
        <div className="lg:col-span-6 relative w-full aspect-video rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-md overflow-hidden group">
          {/* Background Thumbnail Image */}
          {featured.thumbnailUrl ? (
            <Image
              src={featured.thumbnailUrl}
              alt={featured.title}
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-xs text-slate-950 text-[10px] font-black shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>{featured.badgeLabel}</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[10px] font-bold">
              {featured.videoQuality}
            </span>
          </div>

          {/* Center Play Button in Yellow Circle */}
          <button
            type="button"
            onClick={() => onPlayVideo?.(featured.id)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Putar Video Tutorial"
          >
            <Play className="w-7 h-7 fill-slate-950 ml-1" />
          </button>

          {/* Bottom Timestamps & Audio Track */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-bold text-white">
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{featured.duration}</span>
            </span>

            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs flex items-center gap-1.5">
              <Languages className="w-3 h-3 text-teal-300" />
              <span>{featured.languageTrack}</span>
            </span>
          </div>
        </div>

        {/* Right Info Details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 border border-cyan-200 text-teal-900 text-xs font-bold uppercase tracking-wider">
            <span>{featured.moduleInfo}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {featured.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {featured.description}
          </p>

          {/* Checkpoints */}
          <div className="space-y-2 pt-1 text-xs font-semibold text-slate-700">
            {featured.featureCheckpoints.map((cp) => (
              <div key={cp} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{cp}</span>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onPlayVideo?.(featured.id)}
              className="h-12 px-7 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer border-0"
            >
              <span>Lihat Tutorial Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialFeaturedSpotlight;
