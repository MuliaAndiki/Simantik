import type { ReactNode } from 'react';
import type { ActionConfirmModalProps, ActionModalVariant } from './action-modal.types';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'question';

export interface ModalProps extends Partial<Omit<ActionConfirmModalProps, 'icon'>> {
  title: ReactNode;
  icon?: ToastType | ActionModalVariant | any;
  deskripsi?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export interface ToastProps {
  title?: string;
  icon?: ToastType;
  message: string;
  onVoid?: () => void;
}

export interface AlertContexType {
  toast: (p: ToastProps) => void;
  modal: (p: ActionConfirmModalProps | ModalProps) => void;
  confirm: (p: ActionConfirmModalProps | ModalProps) => Promise<boolean>;
  actionConfirm: (p: ActionConfirmModalProps) => Promise<boolean>;
  confirmAction: (p: ActionConfirmModalProps) => Promise<boolean>;
}

export * from './action-modal.types';
export * from './content-manager-dashboard.types';
export * from './legal.types';
export * from './material-editor.types';
export * from './material-manager.types';
export * from './practice.types';
export * from './practice-manager.types';
export * from './practice-question-editor.types';
export * from './practice-result.types';
export * from './public.types';
export * from './tryout.types';
export * from './tryout-manager.types';
export * from './tryout-question-editor.types';
