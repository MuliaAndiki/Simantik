import { cn } from '@/utils/classname';

export interface StatusPillTone {
  pill: string;
  dot: string;
}

export interface StatusPillProps {
  label: string;
  tone: StatusPillTone;
  className?: string;
}

// Cangkang badge status dot+label. Token warna datang dari peta per domain.
export function StatusPill({ label, tone, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
        tone.pill,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', tone.dot)} />
      {label}
    </span>
  );
}

const PACKAGE_STATUS_TONES: Record<string, StatusPillTone & { label: string }> = {
  PUBLISHED: {
    pill: 'bg-[#E8F8F3] text-[#059669]',
    dot: 'bg-[#10B981]',
    label: 'Published',
  },
  DRAFT: {
    pill: 'bg-[#FEF7EB] text-[#D97706]',
    dot: 'bg-[#F5B731]',
    label: 'Draft',
  },
  UNPUBLISHED: {
    pill: 'bg-[#F1F5F9] text-[#64748B]',
    dot: 'bg-[#94A3B8]',
    label: 'Unpublished',
  },
};

// Badge status paket (practice & tryouts): PUBLISHED/DRAFT/UNPUBLISHED.
export function PackageStatusBadge({ status }: { status?: string }) {
  const tone = PACKAGE_STATUS_TONES[(status || '').toUpperCase()];
  if (!tone) return null;
  return <StatusPill label={tone.label} tone={tone} />;
}

const JENJANG_TONES: Record<string, { pill: string; label: string }> = {
  sd: {
    pill: 'bg-rose-50 text-rose-700 border border-rose-200',
    label: 'SD',
  },
  smp: {
    pill: 'bg-sky-50 text-sky-700 border border-sky-200',
    label: 'SMP',
  },
  smk: {
    pill: 'bg-amber-50 text-amber-700 border border-amber-200',
    label: 'SMK',
  },
  sma: {
    pill: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    label: 'SMA',
  },
};

// Badge jenjang SD/SMP/SMK/SMA. Satu definisi untuk materials, practice, tryouts.
export function JenjangBadge({ value, className }: { value?: string; className?: string }) {
  const tone = JENJANG_TONES[(value || 'sma').toLowerCase()] ?? JENJANG_TONES.sma;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
        tone.pill,
        className
      )}
    >
      {tone.label}
    </span>
  );
}
