'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NewsCreatePage from '@/components/page/private/content_manager/NewsCreatePage';
import { useApi } from '@/hooks/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import type { CreateNewsRequest } from '@/types/service';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';

const EMPTY_NEWS_FORM: CreateNewsRequest = {
  title: '',
  slug: '',
  content: '',
  thumbnailUrl: '',
  status: 'draft',
};

const NewsCreateContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const api = useApi();
  const ns = useAppNameSpace();

  const [formCreateNews, setFormCreateNews] = useState<CreateNewsRequest>(EMPTY_NEWS_FORM);

  const { data: existingNews, isLoading: isNewsLoading } = api.content.query.cmsNewsDetail(
    editId || '',
    { enabled: !!editId }
  );

  const createNewsMutation = api.content.mutate.createNews();
  const updateNewsMutation = api.content.mutate.updateNews();

  useEffect(() => {
    if (existingNews) {
      setFormCreateNews({
        id: existingNews.id,
        title: existingNews.title,
        slug: existingNews.slug,
        content: existingNews.content,
        thumbnailUrl: existingNews.thumbnailUrl ?? '',
        status: existingNews.status,
      });
    }
  }, [existingNews]);

  const handleFormChange = <K extends keyof CreateNewsRequest>(
    field: K,
    value: CreateNewsRequest[K]
  ) => {
    setFormCreateNews((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormCreateNews((prev) => ({ ...prev, content }));
  };

  const handleUploadThumbnail = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await uploadAvatar(formData, 'news');
    } catch (error) {
      ns.alert.toast({
        title: 'Upload Gagal',
        message: error instanceof Error ? error.message : 'Gagal mengunggah thumbnail berita',
        icon: 'error',
      });
      throw error;
    }
  };

  const handleUploadContentImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await uploadAvatar(formData, 'news-content');
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
    router.push(`${basePath}/news`);
  };

  const executeSave = (status: string) => {
    if (!formCreateNews.title.trim()) {
      ns.alert.toast({
        title: 'Judul Wajib Diisi',
        message: 'Mohon masukkan judul berita sebelum menyimpan.',
        icon: 'warning',
      });
      return;
    }

    const body = {
      title: formCreateNews.title.trim(),
      slug: formCreateNews.slug?.trim() || undefined,
      content: formCreateNews.content,
      thumbnailUrl: formCreateNews.thumbnailUrl || null,
      status,
    };

    if (editId) {
      updateNewsMutation.mutate(
        { id: editId, body },
        { onSuccess: () => router.push(`${basePath}/news`) }
      );
      return;
    }

    createNewsMutation.mutate(body, {
      onSuccess: () => router.push(`${basePath}/news`),
    });
  };

  const handleSaveDraft = () => executeSave('draft');

  const handlePublish = () => executeSave('published');

  const isSubmitting =
    createNewsMutation.isPending || updateNewsMutation.isPending || isNewsLoading;

  return (
    <NewsCreatePage
      form={formCreateNews}
      isEditMode={!!editId}
      isSubmitting={isSubmitting}
      onFormChange={handleFormChange}
      onContentChange={handleContentChange}
      onUploadThumbnail={handleUploadThumbnail}
      onUploadContentImage={handleUploadContentImage}
      onDeleteImage={handleDeleteImage}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
};

export default NewsCreateContainer;
