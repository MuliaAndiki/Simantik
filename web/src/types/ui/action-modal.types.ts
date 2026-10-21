import type { ReactNode } from 'react';

/**
 * Predefined semantic variants for Action Modal:
 * - 'publish': Teal icon container with gold star badge, amber action button
 * - 'delete' | 'destructive': Rose icon container with trash icon, red action button
 * - 'unpublish': Cyan icon container with eye-off icon, slate action button
 * - 'warning': Amber icon container with warning triangle
 * - 'info': Sky blue icon container with info icon
 * - 'success': Emerald icon container with check icon
 * - 'default': Neutral gray icon container
 */
export type ActionModalVariant =
  | 'publish'
  | 'delete'
  | 'destructive'
  | 'unpublish'
  | 'warning'
  | 'info'
  | 'success'
  | 'default';

/**
 * Banner alert styling variants
 */
export type ActionModalBannerVariant = 'info' | 'warning' | 'danger' | 'success' | 'neutral';

/**
 * Status tone presets for status badges & transitions
 */
export type ActionModalStatusTone =
  | 'published'
  | 'unpublished'
  | 'review'
  | 'draft'
  | 'default'
  | string;

/**
 * Callout banner configuration
 */
export interface ActionModalBanner {
  /** Optional title for the banner (e.g. 'Informasi Proteksi Konten') */
  title?: string;
  /** Main message content (supports ReactNode or markdown bold with **) */
  message: ReactNode;
  /** Custom icon override */
  icon?: ReactNode;
  /** Color tone variant for the banner */
  variant?: ActionModalBannerVariant;
}

/**
 * Single metadata item in the summary card
 */
export interface ActionModalMetadataItem {
  /** Uppercase field label (e.g. 'KATEGORI', 'PENULIS', 'TRANSISI STATUS') */
  label: string;
  /** Value element or string (e.g. 'Pemahaman Inferensial' or <StatusTransitionBadge />) */
  value: ReactNode;
  /** Grid column span in 2-column layout (1 or 2) */
  colSpan?: 1 | 2;
}

/**
 * Metadata summary card configuration
 */
export interface ActionModalMetadata {
  /** Optional uppercase title heading (e.g. 'RINGKASAN INFORMASI MATERI') */
  title?: string;
  /** Array of metadata rows */
  items: ActionModalMetadataItem[];
}

/**
 * Checkbox agreement configuration
 */
export interface ActionModalCheckboxConfig {
  /** Checkbox label text / ReactNode */
  text: ReactNode;
  /** Initial checked state */
  defaultChecked?: boolean;
  /** Controlled checked state */
  checked?: boolean;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Whether checking is required before confirm button is enabled (default: true) */
  required?: boolean;
}

/**
 * Props for Action Confirm Modal component
 */
export interface ActionConfirmModalProps {
  /**
   * Action variant preset matching SIMANTIK design patterns
   */
  variant?: ActionModalVariant;

  /**
   * Optional top pill badge above title (e.g. 'KONFIRMASI AKSES')
   */
  headerBadge?: ReactNode;

  /**
   * Modal Title (e.g. 'Publikasikan Materi Pembelajaran?')
   */
  title: ReactNode;

  /**
   * Main description text (supports string with **bold** or ReactNode)
   */
  description?: ReactNode;

  /**
   * Backward-compatibility alias for description
   */
  deskripsi?: ReactNode;

  /**
   * Custom icon element to replace the variant preset icon
   */
  icon?: ReactNode;

  /**
   * Small badge icon positioned at top-right of the icon box (e.g. gold star)
   */
  iconBadge?: ReactNode;

  /**
   * Hide the header icon container entirely
   */
  hideIcon?: boolean;

  /**
   * Callout / alert banner configuration
   */
  banner?: ActionModalBanner;

  /**
   * Position of the callout banner relative to the metadata card ('top' | 'bottom').
   * Defaults to 'top' ('bottom' for 'publish' preset)
   */
  bannerPosition?: 'top' | 'bottom';

  /**
   * Metadata summary card (object with title + items, or array of items)
   */
  metadata?: ActionModalMetadata | ActionModalMetadataItem[];

  /**
   * Confirmation agreement checkbox config or ReactNode text
   */
  checkbox?: ReactNode | ActionModalCheckboxConfig;

  /**
   * Shorthand agreement checkbox text (disables confirm button until checked)
   */
  checkboxText?: ReactNode;

  /**
   * Whether checking the agreement checkbox is required to enable confirm (default: true)
   */
  requireCheckbox?: boolean;

  /**
   * Controlled checked state for external management
   */
  isChecked?: boolean;

  /**
   * Controlled checked change callback
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Confirm button text (defaults based on variant preset)
   */
  confirmButtonText?: string;
  confirmText?: string;

  /**
   * Confirm button variant or preset style
   */
  confirmButtonVariant?: 'default' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'slate';

  /**
   * Custom CSS classes for confirm button
   */
  confirmButtonColor?: string;

  /**
   * Icon inside confirm button
   */
  confirmIcon?: ReactNode;

  /**
   * Cancel button text (defaults to 'Batal')
   */
  cancelButtonText?: string;
  cancelText?: string;

  /**
   * Loading state for confirmation action
   */
  isLoading?: boolean;

  /**
   * Callback when confirmed
   */
  onConfirm?: () => void | Promise<void>;

  /**
   * Callback when cancelled
   */
  onCancel?: () => void;

  /**
   * Callback when closed / dismissed
   */
  onClose?: () => void;

  /**
   * Optional custom children rendered inside the modal body
   */
  children?: ReactNode;

  /**
   * Controlled open state for direct JSX usage
   */
  open?: boolean;

  /**
   * Open state setter
   */
  setOpen?: (open: boolean) => void;

  /**
   * Radix open change callback
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Custom className for DialogContent
   */
  className?: string;
}
