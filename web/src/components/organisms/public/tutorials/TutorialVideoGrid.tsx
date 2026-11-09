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

      {/* Cards Grid or Empty State */}
      {videos.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-50 text-teal-800 flex items-center justify-center">
            <Play className="w-6 h-6 fill-teal-800 ml-0.5" />
          </div>
          <h3 className="text-base font-bold text-slate-700">Belum ada video tutorial</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Video panduan belajar dan walkthrough fitur SIMANTIK akan muncul di sini setelah
            diunggah oleh pengelola.
          </p>
        </div>
      ) : (
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
                  aria-label={`Putar video ${vid.title}`}
                >
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                </button>

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-semibold text-white">
                  {vid.duration}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-teal-800 transition-colors leading-snug line-clamp-2">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                    {vid.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectVideo?.(vid.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 group-hover:translate-x-0.5 transition-transform pt-2 border-t border-slate-100 cursor-pointer"
                >
                  <span>Tonton Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TutorialVideoGrid;
