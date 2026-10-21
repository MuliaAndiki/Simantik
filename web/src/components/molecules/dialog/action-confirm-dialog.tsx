'use client';

import {
  ArrowRight,
  Check,
  CheckCircle2,
  EyeOff,
  FileText,
  Info,
  Send,
  ShieldCheck,
  Star,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import React, { useId, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Spinner,
} from '@/components/atoms';
import type {
  ActionConfirmModalProps,
  ActionModalBanner,
  ActionModalMetadata,
  ActionModalMetadataItem,
  ActionModalStatusTone,
  ActionModalVariant,
} from '@/types/ui';
import { cn } from '@/utils/classname';

/**
 * Helper to render string text with **bold** highlights or raw ReactNode
 */
function renderFormattedText(content: React.ReactNode): React.ReactNode {
  if (typeof content !== 'string') {
    return content;
  }

  // Split by markdown bold syntax **...**
  const parts = content.split(/\*\*(.*?)\*\*/g);
  if (parts.length === 1) {
    return content;
  }

  return parts.map((part, index) => {
    // Odd indexes are bold matches
    if (index % 2 === 1) {
      return (
        <strong key={index} className="font-semibold text-slate-800 dark:text-slate-100">
          {part}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Reusable status badge pill component (e.g. Published, Review, Unpublished)
 */
export function StatusBadgePill({
  status,
  label,
  className,
}: {
  status: ActionModalStatusTone;
  label?: React.ReactNode;
  className?: string;
}) {
  const norm = String(status || '')
    .toLowerCase()
    .trim();

  if (norm === 'published') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
        {label || 'Published'}
      </span>
    );
  }

  if (norm === 'review' || norm === 'in_review') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
          className
        )}
      >
        {label || 'Review'}
      </span>
    );
  }

  if (norm === 'unpublished') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          className
        )}
      >
        {label || 'Unpublished'}
      </span>
    );
  }

  if (norm === 'draft') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
          className
        )}
      >
        {label || 'Draft'}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        className
      )}
    >
      {label || status}
    </span>
  );
}

/**
 * Reusable status transition indicator (e.g. [Review] -> [• Published])
 */
export function StatusTransitionBadge({
  from,
  to,
  className,
}: {
  from: React.ReactNode;
  to: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {typeof from === 'string' ? <StatusBadgePill status={from} /> : from}
      <ArrowRight className="size-3 text-slate-400 shrink-0" />
      {typeof to === 'string' ? <StatusBadgePill status={to} /> : to}
    </div>
  );
}

/**
 * Resolves legacy string icon names to action modal variant
 */
function resolveVariant(variant?: ActionModalVariant, iconProp?: unknown): ActionModalVariant {
  if (variant) return variant;

  if (typeof iconProp === 'string') {
    const iconLower = iconProp.toLowerCase();
    if (iconLower === 'error' || iconLower === 'danger') return 'destructive';
    if (iconLower === 'warning') return 'warning';
    if (iconLower === 'success') return 'success';
    if (iconLower === 'publish') return 'publish';
    if (iconLower === 'unpublish') return 'unpublish';
    if (iconLower === 'info' || iconLower === 'question') return 'info';
  }

  return 'default';
}

/**
 * ActionConfirmDialog
 *
 * Highly customizable, reusable confirmation and action modal matching SIMANTIK specifications.
 * Supports:
 * - Pre-configured variants ('publish', 'delete'/'destructive', 'unpublish', 'warning', 'info', etc.)
 * - Optional top badge pill (e.g. 'KONFIRMASI AKSES')
 * - Rich metadata summary card with 2-column key-values
 * - Callout alert banner (top or bottom placement)
 * - Confirmation agreement checkbox (disables action button until checked)
 * - Custom action buttons, spinners, and colors
 */
