import { describe, expect, it } from 'bun:test';
import type {
  ActionConfirmModalProps,
  ActionModalBanner,
  ActionModalMetadata,
  ActionModalVariant,
  AlertContexType,
} from '@/hooks/useService/useAlert/costum-alert';

describe('Action Modal Types and Exports', () => {
  it('exports action modal types correctly from costum-alert', () => {
    const variant: ActionModalVariant = 'publish';
    expect(variant).toBe('publish');

    const banner: ActionModalBanner = {
      title: 'Kepatuhan Kurikulum',
      message: 'Pastikan tata bahasa sesuai pedoman',
      variant: 'info',
    };
    expect(banner.title).toBe('Kepatuhan Kurikulum');
    expect(banner.variant).toBe('info');

    const metadata: ActionModalMetadata = {
      title: 'RINGKASAN INFORMASI MATERI',
      items: [
        { label: 'Kategori', value: 'Pemahaman Inferensial' },
        { label: 'Tujuan Pembelajaran', value: '3 Poin Tervalidasi' },
      ],
    };
    expect(metadata.items.length).toBe(2);
    expect(metadata.items[0].label).toBe('Kategori');

    const modalProps: ActionConfirmModalProps = {
      variant: 'delete',
      title: 'Hapus Materi Pembelajaran?',
      description: 'Apakah Anda yakin ingin menghapus materi ini?',
      checkboxText: 'Saya memahami konsekuensi penghapusan.',
      confirmButtonText: 'Ya, Hapus Materi',
      confirmButtonVariant: 'destructive',
    };
    expect(modalProps.variant).toBe('delete');
    expect(modalProps.confirmButtonText).toBe('Ya, Hapus Materi');
  });

  it('validates AlertContexType contract', () => {
    // Structural type checking of AlertContexType
    const dummyContext: AlertContexType = {
      toast: () => {},
      modal: () => {},
      confirm: async () => true,
      actionConfirm: async () => true,
      confirmAction: async () => true,
    };

    expect(typeof dummyContext.toast).toBe('function');
    expect(typeof dummyContext.modal).toBe('function');
    expect(typeof dummyContext.confirm).toBe('function');
    expect(typeof dummyContext.actionConfirm).toBe('function');
    expect(typeof dummyContext.confirmAction).toBe('function');
  });
});
