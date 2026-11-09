import { ArrowRight, MessageSquareQuote, Star } from 'lucide-react';
import Link from 'next/link';
import type { UserTestimonialItem } from '@/types/ui';

export interface LandingTestimonialsSectionProps {
  items?: UserTestimonialItem[];
  isLoading?: boolean;
}

export function LandingTestimonialsSection({
  items = [],
  isLoading = false,
}: LandingTestimonialsSectionProps) {
  // Jika tidak loading dan database testimoni masih kosong, sembunyikan seksi ini
  if (!isLoading && items.length === 0) {
    return null;
  }

  const testimonials = items.slice(0, 3);

  return (
    <section className="py-16 bg-slate-50/70 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
              Apa Kata Mereka?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cerita Sukses Belajar Bersama SIMANTIK
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Dengar pengalaman langsung dari para siswa dan pengajar yang telah menguji pemahaman
              membaca wacana dan simulasi tryout adaptif.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors shrink-0"
          >
            <span>Lihat Semua Testimoni</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Testimonials Cards or Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[1, 2, 3].map((i) => (
              <div
                key={`testi-skel-${i}`}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-20 h-4 rounded-md bg-amber-100 animate-pulse" />
                  <div className="w-6 h-6 rounded-md bg-slate-100 animate-pulse" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="w-full h-3 rounded-md bg-slate-100 animate-pulse" />
                  <div className="w-4/5 h-3 rounded-md bg-slate-100 animate-pulse" />
                  <div className="w-3/5 h-3 rounded-md bg-slate-100 animate-pulse" />
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="w-24 h-3.5 rounded-md bg-slate-200 animate-pulse" />
                    <div className="w-32 h-2.5 rounded-md bg-slate-100 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {testimonials.map((testi) => (
              <div
                key={testi.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                {/* Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(testi.rating || 5)].map((_, i) => (
                      <Star
                        key={`star-${testi.id}-${i}`}
                        className="w-4 h-4 fill-[#F5B731] text-[#F5B731]"
                      />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-teal-600/30" />
                </div>

                {/* Quote Body */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic flex-1">
                  {testi.quote}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  {/* biome-ignore lint/performance/noImgElement: intentional for student avatar */}
                  <img
                    src={testi.avatarUrl || '/avatars/1.png'}
                    alt={testi.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {testi.authorName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {testi.school ? `${testi.school} • ${testi.province}` : testi.authorRole}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LandingTestimonialsSection;
