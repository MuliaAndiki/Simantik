'use client';

import { createContext, useContext, useState } from 'react';
import { Toaster as Sonner, toast } from 'sonner';
import { AlertModal } from '@/core/components/alert-modal';
import { ToastEffect } from '@/core/components/alert-toast';
import type {
  ActionConfirmModalProps,
  ActionModalBanner,
  ActionModalBannerVariant,
  ActionModalCheckboxConfig,
  ActionModalMetadata,
  ActionModalMetadataItem,
  ActionModalStatusTone,
  ActionModalVariant,
  AlertContexType,
  ModalProps,
  ToastProps,
} from '@/types/ui';

export type {
  ActionConfirmModalProps,
  ActionModalBanner,
  ActionModalBannerVariant,
  ActionModalCheckboxConfig,
  ActionModalMetadata,
  ActionModalMetadataItem,
  ActionModalStatusTone,
  ActionModalVariant,
  AlertContexType,
  ModalProps,
  ToastProps,
};

const AlertContex = createContext<AlertContexType | undefined>(undefined);

export const useAlert = (): AlertContexType => {
  const contex = useContext(AlertContex);
  if (!contex) throw new Error('useAlert must be used within an AlertProvider');
  return contex;
};

export const AlertProvinder = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState<ActionConfirmModalProps | null>(null);
  const [resolver, setResolver] = useState<(res: boolean) => void>();

  const toastAlert = ({ message, title, icon = 'info' }: ToastProps) => {
    toast.custom(() => <ToastEffect title={title} message={message} icon={icon} />, {
      duration: 4000,
    });
  };

  const showModal = (p: ActionConfirmModalProps | ModalProps) => {
    setModal(p as ActionConfirmModalProps);
  };

  const confirm = (p: ActionConfirmModalProps | ModalProps): Promise<boolean> => {
    setModal(p as ActionConfirmModalProps);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const actionConfirm = (p: ActionConfirmModalProps): Promise<boolean> => {
    return confirm(p);
  };

  const handleConfirm = async () => {
    try {
      if (modal?.onConfirm) {
        await modal.onConfirm();
      }
      resolver?.(true);
      setModal(null);
    } catch (err) {
      console.error('Confirmation error:', err);
    }
  };

  const handleCancel = () => {
    modal?.onClose?.();
    modal?.onCancel?.();
    setModal(null);
    resolver?.(false);
  };

  return (
    <AlertContex.Provider
      value={{
        toast: toastAlert,
        modal: showModal,
        confirm,
        actionConfirm,
        confirmAction: actionConfirm,
      }}
    >
      {children}
      <Sonner
        position="top-center"
        theme="light"
        expand={false}
        visibleToasts={3}
        offset={16}
        toastOptions={{ unstyled: true }}
      />
      {modal && (
        <AlertModal
          open={!!modal}
          setOpen={(isOpen) => {
            if (!isOpen) handleCancel();
          }}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleCancel();
          }}
          {...modal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </AlertContex.Provider>
  );
};

export const AlertProvider = AlertProvinder;
