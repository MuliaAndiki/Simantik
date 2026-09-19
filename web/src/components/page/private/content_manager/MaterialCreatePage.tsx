import React from 'react';
import { MaterialCreateTemplate } from '@/components/templates/content_manager';
import type { LearningObjectiveItem, MaterialMetadata, RelevantTopicTag } from '@/types/ui';

export interface MaterialCreatePageProps {
  metadata?: MaterialMetadata;
  categories?: string[];
  content?: string;
  objectives?: LearningObjectiveItem[];
  topics?: RelevantTopicTag[];
  onMetadataChange?: (next: Partial<MaterialMetadata>) => void;
  onContentChange?: (content: string) => void;
  onWordCountChange?: (count: number) => void;
  onAddTopic?: (label: string) => void;
  onRemoveTopic?: (id: string) => void;
  isAddingTopic?: boolean;
  newTopicInput?: string;
  onNewTopicInputChange?: (val: string) => void;
  onStartAddTopic?: () => void;
  onCancelAddTopic?: () => void;
  onConfirmAddTopic?: () => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onSubmitReview?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export const MaterialCreatePage: React.FC<MaterialCreatePageProps> = ({
  metadata,
  categories,
  content,
  objectives,
  topics,
  onMetadataChange,
  onContentChange,
  onWordCountChange,
  onAddTopic,
  onRemoveTopic,
  isAddingTopic,
  newTopicInput,
  onNewTopicInputChange,
  onStartAddTopic,
  onCancelAddTopic,
  onConfirmAddTopic,
  onCancel,
  onSaveDraft,
  onSubmitReview,
  isSubmitting,
  className,
}) => {
  return (
    <MaterialCreateTemplate
      className={className}
      metadataProps={{
        metadata,
        categories,
        onChange: onMetadataChange,
      }}
      editorProps={{
        content,
        onChange: onContentChange,
        onWordCountChange,
      }}
      objectivesProps={{
        objectives,
        topics,
        isAddingTopic,
        newTopicInput,
        onNewTopicInputChange,
        onStartAddTopic,
        onCancelAddTopic,
        onConfirmAddTopic,
        onRemoveTopic,
      }}
      actionBarProps={{
        onCancel,
        onSaveDraft,
        onSubmitReview,
        isSubmitting,
      }}
    />
  );
};

export default MaterialCreatePage;
