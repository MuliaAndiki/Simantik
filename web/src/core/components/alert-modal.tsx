'use client';

import { ActionConfirmDialog } from '@/components/molecules/dialog/action-confirm-dialog';
import type { ActionConfirmModalProps, ModalProps } from '@/types/ui';

export interface AlertModalInternalProps extends ModalProps {
  open: boolean;
  setOpen?: (v: boolean) => void;
  cancelText?: string;
  onCancel?: () => void;
}

export type AlertModalProps = ActionConfirmModalProps & {
  cancelText?: string;
  onCancel?: () => void;
  setOpen?: (v: boolean) => void;
};

/**
 * AlertModal
 *
 * Backwards-compatible modal component powered by the rich ActionConfirmDialog.
 * Supports legacy props (title, deskripsi, icon) as well as the new rich action
 * modal presets (variant: 'publish' | 'delete' | 'unpublish', metadata, banner, checkbox).
 */
export function AlertModal(props: AlertModalProps) {
  return <ActionConfirmDialog {...props} />;
}

export { ActionConfirmDialog as ActionConfirmModal };
