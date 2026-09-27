import React from 'react';
import {
  NewsCreateActionBar,
  NewsCreateEditorCard,
  NewsCreateMetadataCard,
} from '@/components/organisms/content_manager/news_create';
import type { CreateNewsRequest } from '@/types/service';

export interface NewsCreateTemplateProps {
  form: CreateNewsRequest;
  isEditMode: boolean;
  isSubmitting: boolean;
  onFormChange: <K extends keyof CreateNewsRequest>(field: K, value: CreateNewsRequest[K]) => void;
  onContentChange: (content: string) => void;
  onUploadThumbnail: (file: File) => Promise<string>;
  onUploadContentImage: (file: File) => Promise<string>;
  onDeleteImage: (url: string) => Promise<void>;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const NewsCreateTemplate: React.FC<NewsCreateTemplateProps> = ({
  form,
  isEditMode,
  isSubmitting,
  onFormChange,
  onContentChange,
  onUploadThumbnail,
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
          {isEditMode ? 'Edit News' : 'Buat News Baru'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola konten wacana literasi dan pengumuman untuk portal siswa.
        </p>
      </div>

      <NewsCreateMetadataCard
        form={form}
        isEditMode={isEditMode}
        onChange={onFormChange}
        onUploadThumbnail={onUploadThumbnail}
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

export default NewsCreateTemplate;
