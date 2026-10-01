import { BarChart3, CheckSquare, Compass, Lightbulb } from 'lucide-react';
import type { ValuePropItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface LandingValuePropsSectionProps {
  items: ValuePropItem[];
}

export function LandingValuePropsSection({ items }: LandingValuePropsSectionProps) {
  const getIcon = (
    iconName: ValuePropItem['iconName'],
    colorTheme: ValuePropItem['colorTheme']
  ) => {
    switch (iconName) {
      case 'compass':
        return <Compass className="w-6 h-6 text-teal-700" />;
      case 'check-circle':
        return <CheckSquare className="w-6 h-6 text-cyan-700" />;
      case 'bar-chart':
        return <BarChart3 className="w-6 h-6 text-blue-700" />;
      case 'lightbulb':
        return <Lightbulb className="w-6 h-6 text-amber-600" />;
      default:
        return <Compass className="w-6 h-6 text-teal-700" />;
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
      default:
        return 'bg-teal-50/80 border-teal-200/80';
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3.5 text-left"
            >
              {/* Icon Capsule */}
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center border',
                  getContainerBg(item.colorTheme)
                )}
              >
                {getIcon(item.iconName, item.colorTheme)}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
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
