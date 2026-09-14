import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/classname';

export interface SimantikLogoProps {
  className?: string;
  showSubtitle?: boolean;
  centered?: boolean;
  href?: string;
}

export function SimantikLogo({
  className,
  showSubtitle = true,
  centered = false,
  href = '/',
}: SimantikLogoProps) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 select-none group transition-opacity hover:opacity-95',
        centered && 'justify-center',
        className
      )}
    >
      <Image
        alt="logos"
        src={'/images/logos.png'}
        width={60}
        height={60}
        className="aspect-square rounded-lg object-cover"
      />

      {/* Brand Text */}
      <div className={cn('flex flex-col', centered && 'text-center')}>
        <span className="font-extrabold tracking-tight text-lg text-slate-800 leading-tight">
          SIMANTIK
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-teal-600 tracking-normal">
            Platform Belajar &amp; Asesmen SMA/SMK
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
