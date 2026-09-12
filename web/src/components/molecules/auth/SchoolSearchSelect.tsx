import { Input } from '@/components/atoms/input';
import { cn } from '@/utils/classname';

export interface SchoolOption {
  id: string;
  nama: string;
  npsn: string;
  jenjang: string;
}

export interface SchoolSearchSelectProps {
  search: string;
  onSearchChange: (value: string) => void;
  schools: SchoolOption[];
  loading: boolean;
  selected: SchoolOption | null;
  onSelect: (school: SchoolOption) => void;
  onClear: () => void;
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
  error,
  id = 'school-search',
  disabled,
}: SchoolSearchSelectProps) {
  if (selected) {
    return (
      <div className="flex w-full items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2.5">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{selected.nama}</span>
          <span className="text-xs text-muted-foreground">
            NPSN {selected.npsn} · {selected.jenjang.toUpperCase()}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="text-xs font-medium text-primary-foreground underline underline-offset-4 hover:opacity-80 cursor-pointer"
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
            <div className="px-3 py-2.5 text-sm text-muted-foreground">
              Sekolah tidak ditemukan. Coba kata kunci lain.
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

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
