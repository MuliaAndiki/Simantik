'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import type { CompetencyOptionItem, CreateCompetencyInput } from '@/utils/competency.util';

export interface UseCompetencyDropdownActionsOptions {
  limit?: number;
  onCreated?: (competency: CompetencyOptionItem) => void;
  onDeleted?: (deletedId: string) => void;
}

/**
 * Shared container hook providing live competency options alongside
 * inline create and confirmed soft-delete handlers for CMS dropdowns.
 */
export function useCompetencyDropdownActions(options: UseCompetencyDropdownActionsOptions = {}) {
  const { limit = 100, onCreated, onDeleted } = options;
  const api = useApi();
  const ns = useAppNameSpace();

  const competenciesQuery = api.question.query.competencies({ limit });
  const createCompetencyMutation = api.question.mutate.createCompetency();
  const deleteCompetencyMutation = api.question.mutate.deleteCompetency();

  const [deletingCompetencyId, setDeletingCompetencyId] = useState<string | null>(null);

  const competencies = useMemo<CompetencyOptionItem[]>(() => {
    const list = competenciesQuery.data?.competencies ?? [];
    return list.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      description: c.description,
    }));
  }, [competenciesQuery.data]);

  const handleCreateCompetency = useCallback(
    async (input: CreateCompetencyInput): Promise<CompetencyOptionItem | null> => {
      const name = input.name.trim();
      const code = input.code?.trim();
      const description = input.description?.trim();

      if (name.length < 2) {
        ns.alert.toast({
          title: 'Nama Tidak Valid',
          message: 'Nama kompetensi minimal terdiri dari 2 karakter.',
          icon: 'warning',
        });
        return null;
      }

      try {
        const res = await createCompetencyMutation.mutateAsync({
          name,
          code: code || undefined,
          description: description || undefined,
        });
        if (!res.data?.id) {
          return null;
        }
        const created: CompetencyOptionItem = {
          id: res.data.id,
          code: res.data.code,
          name: res.data.name,
          description: res.data.description,
        };
        onCreated?.(created);
        return created;
      } catch {
        return null;
      }
    },
    [createCompetencyMutation, ns.alert, onCreated]
  );

  const handleRequestDeleteCompetency = useCallback(
    async (competency: CompetencyOptionItem): Promise<boolean> => {
      const confirmed = await ns.alert.confirm({
        variant: 'delete',
        title: 'Hapus Kompetensi',
        description: `Apakah Anda yakin ingin menghapus kompetensi "${competency.name}"?`,
        banner: {
          title: 'Data Konten & Evaluasi Tetap Aman',
          variant: 'info',
          message:
            'Menghapus kompetensi ini hanya melepaskan relasi aktifnya. Modul/materi ajar, paket latihan, butir soal, soal tryout, dan riwayat evaluasi siswa tidak akan terhapus dan otomatis menjadi Umum / Tanpa Kompetensi Khusus.',
        },
        confirmText: 'Ya, Hapus Kompetensi',
        cancelText: 'Batal',
      });

      if (!confirmed) {
        return false;
      }

      setDeletingCompetencyId(competency.id);
      try {
        await deleteCompetencyMutation.mutateAsync(competency.id);
        onDeleted?.(competency.id);
        return true;
      } catch {
        return false;
      } finally {
        setDeletingCompetencyId(null);
      }
    },
    [deleteCompetencyMutation, ns.alert, onDeleted]
  );

  return {
    competencies,
    competenciesQuery,
    isLoadingCompetencies: competenciesQuery.isPending,
    isCreatingCompetency: createCompetencyMutation.isPending,
    isDeletingCompetency: deleteCompetencyMutation.isPending,
    deletingCompetencyId,
    handleCreateCompetency,
    handleRequestDeleteCompetency,
  };
}
