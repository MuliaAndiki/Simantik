import {
  Award,
  Building2,
  CheckCircle2,
  CheckSquare,
  GraduationCap,
  Quote,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';
import type { FeaturedSpotlightTestimonial } from '@/types/ui';

export interface TestimonialFeaturedSpotlightProps {
  spotlight?: FeaturedSpotlightTestimonial | null;
}

export function TestimonialFeaturedSpotlight({ spotlight }: TestimonialFeaturedSpotlightProps) {
  if (!spotlight) return null;
  return (
    <div className="p-6 sm:p-10 rounded-[36px] bg-linear-to-tr from-amber-50/70 via-orange-50/40 to-white border border-amber-200/80 shadow-sm text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Photo & Badges Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200/90 shadow-lg p-3 space-y-3 relative overflow-hidden">
            {/* Top Scorer Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black shadow-xs">
              <Trophy className="w-3.5 h-3.5 fill-slate-950" />
              <span>{spotlight.badges[0] || 'Top Scorer Tryout Nasional #1'}</span>
            </div>

            {/* Student Photo */}
            <div className="relative w-full aspect-4/5 rounded-2xl bg-slate-900 overflow-hidden">
              <Image
                src={spotlight.avatarUrl || '/illustrations/student-learning.jpg'}
                alt={spotlight.name}
                fill
                className="object-cover"
              />

              {/* Bottom Target Capsule */}
              <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-amber-300 block font-bold uppercase">
                    Target Akademik
                  </span>
                  <span className="text-[11px] truncate block">{spotlight.academicTarget}</span>
                </div>
              </div>
            </div>

            {/* School & Verified Tag */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{spotlight.school}</div>
                  <div className="text-[11px] text-slate-500 truncate">{spotlight.province}</div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full shrink-0">
                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                <span>Terverifikasi</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Testimonial Quote & Score Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Sorotan Utama Pengguna
            </span>
            <span className="text-3xl font-serif text-amber-400 font-black">““</span>
          </div>

          {/* Big Quote */}
          <blockquote className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {spotlight.quote}
          </blockquote>

          {/* User Details */}
          <div className="space-y-1 pt-2">
            <div className="text-base sm:text-lg font-black text-slate-900">{spotlight.name}</div>
            <div className="text-xs sm:text-sm text-slate-600 font-medium">{spotlight.role}</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full mt-1">
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              <span>{spotlight.badges[1] || 'Siswa Aktif Terakreditasi • DKI Jakarta'}</span>
            </div>
          </div>

          {/* 2 Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/90 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-teal-800 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Progres Tryout
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                  {spotlight.tryoutCompletedCount} Paket Selesai
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Skor Terkalibrasi
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                  {spotlight.calibratedScore}{' '}
                  <span className="text-xs text-slate-400 font-normal">/ {spotlight.maxScore}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialFeaturedSpotlight;
