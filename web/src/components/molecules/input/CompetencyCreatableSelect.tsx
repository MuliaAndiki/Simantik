'use client';

import { Check, ChevronDown, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils/classname';
import type { CompetencyOptionItem, CreateCompetencyInput } from '@/utils/competency.util';

export interface CompetencyDropdownActionProps {
  competencies?: CompetencyOptionItem[];
  onCreateCompetency?: (input: CreateCompetencyInput) => Promise<CompetencyOptionItem | null>;
  onRequestDeleteCompetency?: (competency: CompetencyOptionItem) => Promise<boolean>;
  isCreatingCompetency?: boolean;
  deletingCompetencyId?: string | null;
}

export interface CompetencyCreatableSelectProps extends CompetencyDropdownActionProps {
  id?: string;
  value: string;
  onChange: (value: string, selectedCompetency?: CompetencyOptionItem) => void;
  placeholder?: string;
  allowNone?: boolean;
  noneValue?: string;
  noneLabel?: string;
  allOptionValue?: string;
  allOptionLabel?: string;
  uncategorizedOptionValue?: string;
  uncategorizedOptionLabel?: string;
  compact?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  dropdownClassName?: string;
  className?: string;
}

export const CompetencyCreatableSelect: React.FC<CompetencyCreatableSelectProps> = ({
  id,
  value,
  onChange,
  competencies = [],
  placeholder = 'Pilih Kompetensi',
  allowNone = true,
  noneValue = '',
  noneLabel = '-- Umum / Tanpa Kompetensi Khusus --',
  allOptionValue,
  allOptionLabel = 'Semua Kompetensi',
  uncategorizedOptionValue,
  uncategorizedOptionLabel = 'Tanpa Kompetensi',
  onCreateCompetency,
  onRequestDeleteCompetency,
  isCreatingCompetency = false,
  deletingCompetencyId = null,
  compact = false,
  disabled = false,
  triggerClassName,
  dropdownClassName,
  className,
}) => {
  const generatedId = useId();
  const triggerId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const createNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCompetencies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return competencies;
    return competencies.filter(
      (comp) => comp.name.toLowerCase().includes(q) || (comp.code || '').toLowerCase().includes(q)
    );
  }, [competencies, search]);

  const exactNameMatch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return false;
    return competencies.some((comp) => comp.name.toLowerCase() === q);
  }, [competencies, search]);

  const selectedCompetency = useMemo(
    () => competencies.find((comp) => comp.id === value),
    [competencies, value]
  );

  const displayLabel = useMemo(() => {
    if (allOptionValue !== undefined && value === allOptionValue) {
      return allOptionLabel;
    }
    if (uncategorizedOptionValue !== undefined && value === uncategorizedOptionValue) {
      return uncategorizedOptionLabel;
    }
    if (selectedCompetency) {
      return selectedCompetency.name;
    }
    if (allowNone && (value === noneValue || !value)) {
      return noneLabel;
    }
    return placeholder;
  }, [
    allOptionLabel,
    allOptionValue,
    allowNone,
    noneLabel,
    noneValue,
    placeholder,
    selectedCompetency,
    uncategorizedOptionLabel,
    uncategorizedOptionValue,
    value,
  ]);

  const isPlaceholderDisplay =
    !selectedCompetency &&
    value !== allOptionValue &&
    value !== uncategorizedOptionValue &&
    (!allowNone || value !== noneValue);

  const resetCreateForm = () => {
    setShowCreateForm(false);
    setShowOptionalFields(false);
    setNewName('');
    setNewCode('');
    setNewDescription('');
    setCreateError(null);
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 20);
      } else {
        setSearch('');
        resetCreateForm();
      }
      return next;
    });
  };

  const handleSelectValue = (nextValue: string, comp?: CompetencyOptionItem) => {
    onChange(nextValue, comp);
    setSearch('');
    resetCreateForm();
    setIsOpen(false);
  };

  const handleOpenCreateForm = (prefillName = '') => {
    setCreateError(null);
    setNewName(prefillName);
    setShowCreateForm(true);
    setTimeout(() => createNameInputRef.current?.focus(), 20);
  };

  const handleSubmitCreate = async (overrideInput?: CreateCompetencyInput) => {
    if (!onCreateCompetency || isCreatingCompetency) return;
    const rawName = (overrideInput?.name ?? newName).trim();
    if (rawName.length < 2) {
      setCreateError('Nama kompetensi minimal 2 karakter.');
      return;
    }

    setCreateError(null);
    const created = await onCreateCompetency({
      name: rawName,
      code: (overrideInput?.code ?? newCode).trim() || undefined,
      description: (overrideInput?.description ?? newDescription).trim() || undefined,
    });

    if (created) {
      handleSelectValue(created.id, created);
    }
  };

  const handleDeleteClick = async (event: React.MouseEvent, comp: CompetencyOptionItem) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onRequestDeleteCompetency || deletingCompetencyId) return;
    setIsOpen(false);
    await onRequestDeleteCompetency(comp);
  };

  const trimmedSearch = search.trim();
  const canQuickCreateFromSearch =
    Boolean(onCreateCompetency) && trimmedSearch.length >= 2 && !exactNameMatch;

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={handleToggleDropdown}
        className={cn(
          'w-full flex items-center justify-between gap-2 text-left transition cursor-pointer select-none focus:outline-none',
          compact
            ? 'px-3.5 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 font-medium focus:border-cyan-600 focus:bg-white'
            : 'px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:border-cyan-600',
          isOpen && 'border-cyan-600 bg-white ring-2 ring-cyan-500/15',
          disabled && 'opacity-60 cursor-not-allowed bg-slate-100',
          triggerClassName
        )}
      >
        <span className={cn('truncate', isPlaceholderDisplay && 'text-slate-400 font-normal')}>
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150',
            isOpen && 'rotate-180 text-cyan-600'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2.5 space-y-2 min-w-[260px]',
            dropdownClassName
          )}
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }
              }}
              placeholder="Cari atau buat kompetensi..."
              className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Inline Create Panel or Quick Action */}
          {showCreateForm && onCreateCompetency ? (
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-2.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-900">
                  Kompetensi Baru
                </span>
                <button
                  type="button"
                  onClick={resetCreateForm}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              <input
                ref={createNameInputRef}
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (createError) setCreateError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    void handleSubmitCreate();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    resetCreateForm();
                  }
                }}
                placeholder="Nama kompetensi (cth: Penalaran Analitis)"
                className="w-full px-3 py-1.5 bg-white border border-cyan-200 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600"
              />

              <button
                type="button"
                onClick={() => setShowOptionalFields((prev) => !prev)}
                className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-900 cursor-pointer"
              >
                {showOptionalFields ? 'Sembunyikan opsional' : '+ Kode & Deskripsi (opsional)'}
              </button>

              {showOptionalFields && (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        void handleSubmitCreate();
                      }
                    }}
                    placeholder="Kode opsional (otomatis jika dikosongkan)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600"
                  />
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        void handleSubmitCreate();
                      }
                    }}
                    placeholder="Deskripsi singkat (opsional)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              )}

              {createError && (
                <p className="text-[11px] font-medium text-rose-600">{createError}</p>
              )}

              <div className="flex items-center justify-end gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={resetCreateForm}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isCreatingCompetency}
                  onClick={() => void handleSubmitCreate()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#134653] hover:bg-[#0B2D38] text-white text-xs font-bold transition disabled:opacity-60 cursor-pointer"
                >
                  {isCreatingCompetency ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Simpan</span>
                </button>
              </div>
            </div>
          ) : (
            onCreateCompetency && (
              <div className="space-y-1">
                {canQuickCreateFromSearch && (
                  <button
                    type="button"
                    disabled={isCreatingCompetency}
                    onClick={() => void handleSubmitCreate({ name: trimmedSearch })}
                    className="w-full px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-2 transition cursor-pointer text-left disabled:opacity-60"
                  >
                    <span className="w-5 h-5 rounded-md bg-cyan-600 text-white flex items-center justify-center shrink-0">
                      {isCreatingCompetency ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="truncate">Buat kompetensi &ldquo;{trimmedSearch}&rdquo;</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenCreateForm(trimmedSearch)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-dashed border-cyan-300 bg-white hover:bg-cyan-50/70 text-cyan-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Tambah Kompetensi Baru...</span>
                </button>
              </div>
            )
          )}

          {/* Options List */}
          <div role="listbox" className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5">
            {allOptionValue !== undefined && !trimmedSearch && (
              <button
                type="button"
                role="option"
                aria-selected={value === allOptionValue}
                onClick={() => handleSelectValue(allOptionValue)}
                className={cn(
                  'w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer text-left',
                  value === allOptionValue
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <span className="truncate">{allOptionLabel}</span>
                {value === allOptionValue && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
              </button>
            )}

            {uncategorizedOptionValue !== undefined && !trimmedSearch && (
              <button
                type="button"
                role="option"
                aria-selected={value === uncategorizedOptionValue}
                onClick={() => handleSelectValue(uncategorizedOptionValue)}
                className={cn(
                  'w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer text-left',
                  value === uncategorizedOptionValue
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <span className="truncate">{uncategorizedOptionLabel}</span>
                {value === uncategorizedOptionValue && (
                  <Check className="w-3.5 h-3.5 shrink-0 ml-2" />
                )}
              </button>
            )}

            {allowNone && !trimmedSearch && (
              <button
                type="button"
                role="option"
                aria-selected={value === noneValue}
                onClick={() => handleSelectValue(noneValue)}
                className={cn(
                  'w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer text-left',
                  value === noneValue
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <span className="truncate">{noneLabel}</span>
                {value === noneValue && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
              </button>
            )}

            {filteredCompetencies.length > 0 ? (
              filteredCompetencies.map((comp) => {
                const isSelected = value === comp.id;
                const isDeletingRow = deletingCompetencyId === comp.id;
                return (
                  <div
                    key={comp.id}
                    className={cn(
                      'flex items-center gap-1 rounded-xl transition',
                      isSelected ? 'bg-cyan-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                    )}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectValue(comp.id, comp)}
                      className="flex-1 min-w-0 px-3 py-2 text-xs font-semibold flex items-center justify-between gap-2 text-left cursor-pointer"
                    >
                      <span className="truncate">{comp.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>

                    {onRequestDeleteCompetency && (
                      <button
                        type="button"
                        disabled={Boolean(deletingCompetencyId)}
                        onClick={(e) => void handleDeleteClick(e, comp)}
                        aria-label={`Hapus kompetensi ${comp.name}`}
                        title="Hapus kompetensi (soft delete)"
                        className={cn(
                          'mr-1 p-1.5 rounded-lg transition shrink-0 cursor-pointer disabled:opacity-50',
                          isSelected
                            ? 'text-white/80 hover:text-white hover:bg-white/20'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        )}
                      >
                        {isDeletingRow ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-xs text-slate-400">
                Tidak ada kompetensi yang cocok.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetencyCreatableSelect;
