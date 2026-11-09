import {
  Award,
  BarChart3,
  CheckSquare,
  Compass,
  FileText,
  Laptop,
  Lightbulb,
  ShieldCheck,
  Target,
} from 'lucide-react';
import type { ValuePropItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LandingValuePropsSectionProps {
  items: ValuePropItem[];
}

export function LandingValuePropsSection({ items }: LandingValuePropsSectionProps) {
  const getIcon = (
    iconName: ValuePropItem['iconName'],
    _colorTheme: ValuePropItem['colorTheme']
  ) => {
    switch (iconName) {
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6 text-teal-700" />;
      case 'laptop':
        return <Laptop className="w-6 h-6 text-cyan-700" />;
      case 'award':
        return <Award className="w-6 h-6 text-blue-700" />;
      case 'target':
        return <Target className="w-6 h-6 text-amber-600" />;
      case 'file-text':
        return <FileText className="w-6 h-6 text-emerald-700" />;
      case 'compass':
        return <Compass className="w-6 h-6 text-teal-700" />;
      case 'check-circle':
        return <CheckSquare className="w-6 h-6 text-cyan-700" />;
      case 'bar-chart':
        return <BarChart3 className="w-6 h-6 text-blue-700" />;
      case 'lightbulb':
        return <Lightbulb className="w-6 h-6 text-amber-600" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-teal-700" />;
    }
  };

  const getContainerBg = (colorTheme: ValuePropItem['colorTheme']) => {
    switch (colorTheme) {
      case 'teal':
        return 'bg-teal-50/80 border-teal-200/80';
      case 'cyan':
        return 'bg-cyan-50/80 border-cyan-200/80';
      case 'blue':
        return 'bg-blue-50/80 border-blue-200/80';
      case 'amber':
        return 'bg-amber-50/80 border-amber-200/80';
      case 'emerald':
        return 'bg-emerald-50/80 border-emerald-200/80';
      default:
        return 'bg-teal-50/80 border-teal-200/80';
    }
  };

  return (
    <section className="py-16 bg-slate-50/60 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
            Keunggulan SIMANTIK
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mengapa Harus Belajar Bersama SIMANTIK?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Platform asesmen dan pembelajaran adaptif berbasis standar kurikulum nasional dengan
            kualitas teruji dan dukungan penuh pakar bahasa.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left"
            >
              {/* Icon Capsule */}
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0',
                  getContainerBg(item.colorTheme)
                )}
              >
                {getIcon(item.iconName, item.colorTheme)}
              </div>

              {/* Title & Description */}
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingValuePropsSection;
