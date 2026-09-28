import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils/classname';

// Peta warna badge kompetensi (dipakai kartu materi & berita).
export function competencyBadgeTone(code?: string): string {
  switch ((code || '').toLowerCase()) {
    case 'pemahaman-inferensial':
    case 'inferensial':
      return 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]';
    case 'evaluasi-apresiasi':
    case 'evaluasi':
      return 'bg-[#E6F4EA] text-[#0D9488] border-[#A7F3D0]';
    default:
      return 'bg-[#E0F7FA] text-[#0284C7] border-[#BDEAF0]';
  }
}

export function BadgePill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border',
        className
      )}
    >
      {children}
    </span>
  );
}

export interface ContentCardBaseProps {
  badge?: React.ReactNode;
  badgeRight?: React.ReactNode;
  illustration?: React.ReactNode;
  title: string;
  titleLines?: 1 | 2;
  description?: string;
  descriptionLines?: 2 | 3;
  meta?: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  bodyClassName?: string;
}

// Cangkang kartu konten student (practice, materi, learning, news).
export function ContentCardBase({
  badge,
  badgeRight,
  illustration,
  title,
  titleLines = 2,
  description,
  descriptionLines = 2,
  meta,
  footer,
  href,
  onClick,
  className,
  bodyClassName,
}: ContentCardBaseProps) {
  const card = (
    <Card
      className={cn(
        'flex flex-col justify-between p-5 md:p-6 rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:shadow-md hover:border-[#8BBCC5]/50 group',
        href || onClick ? 'cursor-pointer' : undefined,
        className
      )}
      onClick={onClick}
    >
      <div className={cn('space-y-3.5', bodyClassName)}>
        {illustration && (
          <div className="w-full h-32 md:h-36 rounded-xl bg-gradient-to-b from-[#F0F9FA] to-[#E6F4F6] border border-[#DCEFF2] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
            {illustration}
          </div>
        )}

        {(badge || badgeRight) && (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {badge}
            {badgeRight}
          </div>
        )}

        <div className="space-y-2">
          <h3
            className={cn(
              'text-base font-bold text-[#111827] group-hover:text-[#1A4D5C] transition-colors leading-snug',
              titleLines === 1 ? 'line-clamp-1' : 'line-clamp-2'
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                'text-xs md:text-sm text-[#546A72] leading-relaxed',
                descriptionLines === 3 ? 'line-clamp-3 min-h-[3rem]' : 'line-clamp-2 min-h-[2.5rem]'
              )}
            >
              {description}
            </p>
          )}
        </div>

        {meta}
      </div>

      {footer && <div className="pt-4 mt-2">{footer}</div>}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {card}
      </Link>
    );
  }
  return card;
}

function CardActionButton({
  children,
  onClick,
  href,
  className,
  asChild,
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  asChild?: boolean;
  variant?: 'default' | 'secondary';
}) {
  return (
    <Button
      type={asChild ? undefined : 'button'}
      variant={variant}
      asChild={asChild}
      onClick={onClick}
      className={cn(
        'w-full h-10 rounded-xl font-semibold text-xs md:text-sm gap-2 shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]',
        href || asChild ? undefined : 'cursor-pointer',
        className
      )}
    >
      {href ? (
        <Link href={href} onClick={onClick}>
          {children}
        </Link>
      ) : (
        children
      )}
    </Button>
  );
}

// Tombol kuning primer kartu (Mulai Latihan / Pelajari Materi).
export function YellowCardButton({
  label,
  onClick,
  href,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  return (
    <CardActionButton
      onClick={onClick}
      href={href}
      asChild={!!href}
      className="bg-[#F7CE46] hover:bg-[#eabf32] text-[#1A4D5C] border-none"
    >
      <span>{label}</span>
      <ArrowRight className="size-4" />
    </CardActionButton>
  );
}

// Tombol cyan sekunder kartu (Pelajari Materi gaya MaterialCard).
export function CyanCardButton({
  label,
  icon,
  onClick,
  href,
}: {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  return (
    <CardActionButton
      onClick={onClick}
      href={href}
      asChild={!!href}
      variant="secondary"
      className="bg-[#E0F7FA] hover:bg-[#cbf1f6] text-[#1A4D5C] border border-[#BDEAF0]"
    >
      {icon ?? <BookOpen className="size-4" />}
      <span>{label}</span>
    </CardActionButton>
  );
}

// Tautan teks kartu (Baca Selengkapnya gaya NewsUpdateCard).
export function TextCardLink({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 pt-4 text-xs md:text-sm font-semibold text-[#1A4D5C] group-hover:text-[#0284c7] transition-colors cursor-pointer',
        className
      )}
    >
      <span>{label}</span>
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
