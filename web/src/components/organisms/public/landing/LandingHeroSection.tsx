import { Award, BookOpen, CheckCircle2, ChevronRight, Play, Zap } from 'lucide-react';
import Link from 'next/link';
import { ScribbleSparkle, ScribbleUnderline } from '@/components/atoms/doodles/ScribbleDoodles';
import type { HeroStudentMockup } from '@/types/ui';

export interface LandingHeroSectionProps {
  student: HeroStudentMockup;
}

export function LandingHeroSection({ student }: LandingHeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:py-20">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none -z-10 opacity-70">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-100/60 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill Tag */}
            {/* Main Headline with Animated Scribble Underline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-[1.18] relative">
              Latihan Membaca, Kuasai Soal, dan Raih Skor Maksimal di{' '}
              <span className="relative inline-block text-teal-700 bg-linear-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                TKA Bahasa Indonesia
                <ScribbleUnderline variant="wavy" color="#0D9488" delayMs={200} />
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
              SIMANTIK adalah aplikasi berbasis web yang dibuat khusus untuk membantu siswa SMA
              mempersiapkan diri menghadapi Tes Kemampuan Akademik (TKA) Bahasa Indonesia. Aplikasi
              ini fokus melatih kemampuan membaca berbagai jenis teks agar siswa bisa belajar dan
              berlatih soal secara mandiri, lebih percaya diri, dan siap menghadapi ujian seleksi.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/register"
                className="h-12 px-7 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95 border-0"
              >
                <span>Mulai Belajar Mandiri</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <Link
                href="#video-panduan"
                className="h-12 px-7 rounded-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200/90 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <Play className="w-4 h-4 text-teal-600 fill-teal-600" />
                <span>Video Panduan</span>
              </Link>
            </div>

            {/* 3 Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Gratis Sepenuhnya</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Akses Bebas di Semua Perangkat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Disusun Tim Ahli Bahasa & Komputer UNP</span>
              </div>
            </div>
          </div>

          {/* Right Column: Student Dashboard Preview Mockup Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-6 space-y-4 relative">
              {/* Level Badge Top Right */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {student.avatarInitials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">{student.name}</div>
                    <div className="text-[11px] text-slate-500">{student.school}</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-teal-800 text-[11px] font-bold">
                  <Award className="w-3.5 h-3.5 text-teal-700" />
                  <span>{student.badgeLevel}</span>
                </div>
              </div>

              {/* Dark Average Score Card */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-slate-900 to-[#1E3A44] text-white flex items-center justify-between shadow-md">
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block uppercase tracking-wider">
                    Skor Rata-rata Tryout
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-black text-amber-400">
                      {student.averageScore}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/{student.maxScore}</span>
                  </div>
                </div>
              </div>

              {/* Competencies Progress Bars */}
              <div className="space-y-3 pt-1">
                {student.competencies.map((comp) => (
                  <div key={comp.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span>{comp.name}</span>
                        {comp.isAlert && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-700 border border-rose-200">
                            {comp.alertLabel}
                          </span>
                        )}
                      </div>
                      <span
                        className={
                          comp.isAlert ? 'font-black text-rose-600' : 'font-bold text-slate-700'
                        }
                      >
                        {comp.scorePercent}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={
                          comp.isAlert
                            ? 'h-full rounded-full bg-rose-500'
                            : 'h-full rounded-full bg-teal-600'
                        }
                        style={{ width: `${comp.scorePercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendation Callout Item */}
              <div className="p-3 rounded-2xl bg-[#EAF6F8]/80 border border-cyan-200/90 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-teal-900 block truncate uppercase">
                      Rekomendasi Hari Ini
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 block truncate">
                      {student.dailyRecommendation.title}
                    </span>
                  </div>
                </div>

                <Link
                  href={student.dailyRecommendation.href}
                  className="px-3 py-1 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs shrink-0 shadow-2xs"
                >
                  {student.dailyRecommendation.actionLabel}
                </Link>
              </div>

              {/* Bottom Verified Badge */}
              <div className="text-center pt-1 text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Tryout Selesai: {student.verifiedQuestionsCount} Soal Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingHeroSection;
