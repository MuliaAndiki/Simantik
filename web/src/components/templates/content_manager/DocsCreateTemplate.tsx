import React from 'react';
import { DocsCreateMetadataCard } from '@/components/organisms/content_manager/docs_create';
import {
  NewsCreateActionBar,
  NewsCreateEditorCard,
} from '@/components/organisms/content_manager/news_create';
import type { CreateDocumentationRequest } from '@/types/service';

export interface DocsCreateTemplateProps {
  form: CreateDocumentationRequest;
  isEditMode: boolean;
  isSubmitting: boolean;
  categories?: string[];
  onFormChange: <K extends keyof CreateDocumentationRequest>(
    field: K,
    value: CreateDocumentationRequest[K]
  ) => void;
  onContentChange: (content: string) => void;
  onUploadContentImage: (file: File) => Promise<string>;
  onDeleteImage: (url: string) => Promise<void>;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const DocsCreateTemplate: React.FC<DocsCreateTemplateProps> = ({
  form,
  isEditMode,
  isSubmitting,
  categories = [],
  onFormChange,
  onContentChange,
  onUploadContentImage,
  onDeleteImage,
  onCancel,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6 md:space-y-7 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {isEditMode ? 'Edit Dokumen' : 'Buat Dokumen Baru'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola pusat bantuan dan dokumentasi panduan untuk portal siswa.
        </p>
      </div>

      <DocsCreateMetadataCard
        form={form}
        isEditMode={isEditMode}
        categories={categories}
        onChange={onFormChange}
      />

      <NewsCreateEditorCard
        content={form.content}
        onChange={onContentChange}
        onUploadImage={onUploadContentImage}
        onDeleteImage={onDeleteImage}
      />

      <div className="sticky bottom-4 z-30 pt-2">
        <NewsCreateActionBar
          onCancel={onCancel}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default DocsCreateTemplate;
