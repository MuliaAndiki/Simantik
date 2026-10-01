'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DocsCreatePage from '@/components/page/private/content_manager/DocsCreatePage';
import { useApi } from '@/hooks/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import type { CreateDocumentationRequest } from '@/types/service';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';

const EMPTY_DOCS_FORM: CreateDocumentationRequest = {
  title: '',
  slug: '',
  content: '',
  category: '',
  status: 'draft',
};

const DocsCreateContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const api = useApi();
  const ns = useAppNameSpace();

  const [formCreateDoc, setFormCreateDoc] = useState<CreateDocumentationRequest>(EMPTY_DOCS_FORM);

  const { data: existingDoc, isLoading: isDocLoading } = api.content.query.cmsDocumentationDetail(
    editId || '',
    { enabled: !!editId }
  );

  const createDocMutation = api.content.mutate.createDocumentation();
  const updateDocMutation = api.content.mutate.updateDocumentation();

  useEffect(() => {
    if (existingDoc) {
      setFormCreateDoc({
        title: existingDoc.title,
        slug: existingDoc.slug,
        content: existingDoc.content,
        category: existingDoc.category ?? '',
        status: existingDoc.status,
      });
    }
  }, [existingDoc]);

  const handleFormChange = <K extends keyof CreateDocumentationRequest>(
    field: K,
    value: CreateDocumentationRequest[K]
  ) => {
    setFormCreateDoc((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormCreateDoc((prev) => ({ ...prev, content }));
  };

  const handleUploadContentImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await uploadAvatar(formData, 'docs-content');
    } catch (error) {
      ns.alert.toast({
        title: 'Upload Gagal',
        message: error instanceof Error ? error.message : 'Gagal mengunggah gambar konten',
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
    router.push(`${basePath}/docs`);
  };

  const executeSave = (status: string) => {
    if (!formCreateDoc.title.trim()) {
      ns.alert.toast({
        title: 'Judul Wajib Diisi',
        message: 'Mohon masukkan judul dokumen sebelum menyimpan.',
        icon: 'warning',
      });
      return;
    }

    if (!formCreateDoc.category.trim()) {
      ns.alert.toast({
        title: 'Kategori Wajib Diisi',
        message: 'Mohon masukkan kategori dokumen sebelum menyimpan.',
        icon: 'warning',
      });
      return;
    }

    const body = {
      title: formCreateDoc.title.trim(),
      slug: formCreateDoc.slug?.trim() || undefined,
      content: formCreateDoc.content,
      category: formCreateDoc.category.trim(),
      status,
    };

    if (editId) {
      updateDocMutation.mutate(
        { id: editId, body },
        { onSuccess: () => router.push(`${basePath}/docs`) }
      );
      return;
    }

    createDocMutation.mutate(body, {
      onSuccess: () => router.push(`${basePath}/docs`),
    });
  };

  const handleSaveDraft = () => executeSave('draft');

  const handlePublish = () => executeSave('published');

  const isSubmitting = createDocMutation.isPending || updateDocMutation.isPending || isDocLoading;

  return (
    <DocsCreatePage
      form={formCreateDoc}
      isEditMode={!!editId}
      isSubmitting={isSubmitting}
      onFormChange={handleFormChange}
      onContentChange={handleContentChange}
      onUploadContentImage={handleUploadContentImage}
      onDeleteImage={handleDeleteImage}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
};

export default DocsCreateContainer;
