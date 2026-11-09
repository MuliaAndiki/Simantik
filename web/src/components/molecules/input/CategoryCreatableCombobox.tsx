'use client';

import { Check, ChevronDown, Plus, Search, Tag, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/classname';

export interface CategoryCreatableComboboxProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CategoryCreatableCombobox: React.FC<CategoryCreatableComboboxProps> = ({
  value,
  onChange,
  categories = [],
  placeholder = 'Pilih atau ketik kategori baru...',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered categories based on search input
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((cat) => cat.toLowerCase().includes(query));
  }, [categories, search]);

  // Check if current search matches any existing category exactly
  const isExactMatch = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories.some((cat) => cat.toLowerCase() === query);
  }, [categories, search]);

  const canCreateNew = search.trim().length > 0 && !isExactMatch;

  const handleSelect = (category: string) => {
    onChange(category.trim());
    setSearch('');
    setIsOpen(false);
  };

  const handleCreate = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCategories.length > 0 && !canCreateNew) {
        handleSelect(filteredCategories[0]);
      } else if (canCreateNew) {
        handleCreate();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Trigger Box */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          'w-full min-h-[42px] px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 flex items-center justify-between gap-2 transition cursor-pointer select-none',
          isOpen && 'border-cyan-600 bg-white ring-2 ring-cyan-500/10',
          disabled && 'opacity-60 cursor-not-allowed bg-slate-100'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Tag className="w-4 h-4 text-cyan-600 shrink-0" />
          {value ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200/60 truncate">
              {value}
            </span>
          ) : (
            <span className="text-slate-400 font-normal text-xs sm:text-sm truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
              title="Hapus pilihan"
              aria-label="Hapus pilihan kategori"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 transition-transform duration-200',
              isOpen && 'rotate-180 text-cyan-600'
            )}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Search / New Category Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari atau ketik nama kategori..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
            />
          </div>

          {/* Create New Category Action Button */}
          {canCreateNew && (
            <button
              type="button"
              onClick={handleCreate}
              className="w-full px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200 text-cyan-800 text-xs font-bold flex items-center gap-2 transition cursor-pointer text-left group"
            >
              <span className="w-5 h-5 rounded-md bg-cyan-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">
                Buat kategori baru:{' '}
                <strong className="text-cyan-950 font-black">&ldquo;{search.trim()}&rdquo;</strong>
              </span>
            </button>
          )}

          {/* Existing Categories List */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Pilihan Kategori</span>
              <span className="text-[10px] font-semibold text-slate-500">
                {filteredCategories.length} opsi
              </span>
            </div>

            {filteredCategories.length > 0
              ? filteredCategories.map((category) => {
                  const isSelected = value.toLowerCase() === category.toLowerCase();
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleSelect(category)}
                      className={cn(
                        'w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer text-left',
                        isSelected
                          ? 'bg-cyan-600 text-white shadow-2xs font-bold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      <span className="truncate">{category}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })
              : !canCreateNew && (
                  <div className="px-3 py-4 text-center text-xs text-slate-400">
                    Tidak ada kategori yang cocok.
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCreatableCombobox;
