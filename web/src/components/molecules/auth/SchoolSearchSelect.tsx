import { Clock, PlusCircle } from 'lucide-react';
import { Input } from '@/components/atoms/input';
import type { SchoolVerificationStatus } from '@/types/service';
import { cn } from '@/utils/classname';

export interface SchoolOption {
  id: string;
  nama: string;
  npsn: string;
  jenjang: string;
  verificationStatus?: SchoolVerificationStatus;
}

export interface SchoolSearchSelectProps {
  search: string;
  onSearchChange: (value: string) => void;
  schools: SchoolOption[];
  loading: boolean;
  selected: SchoolOption | null;
  onSelect: (school: SchoolOption) => void;
  onClear: () => void;
  onRequestNewSchool?: (initialSearch?: string) => void;
  error?: string;
  id?: string;
  disabled?: boolean;
}

export function SchoolSearchSelect({
  search,
  onSearchChange,
  schools,
  loading,
  selected,
  onSelect,
  onClear,
  onRequestNewSchool,
  error,
  id = 'school-search',
  disabled,
}: SchoolSearchSelectProps) {
  if (selected) {
    const isPending = selected.verificationStatus === 'pending';

    return (
      <div className="flex w-full items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2.5">
        <div className="flex flex-col gap-0.5 text-left">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium text-foreground">{selected.nama}</span>
            {isPending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                <Clock className="size-3" />
                Menunggu Verifikasi
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            NPSN {selected.npsn} · {selected.jenjang.toUpperCase()}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="text-xs font-medium text-primary-foreground underline underline-offset-4 hover:opacity-80 cursor-pointer shrink-0"
        >
          Ganti
        </button>
      </div>
    );
  }

  const showList = loading || schools.length > 0 || search.trim() !== '';

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <div className="relative">
        <Input
          id={id}
          type="text"
          autoComplete="off"
          placeholder="Cari nama sekolah atau NPSN"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        )}
      </div>

      {showList && (
        <div
          className={cn(
            'flex max-h-48 w-full flex-col overflow-y-auto rounded-md border bg-card',
            error && 'border-destructive'
          )}
        >
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground">
              <span className="size-3.5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              Mencari sekolah...
            </div>
          ) : schools.length === 0 ? (
            <div className="flex flex-col gap-2 px-3 py-3 text-sm text-muted-foreground">
              <span>Sekolah tidak ditemukan. Coba kata kunci lain.</span>
              {onRequestNewSchool && (
                <button
                  type="button"
                  onClick={() => onRequestNewSchool(search)}
                  disabled={disabled}
                  className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 cursor-pointer"
                >
                  <PlusCircle className="size-3.5" />
                  Ajukan Sekolah Baru
                </button>
              )}
            </div>
          ) : (
            schools.map((school) => (
              <button
                key={school.id}
                type="button"
                onClick={() => onSelect(school)}
                className="flex flex-col items-start gap-0.5 px-3 py-2.5 text-left hover:bg-accent cursor-pointer"
              >
                <span className="text-sm font-medium text-foreground">{school.nama}</span>
                <span className="text-xs text-muted-foreground">
                  NPSN {school.npsn} · {school.jenjang.toUpperCase()}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {onRequestNewSchool && (
        <div className="flex items-center justify-between pt-0.5 text-xs text-muted-foreground">
          <span>Sekolahmu belum ada di daftar?</span>
          <button
            type="button"
            onClick={() => onRequestNewSchool(search)}
            disabled={disabled}
            className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4 cursor-pointer"
          >
            <PlusCircle className="size-3.5" />
            Ajukan Sekolah
          </button>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
