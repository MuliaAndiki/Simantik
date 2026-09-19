import React from 'react';
import {
  MaterialCreateActionBar,
  type MaterialCreateActionBarProps,
  MaterialEditorCard,
  type MaterialEditorCardProps,
  MaterialMetadataCard,
  type MaterialMetadataCardProps,
  MaterialObjectivesAndTagsCard,
  type MaterialObjectivesAndTagsCardProps,
} from '@/components/organisms/content_manager/material_create';
import { cn } from '@/utils/classname';

export interface MaterialCreateTemplateProps {
  metadataProps?: MaterialMetadataCardProps;
  editorProps?: MaterialEditorCardProps;
  objectivesProps?: MaterialObjectivesAndTagsCardProps;
  actionBarProps?: MaterialCreateActionBarProps;
  className?: string;
}

export const MaterialCreateTemplate: React.FC<MaterialCreateTemplateProps> = ({
  metadataProps,
  editorProps,
  objectivesProps,
  actionBarProps,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-7xl mx-auto space-y-6 md:space-y-7 pb-12', className)}>
      {/* 1. Metadata Form Card */}
      <MaterialMetadataCard {...metadataProps} />

      {/* 2. Document Studio Editor Card */}
      <MaterialEditorCard {...editorProps} />

      {/* 3. Learning Objectives & Relevant Topics Card */}
      <MaterialObjectivesAndTagsCard {...objectivesProps} />

      {/* 4. Sticky Bottom Action Bar */}
      <div className="sticky bottom-4 z-30 pt-2">
        <MaterialCreateActionBar {...actionBarProps} />
      </div>
    </div>
  );
};

export default MaterialCreateTemplate;
