import Link from 'next/link';
import type * as React from 'react';
import { AuthIllustration } from '@/components/atoms/auth/AuthIllustration';
import { cn } from '@/utils/classname';

export interface AuthFeatureBadge {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  iconBg?: string;
  iconColor?: string;
}

export interface AuthTemplateProps {
  variant?: 'split' | 'centered';
  /** Pill badge inside the card (e.g., 'Selamat Datang !', 'DAFTAR AKUN', 'Lupa Password?') */
  badge?: string;
  /** Title inside the card */
  title: string;
  /** Subtitle/description inside the card */
  description?: string;
  /** Large heading for the left hero panel (split variant) */
  heroTitle?: React.ReactNode;
  /** Description for the left hero panel (split variant) */
  heroDescription?: string;
  /** Feature cards row (used in Registration) */
  features?: AuthFeatureBadge[];
  /** Custom illustration or placeholder component */
  illustration?: React.ReactNode;
  /** Top icon inside centered card (used in Verify Email) */
  icon?: React.ReactNode;
  /** Masked email tag (used in Verify Email) */
  maskedEmail?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  onFooterLinkClick?: () => void;
  className?: string;
}

export function AuthTemplate({
  variant = 'split',
  badge,
  title,
  description,
  heroTitle,
  heroDescription,
  features,
  illustration,
  icon,
  maskedEmail,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  onFooterLinkClick,
  className,
}: AuthTemplateProps) {
  if (variant === 'centered') {
    return (
      <div className={cn('w-full max-w-lg mx-auto my-auto py-4 overflow-hidden', className)}>
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/90 text-center flex flex-col items-center">
          {/* Optional top icon container */}
          {icon && <div className="mb-4">{icon}</div>}

          {/* Pill Badge */}
          {badge && (
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 mb-3 border border-teal-100/60">
              {badge}
            </span>
          )}

          {/* Heading & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163346] tracking-tight">
            {title}
          </h1>
          {description && <p className="text-sm text-slate-500 mt-2 max-w-sm">{description}</p>}

          {/* Masked Email Chip */}
          {maskedEmail && (
            <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-700">
              <span className="text-teal-600 font-bold">@</span>
              <span>{maskedEmail}</span>
            </div>
          )}

          {/* Children / Form */}
          <div className="w-full mt-6">{children}</div>

          {/* Footer Text & Link */}
          {footerText && footerLinkText && (
            <p className="text-xs text-slate-500 mt-6">
              {footerText}{' '}
              {footerLinkHref ? (
                <Link
                  href={footerLinkHref}
                  onClick={onFooterLinkClick}
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                >
                  {footerLinkText}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onFooterLinkClick}
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
                >
                  {footerLinkText}
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default: Split Layout
  return (
    <div
      className={cn(
        'w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-4',
        className
      )}
    >
      {/* Left Column: Hero branding, features & illustration */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
        {heroTitle && (
          <div className="space-y-3 max-w-xl">
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-[#163346] tracking-tight leading-[1.15]">
              {heroTitle}
            </h1>
            {heroDescription && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                {heroDescription}
              </p>
            )}
          </div>
        )}

        {/* Feature Badges Row (e.g. on Registration) */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl pt-1">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/90 backdrop-blur-xs border border-slate-100 shadow-2xs"
                >
                  <div
                    className={cn(
                      'p-2 rounded-xl shrink-0',
                      feat.iconBg || 'bg-teal-50 text-teal-600'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', feat.iconColor)} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{feat.title}</p>
                    <p className="text-[11px] text-slate-500 leading-tight">{feat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Illustration graphic */}
        <div className="w-full flex justify-center lg:justify-start pt-2">
          {illustration || <AuthIllustration />}
        </div>
      </div>

      {/* Right Column: White Card with form */}
      <div className="lg:col-span-6 xl:col-span-5 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/90 w-full max-w-md mx-auto">
          {/* Top Pill Badge */}
          {badge && (
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 mb-3 border border-teal-100/60">
              {badge}
            </span>
          )}

          {/* Card Title & Subtitle */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163346] tracking-tight">
            {title}
          </h2>
          {description && <p className="text-sm text-slate-500 mt-1.5 mb-6">{description}</p>}

          {/* The Form Content */}
          <div className="w-full">{children}</div>

          {/* Card Footer Link */}
          {footerText && footerLinkText && (
            <p className="text-xs text-center text-slate-500 mt-5">
              {footerText}{' '}
              {footerLinkHref ? (
                <Link
                  href={footerLinkHref}
                  onClick={onFooterLinkClick}
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                >
                  {footerLinkText}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onFooterLinkClick}
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
                >
                  {footerLinkText}
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
