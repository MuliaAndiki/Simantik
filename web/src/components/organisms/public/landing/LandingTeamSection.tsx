'use client';

import { Award, GraduationCap, Sparkles } from 'lucide-react';
import { CardStack, type CardStackItem } from '@/components/ui/card-stack';
import type { TeamMemberItem } from '@/types/ui';

export interface LandingTeamSectionProps {
  members?: TeamMemberItem[];
}

export function LandingTeamSection({ members }: LandingTeamSectionProps) {
  const teamItems: CardStackItem[] = (members ?? []).map((m) => ({
    id: m.id,
    title: m.name,
    description: m.role ? `${m.role} • ${m.institution}` : m.institution,
    tag: m.tag || 'Tim SIMANTIK',
    imageSrc: m.imageSrc,
  }));

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <span>TIM PENGEMBANG SIMANTIK</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Kolaborasi Akademisi & Pengembang Teknologi
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            SIMANTIK dirancang dan divalidasi oleh tim dosen ahli Pendidikan Bahasa dan Sastra
            Indonesia Universitas Negeri Padang (UNP) bersama para perancang perangkat lunak
            berpengalaman.
          </p>
        </div>

        {/* 3D Arc CardStack Carousel */}
        {teamItems.length > 0 && (
          <div className="w-full flex justify-center py-4">
            <CardStack
              items={teamItems}
              initialIndex={0}
              cardWidth={460}
              cardHeight={300}
              autoAdvance
              intervalMs={3000}
              pauseOnHover
              showDots
              className="max-w-4xl"
              renderCard={(item, { active }) => (
                <div className="relative h-full w-full bg-slate-800 rounded-2xl overflow-hidden border border-white/10 group">
                  {/* Portrait Image */}
                  {/* biome-ignore lint/performance/noImgElement: intentional for team photos */}
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                    loading="eager"
                  />

                  {/* Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5 text-left pointer-events-none">
                    {item.tag && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                        <Award className="w-3 h-3" />
                        <span>{item.tag}</span>
                      </span>
                    )}

                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs sm:text-[13px] text-teal-100/90 leading-snug font-medium line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default LandingTeamSection;
