'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type { TutorialsCreateFormState } from '@/components/organisms/content_manager/tutorials_create/TutorialsCreateMetadataCard';
import TutorialsCreatePage from '@/components/page/private/content_manager/TutorialsCreatePage';
import { useApi } from '@/hooks/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';

const EMPTY_TUTORIAL_FORM: TutorialsCreateFormState = {
  title: '',
  slug: '',
  description: '',
  youtube_url: '',
  duration_minutes: '',
  category: '',
  status: 'draft',
};

function isValidYoutubeUrl(url: string): boolean {
  return (
    url.includes('youtube.com/watch?v=') ||
    url.includes('youtu.be/') ||
    url.includes('/embed/') ||
    url.includes('/shorts/')
  );
}

function minutesToSeconds(raw: string): number | undefined {
  if (raw.trim() === '') return undefined;
  const minutes = Number(raw);
  if (!Number.isFinite(minutes) || minutes < 0) return undefined;
  return Math.round(minutes * 60);
}

const TutorialsCreateContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/content_manager';

  const api = useApi();
  const ns = useAppNameSpace();

  const [formCreateTutorial, setFormCreateTutorial] =
    useState<TutorialsCreateFormState>(EMPTY_TUTORIAL_FORM);

  const { data: existingTutorial, isLoading: isTutorialLoading } =
    api.content.query.cmsTutorialDetail(editId || '', { enabled: !!editId });

  const { data: categories = [] } = api.content.query.cmsTutorialCategories();

  const createTutorialMutation = api.content.mutate.createTutorial();
  const updateTutorialMutation = api.content.mutate.updateTutorial();

  useEffect(() => {
    if (existingTutorial) {
      setFormCreateTutorial({
        title: existingTutorial.title,
        slug: existingTutorial.slug,
        description: existingTutorial.description ?? '',
        youtube_url: existingTutorial.youtube_url,
        duration_minutes: existingTutorial.duration_seconds
          ? String(Math.round(existingTutorial.duration_seconds / 60))
          : '',
        category: existingTutorial.category ?? '',
        status: existingTutorial.status,
      });
    }
  }, [existingTutorial]);

  const handleFormChange = <K extends keyof TutorialsCreateFormState>(
    field: K,
    value: TutorialsCreateFormState[K]
  ) => {
    setFormCreateTutorial((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    router.push(`${basePath}/tutorials`);
  };

  const executeSave = (status: string) => {
    if (!formCreateTutorial.title.trim()) {
      ns.alert.toast({
        title: 'Judul Wajib Diisi',
        message: 'Mohon masukkan judul video sebelum menyimpan.',
        icon: 'warning',
      });
      return;
    }

    if (!formCreateTutorial.category.trim()) {
      ns.alert.toast({
        title: 'Kategori Wajib Diisi',
        message: 'Mohon masukkan kategori video sebelum menyimpan.',
        icon: 'warning',
      });
      return;
    }

    if (!formCreateTutorial.youtube_url.trim()) {
      ns.alert.toast({
        title: 'URL YouTube Wajib Diisi',
        message: 'Mohon masukkan URL video YouTube sebelum menyimpan.',
        icon: 'warning',
      });
      return;
    }

    if (!isValidYoutubeUrl(formCreateTutorial.youtube_url.trim())) {
      ns.alert.toast({
        title: 'URL YouTube Tidak Valid',
        message:
          'Mohon masukkan URL YouTube yang valid (mengandung youtube.com/watch?v=, youtu.be/, /embed/ atau /shorts/).',
        icon: 'warning',
      });
      return;
    }

    const body = {
      title: formCreateTutorial.title.trim(),
      slug: formCreateTutorial.slug?.trim() || undefined,
      description: formCreateTutorial.description?.trim() || undefined,
      youtube_url: formCreateTutorial.youtube_url.trim(),
      duration_seconds: minutesToSeconds(formCreateTutorial.duration_minutes),
      category: formCreateTutorial.category.trim(),
      status,
    };

    if (editId) {
      updateTutorialMutation.mutate(
        { id: editId, body },
        { onSuccess: () => router.push(`${basePath}/tutorials`) }
      );
      return;
    }

    createTutorialMutation.mutate(body, {
      onSuccess: () => router.push(`${basePath}/tutorials`),
    });
  };

  const handleSaveDraft = () => executeSave('draft');

  const handlePublish = () => executeSave('published');

  const isSubmitting =
    createTutorialMutation.isPending || updateTutorialMutation.isPending || isTutorialLoading;

  return (
    <TutorialsCreatePage
      form={formCreateTutorial}
      isEditMode={!!editId}
      isSubmitting={isSubmitting}
      categories={categories}
      onFormChange={handleFormChange}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
};

export default TutorialsCreateContainer;
