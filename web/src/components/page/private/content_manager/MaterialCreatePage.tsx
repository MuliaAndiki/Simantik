import type React from 'react';
import type { CompetencyDropdownActionProps } from '@/components/molecules/input/CompetencyCreatableSelect';
import { MaterialCreateTemplate } from '@/components/templates/content_manager';
import type {
  LearningObjectiveItem,
  MaterialMetadata,
  PreviewDocumentStructure,
  RelevantTopicTag,
} from '@/types/ui';

export interface MaterialCreatePageProps extends CompetencyDropdownActionProps {
  metadata?: MaterialMetadata;
  categories?: string[];
  content?: string;
  objectives?: LearningObjectiveItem[];
  structureItems?: PreviewDocumentStructure[];
  topics?: RelevantTopicTag[];
  onMetadataChange?: (next: Partial<MaterialMetadata>) => void;
  onContentChange?: (content: string) => void;
  onWordCountChange?: (count: number) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
  onAddObjective?: (text: string) => void;
  onRemoveObjective?: (id: string) => void;
  onAddStructureItem?: (label: string, text: string) => void;
  onRemoveStructureItem?: (index: number) => void;
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
  competencies,
  onCreateCompetency,
  onRequestDeleteCompetency,
  isCreatingCompetency,
  deletingCompetencyId,
  content,
  objectives,
  structureItems,
  topics,
  onMetadataChange,
  onContentChange,
  onWordCountChange,
  onUploadImage,
  onDeleteImage,
  onAddObjective,
  onRemoveObjective,
  onAddStructureItem,
  onRemoveStructureItem,
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
        competencies,
        onCreateCompetency,
        onRequestDeleteCompetency,
        isCreatingCompetency,
        deletingCompetencyId,
        onChange: onMetadataChange,
      }}
      editorProps={{
        content,
        onChange: onContentChange,
        onWordCountChange,
        onUploadImage,
        onDeleteImage,
      }}
      objectivesProps={{
        objectives,
        structureItems,
        topics,
        isAddingTopic,
        newTopicInput,
        onNewTopicInputChange,
        onStartAddTopic,
        onCancelAddTopic,
        onConfirmAddTopic,
        onRemoveTopic,
        onAddObjective,
        onRemoveObjective,
        onAddStructureItem,
        onRemoveStructureItem,
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
