import React from 'react';
import { NewsCreateActionBar } from '@/components/organisms/content_manager/news_create';
import {
  type TutorialsCreateFormState,
  TutorialsCreateMetadataCard,
} from '@/components/organisms/content_manager/tutorials_create';

export interface TutorialsCreateTemplateProps {
  form: TutorialsCreateFormState;
  isEditMode: boolean;
  isSubmitting: boolean;
  onFormChange: <K extends keyof TutorialsCreateFormState>(
    field: K,
    value: TutorialsCreateFormState[K]
  ) => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const TutorialsCreateTemplate: React.FC<TutorialsCreateTemplateProps> = ({
  form,
  isEditMode,
  isSubmitting,
  onFormChange,
  onCancel,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6 md:space-y-7 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {isEditMode ? 'Edit Video' : 'Buat Video Baru'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola video pembelajaran YouTube untuk portal siswa.
        </p>
      </div>

      <TutorialsCreateMetadataCard form={form} isEditMode={isEditMode} onChange={onFormChange} />

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

export default TutorialsCreateTemplate;
