import { CheckCircle2, Quote } from 'lucide-react';
import Image from 'next/image';
import type { UserTestimonialItem } from '@/types/ui';

export interface TestimonialGridProps {
  testimonials: UserTestimonialItem[];
}

export function TestimonialGrid({ testimonials }: TestimonialGridProps) {
  return (
    <section className="space-y-6 text-left">
      {/* Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
            Koleksi Ulasan Peserta
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ulasan Nyata dari Lapangan
          </h2>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-bold w-fit">
          Menampilkan {testimonials.length} Ulasan Terpilih
        </span>
      </div>

      {/* Cards Grid or Empty State */}
      {testimonials.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Quote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700">Belum ada ulasan siswa</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Jadilah yang pertama membagikan pengalaman belajarmu bersama SIMANTIK melalui tombol di
            bawah.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Top Category Tag & Quote Icon */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-xs font-bold">
                  {t.categoryTag}
                </span>

                <span className="text-xl font-serif text-amber-400 font-black">““</span>
              </div>

              {/* Testimonial Quote */}
              <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal flex-1">
                {t.quote}
              </blockquote>

              {/* Author Profile Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0">
                  {t.avatarUrl ? (
                    <Image src={t.avatarUrl} alt={t.authorName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-xs">
                      {t.authorName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {t.authorName}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {t.school ? `${t.school} • ${t.province}` : t.authorRole}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TestimonialGrid;
