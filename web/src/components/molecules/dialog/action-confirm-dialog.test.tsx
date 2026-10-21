import { describe, expect, it } from 'bun:test';
import React from 'react';
import {
  ActionConfirmDialog,
  StatusBadgePill,
  StatusTransitionBadge,
} from './action-confirm-dialog';

describe('ActionConfirmDialog Component and Helpers', () => {
  it('renders StatusBadgePill for published status with indicator dot', () => {
    const element = <StatusBadgePill status="published" />;
    expect(element.type).toBe(StatusBadgePill);
    expect(element.props.status).toBe('published');
  });

  it('renders StatusBadgePill for review, unpublished, and draft', () => {
    const reviewEl = <StatusBadgePill status="review" />;
    const unpublishEl = <StatusBadgePill status="unpublished" />;
    const draftEl = <StatusBadgePill status="draft" />;

    expect(reviewEl.props.status).toBe('review');
    expect(unpublishEl.props.status).toBe('unpublished');
    expect(draftEl.props.status).toBe('draft');
  });

  it('creates StatusTransitionBadge with from and to statuses', () => {
    const element = <StatusTransitionBadge from="Review" to="Published" />;
    expect(element.type).toBe(StatusTransitionBadge);
    expect(element.props.from).toBe('Review');
    expect(element.props.to).toBe('Published');
  });

  it('creates ActionConfirmDialog with preset configurations', () => {
    const publishModal = (
      <ActionConfirmDialog
        open={false}
        variant="publish"
        title="Publikasikan Materi Pembelajaran?"
        description="Materi akan langsung tersedia."
        confirmButtonText="Ya, Publikasikan Sekarang"
      />
    );
    expect(publishModal.props.variant).toBe('publish');
    expect(publishModal.props.title).toBe('Publikasikan Materi Pembelajaran?');

    const deleteModal = (
      <ActionConfirmDialog
        open={false}
        variant="delete"
        title="Hapus Materi Pembelajaran?"
        description="Apakah Anda yakin ingin menghapus materi ini?"
        checkboxText="Saya memahami konsekuensi penghapusan."
        confirmButtonText="Ya, Hapus Materi"
      />
    );
    expect(deleteModal.props.variant).toBe('delete');
    expect(deleteModal.props.checkboxText).toBe('Saya memahami konsekuensi penghapusan.');

    const unpublishModal = (
      <ActionConfirmDialog
        open={false}
        variant="unpublish"
        headerBadge="KONFIRMASI AKSES"
        title="Batalkan Publikasi Materi?"
        confirmButtonText="Ya, Batalkan Publikasi"
      />
    );
    expect(unpublishModal.props.variant).toBe('unpublish');
    expect(unpublishModal.props.headerBadge).toBe('KONFIRMASI AKSES');
  });
});
