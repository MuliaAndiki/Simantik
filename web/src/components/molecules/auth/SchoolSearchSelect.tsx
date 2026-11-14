import { Clock, PlusCircle, Search, X } from 'lucide-react';
import { Input } from '@/components/atoms/input';
import { SchoolJenjangFilter } from '@/components/molecules/school/SchoolJenjangFilter';
import { cn } from '@/utils/classname';
import type { SchoolLevelFilterValue, SelectableSchoolItem } from '@/utils/school-picker.util';

export type SchoolOption = SelectableSchoolItem;

function formatSchoolMeta(school: Pick<SchoolOption, 'npsn' | 'jenjang'>): string {
  const parts: string[] = [];
  if (school.npsn?.trim()) {
    parts.push(`NPSN ${school.npsn.trim()}`);
  }
  if (school.jenjang?.trim()) {
    parts.push(school.jenjang.trim().toUpperCase());
  }
  return parts.join(' · ') || 'Sekolah terdaftar';
}

export interface SchoolSearchSelectProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchFocus?: () => void;
  schools: SchoolOption[];
  loading: boolean;
  selected: SchoolOption | null;
  onSelect: (school: SchoolOption) => void;
  onClear: () => void;
  jenjangFilter?: SchoolLevelFilterValue;
  onJenjangFilterChange?: (jenjang: SchoolLevelFilterValue) => void;
  onRequestNewSchool?: (initialSearch?: string) => void;
  showDropdown?: boolean;
  onDismissDropdown?: () => void;
  alwaysShowProposeCta?: boolean;
  proposeLabel?: string;
  placeholder?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
}

export function SchoolSearchSelect({
  search,
  onSearchChange,
  onSearchFocus,
  schools,
  loading,
  selected,
  onSelect,
  onClear,
  jenjangFilter = 'all',
  onJenjangFilterChange,
  onRequestNewSchool,
  showDropdown,
  onDismissDropdown,
  alwaysShowProposeCta = false,
  proposeLabel = 'Ajukan Sekolah',
  placeholder = 'Cari nama sekolah atau NPSN',
  error,
  id = 'school-search',
  disabled,
}: SchoolSearchSelectProps) {
  if (selected) {
    const isPending = selected.verificationStatus === 'pending';

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
          <div className="flex flex-col gap-0.5 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-900 truncate">{selected.nama}</span>
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 shrink-0">
                  <Clock className="size-3" />
                  Menunggu Verifikasi
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500">{formatSchoolMeta(selected)}</span>
          </div>
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 cursor-pointer shrink-0 disabled:opacity-50"
          >
            Ganti
          </button>
        </div>

        {alwaysShowProposeCta && onRequestNewSchool && (
          <div className="flex items-center justify-between pt-0.5 text-xs text-slate-500">
            <span>Sekolah barumu belum terdaftar?</span>
            <button
              type="button"
              onClick={() => onRequestNewSchool(selected.nama)}
              disabled={disabled}
              className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="size-3.5" />
              {proposeLabel}
            </button>
          </div>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  const hasActiveFilter = jenjangFilter !== 'all';
  const showList =
    showDropdown ?? (loading || schools.length > 0 || search.trim() !== '' || hasActiveFilter);

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {onJenjangFilterChange && (
        <SchoolJenjangFilter
          value={jenjangFilter}
          onChange={onJenjangFilterChange}
          disabled={disabled}
        />
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onSearchFocus}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            'pl-9 pr-9 h-11 rounded-xl border-gray-200 bg-white text-sm text-gray-900',
            error && 'border-destructive focus-visible:ring-destructive/30'
          )}
        />
        {loading ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        ) : search.trim() !== '' ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            disabled={disabled}
            aria-label="Hapus pencarian sekolah"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {showList && (
        <div
          className={cn(
            'flex max-h-56 w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs',
            error && 'border-destructive'
          )}
        >
          {onDismissDropdown && (
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 bg-slate-50/70 text-[11px] text-slate-500">
              <span>
                {loading
                  ? 'Memuat daftar sekolah...'
                  : `${schools.length} sekolah${hasActiveFilter ? ` (${jenjangFilter.toUpperCase()})` : ''} ditemukan`}
              </span>
              <button
                type="button"
                onClick={onDismissDropdown}
                className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}

          <div className="flex flex-col overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
                <span className="size-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                Mencari sekolah...
              </div>
            ) : schools.length === 0 ? (
              <div className="flex flex-col gap-2 px-3.5 py-3 text-sm text-slate-500">
                <span>
                  Sekolah tidak ditemukan
                  {hasActiveFilter ? ` di jenjang ${jenjangFilter.toUpperCase()}` : ''}. Coba kata
                  kunci lain atau ubah filter jenjang.
                </span>
                {onRequestNewSchool && (
                  <button
                    type="button"
                    onClick={() => onRequestNewSchool(search)}
                    disabled={disabled}
                    className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 cursor-pointer"
                  >
                    <PlusCircle className="size-3.5" />
                    {proposeLabel}
                  </button>
                )}
              </div>
            ) : (
              schools.map((school) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => onSelect(school)}
                  className="flex flex-col items-start gap-0.5 px-3.5 py-2.5 text-left hover:bg-teal-50/60 transition-colors cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-1.5 w-full">
                    <span className="text-sm font-medium text-slate-900">{school.nama}</span>
                    {school.verificationStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        <Clock className="size-2.5" />
                        Menunggu Verifikasi
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{formatSchoolMeta(school)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {onRequestNewSchool && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs text-slate-500">
          <span>Sekolahmu belum ada di daftar?</span>
          <button
            type="button"
            onClick={() => onRequestNewSchool(search)}
            disabled={disabled}
            className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="size-3.5" />
            {proposeLabel}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
