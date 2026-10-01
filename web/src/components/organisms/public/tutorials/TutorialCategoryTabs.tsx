import type { TutorialCategoryItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface TutorialCategoryTabsProps {
  categories: TutorialCategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function TutorialCategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: TutorialCategoryTabsProps) {
  return (
    <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto py-4 scrollbar-none">
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-100/80 border border-slate-200">
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
                  ? 'bg-teal-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              )}
            >
              <span>{cat.label}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-black',
                  isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TutorialCategoryTabs;