export function ActionConfirmDialog({
  variant,
  headerBadge,
  title,
  description,
  deskripsi,
  icon,
  iconBadge,
  hideIcon = false,
  banner,
  bannerPosition,
  metadata,
  checkbox,
  checkboxText,
  requireCheckbox = true,
  isChecked: controlledChecked,
  onCheckedChange,
  confirmButtonText,
  confirmText,
  confirmButtonVariant,
  confirmButtonColor,
  confirmIcon,
  cancelButtonText,
  cancelText,
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
  children,
  open = true,
  setOpen,
  onOpenChange,
  className,
}: ActionConfirmModalProps) {
  const checkboxId = useId();
  const [internalChecked, setInternalChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalize description prop
  const mainDesc = description ?? deskripsi;

  // Resolve active variant
  const activeVariant = resolveVariant(variant, icon);

  // Default header badge for 'unpublish' variant if not provided
  const resolvedHeaderBadge =
    headerBadge ?? (activeVariant === 'unpublish' ? 'KONFIRMASI AKSES' : undefined);

  // Checkbox configuration
  const checkboxConfig =
    typeof checkbox === 'object' && checkbox !== null && 'text' in checkbox
      ? checkbox
      : checkboxText
        ? { text: checkboxText }
        : typeof checkbox === 'string' || React.isValidElement(checkbox)
          ? { text: checkbox }
          : null;

  const hasCheckbox = Boolean(checkboxConfig);
  const isCheckboxRequired = hasCheckbox && (checkboxConfig?.required ?? requireCheckbox);

  const isChecked =
    controlledChecked !== undefined
      ? controlledChecked
      : (checkboxConfig?.checked ?? internalChecked);

  const handleCheckboxChange = (checked: boolean) => {
    if (controlledChecked === undefined) {
      setInternalChecked(checked);
    }
    checkboxConfig?.onChange?.(checked);
    onCheckedChange?.(checked);
  };

  // Close / cancel handlers
  const handleClose = () => {
    onClose?.();
    onCancel?.();
    setOpen?.(false);
    onOpenChange?.(false);
  };

  const handleConfirm = async () => {
    if (isLoading || isSubmitting) return;
    if (isCheckboxRequired && !isChecked) return;

    try {
      setIsSubmitting(true);
      await onConfirm?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = isLoading || isSubmitting;
  const isConfirmDisabled = isPending || (isCheckboxRequired && !isChecked);

  // Preset styles by variant
  let iconBoxClass =
    'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';
  let defaultIcon: React.ReactNode = <Info className="size-5" />;
  let defaultIconBadge: React.ReactNode = null;

  let confirmButtonClass = 'bg-primary hover:bg-primary/90 text-white font-medium shadow-xs';
  let defaultConfirmIcon: React.ReactNode = <Check className="size-4 shrink-0" />;
  let defaultConfirmText = 'Konfirmasi';

  if (activeVariant === 'publish') {
    iconBoxClass =
      'bg-teal-50 border-teal-200/90 text-teal-600 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-400';
    defaultIcon = <FileText className="size-5" />;
    defaultIconBadge = (
      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-xs ring-2 ring-white dark:ring-slate-900">
        <Star className="size-2.5 fill-slate-950 text-slate-950" />
      </span>
    );
    confirmButtonClass = 'bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-xs';
    defaultConfirmIcon = <Send className="size-4 shrink-0" />;
    defaultConfirmText = 'Ya, Publikasikan Sekarang';
  } else if (activeVariant === 'delete' || activeVariant === 'destructive') {
    iconBoxClass =
      'bg-rose-50 border-rose-200/90 text-rose-500 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400';
    defaultIcon = <Trash2 className="size-5" />;
    confirmButtonClass = 'bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs';
    defaultConfirmIcon = <Trash2 className="size-4 shrink-0" />;
    defaultConfirmText = 'Ya, Hapus Materi';
  } else if (activeVariant === 'unpublish') {
    iconBoxClass =
      'bg-cyan-50 border-cyan-200/90 text-cyan-600 dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-400';
    defaultIcon = <EyeOff className="size-5" />;
    confirmButtonClass = 'bg-slate-500 hover:bg-slate-600 text-white font-medium shadow-xs';
    defaultConfirmIcon = <EyeOff className="size-4 shrink-0" />;
    defaultConfirmText = 'Ya, Batalkan Publikasi';
  } else if (activeVariant === 'warning') {
    iconBoxClass =
      'bg-amber-50 border-amber-200/90 text-amber-600 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400';
    defaultIcon = <TriangleAlert className="size-5" />;
    confirmButtonClass = 'bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-xs';
    defaultConfirmIcon = <TriangleAlert className="size-4 shrink-0" />;
    defaultConfirmText = 'Lanjutkan';
  } else if (activeVariant === 'success') {
    iconBoxClass =
      'bg-emerald-50 border-emerald-200/90 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400';
    defaultIcon = <CheckCircle2 className="size-5" />;
    confirmButtonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs';
    defaultConfirmIcon = <CheckCircle2 className="size-4 shrink-0" />;
    defaultConfirmText = 'Selesai';
  } else if (activeVariant === 'info') {
    iconBoxClass =
      'bg-sky-50 border-sky-200/90 text-sky-600 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-400';
    defaultIcon = <Info className="size-5" />;
    confirmButtonClass = 'bg-primary hover:bg-primary/90 text-white font-medium shadow-xs';
    defaultConfirmIcon = <Info className="size-4 shrink-0" />;
    defaultConfirmText = 'Mengerti';
  }

  // Custom button overrides
  if (confirmButtonVariant === 'destructive') {
    confirmButtonClass = 'bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs';
  } else if (confirmButtonVariant === 'warning') {
    confirmButtonClass = 'bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-xs';
  } else if (confirmButtonVariant === 'slate') {
    confirmButtonClass = 'bg-slate-500 hover:bg-slate-600 text-white font-medium shadow-xs';
  } else if (confirmButtonVariant === 'outline') {
    confirmButtonClass =
      'border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium';
  }

  if (confirmButtonColor) {
    confirmButtonClass = cn(confirmButtonColor, 'text-white font-medium shadow-xs');
  }

  const finalConfirmText = confirmButtonText || confirmText || defaultConfirmText;
  const finalCancelText = cancelButtonText || cancelText || 'Batal';
  const finalConfirmIcon = confirmIcon !== undefined ? confirmIcon : defaultConfirmIcon;

  // Banner placement ('bottom' for 'publish' preset unless specified otherwise)
  const resolvedBannerPosition = bannerPosition ?? (activeVariant === 'publish' ? 'bottom' : 'top');

  // Render Callout Banner
  const renderBanner = () => {
    if (!banner) return null;

    const bannerVariant =
      banner.variant ||
      (activeVariant === 'delete' || activeVariant === 'destructive' ? 'danger' : 'info');

    let bannerBoxClass =
      'bg-cyan-50/50 border-cyan-100 text-cyan-950 dark:bg-cyan-950/20 dark:border-cyan-900/40 dark:text-cyan-200';
    let defaultBannerIcon = (
      <ShieldCheck className="size-4.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
    );

    if (bannerVariant === 'danger' || bannerVariant === 'warning') {
      bannerBoxClass =
        'bg-rose-50/70 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300';
      defaultBannerIcon = (
        <TriangleAlert className="size-4.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
      );
    } else if (bannerVariant === 'success') {
      bannerBoxClass =
        'bg-emerald-50/60 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-200';
      defaultBannerIcon = (
        <CheckCircle2 className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
      );
    }

    return (
      <div
        className={cn(
          'rounded-xl border p-3 sm:p-3.5 flex items-start gap-2.5 transition-colors',
          bannerBoxClass
        )}
      >
        {banner.icon || defaultBannerIcon}
        <div className="text-xs leading-relaxed min-w-0 flex-1">
          {banner.title && (
            <p className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
              {banner.title}
            </p>
          )}
          <div className="text-inherit opacity-95">{renderFormattedText(banner.message)}</div>
        </div>
      </div>
    );
  };

  // Render Metadata Card
  const renderMetadata = () => {
    if (!metadata) return null;
    const isArray = Array.isArray(metadata);
    const items = isArray ? metadata : metadata.items;
    const metaTitle = !isArray ? metadata.title : undefined;

    if (!items || items.length === 0) return null;

    return (
      <div className="bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 sm:p-4">
        {metaTitle && (
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            {metaTitle}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {items.map((item, idx) => (
            <div key={idx} className={item.colSpan === 2 ? 'sm:col-span-2' : ''}>
              <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                {item.label}
              </p>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange?.(true);
      }}
    >
      <DialogContent
        className={cn(
          'sm:max-w-lg rounded-2xl p-5 sm:p-6 gap-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl',
          className
        )}
      >
        {/* Header Section */}
        <DialogHeader className="text-left gap-0">
          <div className="flex items-start gap-3.5 sm:gap-4 pr-6">
            {!hideIcon && (
              <div className="relative shrink-0">
                <div
                  className={cn(
                    'size-11 sm:size-12 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-colors',
                    iconBoxClass
                  )}
                >
                  {icon && typeof icon !== 'string' ? icon : defaultIcon}
                </div>
                {iconBadge !== undefined ? iconBadge : defaultIconBadge}
              </div>
            )}

            <div className="min-w-0 flex-1">
              {resolvedHeaderBadge && (
                <div className="mb-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {resolvedHeaderBadge}
                  </span>
                </div>
              )}
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">
                {title}
              </DialogTitle>
              {mainDesc && (
                <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {renderFormattedText(mainDesc)}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Dialog Body Content */}
        <div className="flex flex-col gap-3 pt-1">
          {resolvedBannerPosition === 'top' && renderBanner()}
          {renderMetadata()}
          {resolvedBannerPosition === 'bottom' && renderBanner()}

          {children}

          {/* Agreement Checkbox */}
          {hasCheckbox && checkboxConfig && (
            <label
              htmlFor={checkboxId}
              className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <input
                id={checkboxId}
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
                className="mt-0.5 size-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer shrink-0"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {renderFormattedText(checkboxConfig.text)}
              </span>
            </label>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            {finalCancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={cn(
              'px-4 py-2 text-xs sm:text-sm rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
              confirmButtonClass
            )}
          >
            {isPending ? <Spinner size="sm" /> : finalConfirmIcon}
            <span>{finalConfirmText}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
