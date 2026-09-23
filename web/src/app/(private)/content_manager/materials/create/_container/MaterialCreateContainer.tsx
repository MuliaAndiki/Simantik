'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { DEFAULT_DOCUMENT_HTML } from '@/components/molecules/editor';
import { MaterialCreatePage } from '@/components/page/private/content_manager/MaterialCreatePage';
import { useApi } from '@/hooks/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import type { LearningObjectiveItem, MaterialMetadata, RelevantTopicTag } from '@/types/ui';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';

const INITIAL_METADATA: MaterialMetadata = {
  judulMateri: '',
  kategoriPembelajaran: 'Pemahaman Tekstual',
  deskripsiRingkas: '',
  idDokumen: `DOC-${Date.now().toString().slice(-6)}`,
};

export function MaterialCreateContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const queryModuleId = searchParams.get('moduleId');
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const ns = useAppNameSpace();
  const api = useApi();

  const [metadata, setMetadata] = useState<MaterialMetadata>(INITIAL_METADATA);
  const [content, setContent] = useState<string>(DEFAULT_DOCUMENT_HTML);
  const [objectives, setObjectives] = useState<LearningObjectiveItem[]>([]);
  const [topics, setTopics] = useState<RelevantTopicTag[]>([]);
  const [isAddingTopic, setIsAddingTopic] = useState<boolean>(false);
  const [newTopicInput, setNewTopicInput] = useState<string>('');

  // 1. Fetch Material Detail if in Edit Mode
  const { data: existingMaterial, isLoading: isMaterialLoading } =
    api.learning.query.materialDetail(editId || '', {
      enabled: !!editId,
    });

  // Sync state when existing material is loaded
  useEffect(() => {
    if (existingMaterial) {
      setMetadata({
        judulMateri: existingMaterial.title || '',
        kategoriPembelajaran: existingMaterial.competency_name || 'Pemahaman Tekstual',
        deskripsiRingkas: existingMaterial.description || '',
        idDokumen: `DOC-${existingMaterial.id.slice(0, 8).toUpperCase()}`,
      });
      setContent(existingMaterial.content || DEFAULT_DOCUMENT_HTML);
    }
  }, [existingMaterial]);

  // Queries & Mutations
  const { data: modulesData } = api.learning.query.modules({ limit: 50 });
  const { data: competenciesData } = api.question.query.competencies({ limit: 50 });

  const createMaterialMutation = api.learning.mutate.createMaterial();
  const updateMaterialMutation = api.learning.mutate.updateMaterial();
  const createModuleMutation = api.learning.mutate.createModule();

  const categories = useMemo(() => {
    const list = (competenciesData?.competencies ?? []).map((c) => c.name);
    return list.length > 0
      ? list
      : [
          'Pemahaman Tekstual',
          'Kaidah Sintaksis',
          'Retorika & Diskursus',
          'Apresiasi Sastra',
          'Karya Tulis Ilmiah',
        ];
  }, [competenciesData]);

  const handleMetadataChange = (next: Partial<MaterialMetadata>) => {
    setMetadata((prev) => ({ ...prev, ...next }));
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleAddTopic = (label: string) => {
    const newTag: RelevantTopicTag = {
      id: String(Date.now()),
      label,
    };
    setTopics((prev) => [...prev, newTag]);
  };

  const handleStartAddTopic = () => setIsAddingTopic(true);
  const handleCancelAddTopic = () => {
    setIsAddingTopic(false);
    setNewTopicInput('');
  };
  const handleConfirmAddTopic = () => {
    if (newTopicInput.trim()) {
      handleAddTopic(newTopicInput.trim());
      setNewTopicInput('');
      setIsAddingTopic(false);
    }
  };

  const handleRemoveTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = await uploadAvatar(formData, 'materials');
      return url;
    } catch (error) {
      ns.alert.toast({
        title: 'Upload Gagal',
        message: error instanceof Error ? error.message : 'Gagal mengunggah gambar materi',
        icon: 'error',
      });
      throw error;
    }
  };

  const handleDeleteImage = async (url: string): Promise<void> => {
    try {
      await deleteObject(url);
    } catch (error) {
      console.error('Failed to delete orphaned image:', error);
    }
  };

  const handleCancel = () => {
    router.push(`${basePath}/materials`);
  };

  const executeSave = async (isReview: boolean) => {
    if (!metadata.judulMateri.trim()) {
      ns.alert.toast({
        title: 'Judul Wajib Diisi',
        message: 'Mohon masukkan judul materi pembelajaran sebelum menyimpan.',
        icon: 'warning',
      });
      return;
    }

    const matchedCompetency = (competenciesData?.competencies ?? []).find(
      (c) => c.name.toLowerCase() === metadata.kategoriPembelajaran.toLowerCase()
    );

    // ─── Mode Edit: Update Existing Material ──────────────────────────────
    if (editId) {
      updateMaterialMutation.mutate(
        {
          id: editId,
          body: {
            title: metadata.judulMateri.trim(),
            description: metadata.deskripsiRingkas.trim() || undefined,
            content,
            competency_id: matchedCompetency?.id,
            type: 'document',
            status: isReview ? 'in_review' : 'draft',
          },
        },
        {
          onSuccess: () => {
            ns.alert.toast({
              title: isReview ? 'Materi Diajukan untuk Review' : 'Perubahan Disimpan',
              message: `Materi "${metadata.judulMateri}" berhasil diperbarui.`,
              icon: 'success',
            });
            router.push(`${basePath}/materials`);
          },
          onError: (err) => {
            ns.alert.toast({
              title: 'Gagal Memperbarui Materi',
              message: err.message || 'Terjadi kesalahan saat menyimpan pembaruan ke server.',
              icon: 'error',
            });
          },
        }
      );
      return;
    }

    // ─── Mode Create: Buat Materi Baru ────────────────────────────────────
    let targetModuleId =
      queryModuleId || existingMaterial?.module_id || modulesData?.modules?.[0]?.id;

    // Auto-create a default module if none exists yet in the database
    if (!targetModuleId) {
      try {
        const newMod = await createModuleMutation.mutateAsync({
          title: 'Modul Bahasa Indonesia',
          description: 'Kumpulan bahan ajar resmi Kurikulum Merdeka SIMANTIK',
          jenjang: 'sma',
          display_order: 1,
        });
        targetModuleId = newMod.data?.id;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat menyiapkan wadah modul materi.';
        ns.alert.toast({
          title: 'Gagal Menyiapkan Modul',
          message: errorMessage,
          icon: 'error',
        });
        return;
      }
    }

    if (!targetModuleId) {
      ns.alert.toast({
        title: 'Modul Belum Tersedia',
        message: 'Tidak dapat menemukan modul untuk menyimpan materi.',
        icon: 'error',
      });
      return;
    }

    createMaterialMutation.mutate(
      {
        module_id: targetModuleId,
        competency_id: matchedCompetency?.id,
        title: metadata.judulMateri.trim(),
        description: metadata.deskripsiRingkas.trim() || undefined,
        content,
        type: 'document',
        display_order: 1,
      },
      {
        onSuccess: () => {
          ns.alert.toast({
            title: isReview ? 'Materi Diajukan' : 'Draft Tersimpan',
            message: isReview
              ? `Materi "${metadata.judulMateri}" berhasil diajukan untuk review kurator.`
              : `Draft "${metadata.judulMateri}" berhasil disimpan di sistem.`,
            icon: 'success',
          });
          router.push(`${basePath}/materials`);
        },
        onError: (err) => {
          ns.alert.toast({
            title: 'Gagal Menyimpan Materi',
            message: err.message || 'Terjadi kesalahan saat menyimpan materi ke server.',
            icon: 'error',
          });
        },
      }
    );
  };

  const handleSaveDraft = () => {
    executeSave(false);
  };

  const handleSubmitReview = () => {
    executeSave(true);
  };

  const handleNewTopicInputChange = (value: string) => {
    setNewTopicInput(value);
  };

  const isSaving =
    createMaterialMutation.isPending ||
    updateMaterialMutation.isPending ||
    createModuleMutation.isPending ||
    isMaterialLoading;

  return (
    <MaterialCreatePage
      metadata={metadata}
      categories={categories}
      content={content}
      objectives={objectives}
      topics={topics}
      isAddingTopic={isAddingTopic}
      newTopicInput={newTopicInput}
      onNewTopicInputChange={handleNewTopicInputChange}
      onStartAddTopic={handleStartAddTopic}
      onCancelAddTopic={handleCancelAddTopic}
      onConfirmAddTopic={handleConfirmAddTopic}
      onMetadataChange={handleMetadataChange}
      onContentChange={handleContentChange}
      onUploadImage={handleUploadImage}
      onDeleteImage={handleDeleteImage}
      onAddTopic={handleAddTopic}
      onRemoveTopic={handleRemoveTopic}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onSubmitReview={handleSubmitReview}
      isSubmitting={isSaving}
    />
  );
}

export default MaterialCreateContainer;
