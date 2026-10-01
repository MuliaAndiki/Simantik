import { ArrowDownUp, Filter } from 'lucide-react';
import type { DocCategoryItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface DocCategoryTabsProps {
  categories: DocCategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function DocCategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: DocCategoryTabsProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs',
                isSelected
                  ? 'bg-slate-900 text-white border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              )}
            >
              <span>{cat.label}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-black',
                  isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Sort Indicator */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold shrink-0 self-end sm:self-auto">
        <ArrowDownUp className="w-3.5 h-3.5" />
        <span>Diurutkan: Terbaru</span>
      </div>
    </div>
  );
}

export default DocCategoryTabs;
