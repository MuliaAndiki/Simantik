import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import type { VideoTutorialItem } from '@/types/ui';

export interface TutorialVideoGridProps {
  videos: VideoTutorialItem[];
  onSelectVideo?: (id: string) => void;
}

export function TutorialVideoGrid({ videos, onSelectVideo }: TutorialVideoGridProps) {
  return (
    <section className="space-y-6 text-left">
      {/* Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Katalog Video &amp; Panduan Fitur
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Pilih topik yang sesuai dengan tahapan belajar mandiri Anda.
          </p>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-bold w-fit">
          Menampilkan {videos.length} Tutorial
        </span>
      </div>

      {/* 6 Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="group rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Video Thumbnail Container */}
            <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
              {vid.thumbnailUrl ? (
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  fill
                  className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}

              {/* Category Tag */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {vid.category}
                </span>
              </div>

              {/* Play Button Overlay in Yellow Circle */}
              <button
                type="button"
                onClick={() => onSelectVideo?.(vid.id)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-950 flex items-center justify-center shadow-md transition-transform group-hover:scale-110 active:scale-95 cursor-pointer"
                aria-label={`Putar ${vid.title}`}
              >
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              </button>

              {/* Duration Timestamp Bottom Right */}
              <div className="absolute bottom-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[10px] font-bold font-mono">
                  {vid.duration}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-teal-800 transition-colors">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                  {vid.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectVideo?.(vid.id)}
                className="w-full h-10 rounded-xl bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200 text-teal-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Lihat Tutorial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TutorialVideoGrid;
