'use client';

import { createContext, useContext, useState } from 'react';
import { Toaster as Sonner, toast } from 'sonner';
import { AlertModal } from '@/core/components/alert-modal';
import { ToastEffect } from '@/core/components/alert-toast';
import { AlertContexType, ModalProps, ToastProps } from '@/types/ui';

const AlertContex = createContext<AlertContexType | undefined>(undefined);

export const useAlert = (): AlertContexType => {
  const contex = useContext(AlertContex);
  if (!contex) throw new Error('useAlert must be used within an AlertProvider');
  return contex;
};

export const AlertProvinder = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState<ModalProps | null>(null);
  const [resolver, setResolver] = useState<(res: boolean) => void>();

  const toastAlert = ({ message, title, icon = 'info' }: ToastProps) => {
    toast.custom(() => <ToastEffect title={title} message={message} icon={icon} />, {
      duration: 4000,
    });
  };

  const showModal = (p: ModalProps) => {
    setModal(p);
  };

  const confirm = (p: ModalProps): Promise<boolean> => {
    setModal(p);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    modal?.onConfirm?.();
    setModal(null);
    resolver?.(true);
  };
  const handleCancel = () => {
    modal?.onClose?.();
    setModal(null);
    resolver?.(true);
  };

  return (
    <AlertContex.Provider value={{ toast: toastAlert, modal: showModal, confirm }}>
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
          setOpen={() => setModal(null)}
          title={modal.title}
          deskripsi={modal.deskripsi}
          icon={modal.icon}
          confirmButtonText={modal.confirmButtonText || 'OK'}
          confirmButtonColor={modal.confirmButtonColor || 'bg-primary'}
          onConfirm={handleConfirm}
          cancelText={'Batal'}
          onCancel={handleCancel}
        />
      )}
    </AlertContex.Provider>
  );
};
