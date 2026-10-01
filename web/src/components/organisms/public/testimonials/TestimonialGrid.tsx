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

      {/* 6 Cards Grid */}
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

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 font-bold text-slate-900 text-xs sm:text-sm truncate">
                  <span>{t.authorName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {t.authorRole}
                  {t.school && ` • ${t.school}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialGrid;
